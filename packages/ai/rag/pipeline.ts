/**
 * ITER AI Advisor - RAG Pipeline
 *
 * Retrieves relevant ITER methodology chunks using pgvector
 * semantic similarity search in Supabase.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, PillarType } from '@iter/db/types/database'

// --- Types ---

interface RetrievedChunk {
  id: string
  title: string
  content: string
  pillar: PillarType | null
  similarity: number
}

interface RAGConfig {
  matchThreshold: number
  matchCount: number
  filterPillar?: PillarType | null
}

const DEFAULT_CONFIG: RAGConfig = {
  matchThreshold: 0.75,
  matchCount: 5,
  filterPillar: null,
}

// --- Embedding ---

export async function generateEmbedding(
  text: string,
  apiKey: string
): Promise<number[]> {
  // Using Anthropic's recommended embedding approach
  // In production, consider using a dedicated embedding model
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  })

  if (!response.ok) {
    throw new Error(`Embedding API error: ${response.status}`)
  }

  const data = await response.json()
  return data.data[0].embedding
}

// --- Retrieval ---

export async function retrieveMethodology(
  supabase: SupabaseClient<Database>,
  queryEmbedding: number[],
  config: Partial<RAGConfig> = {}
): Promise<RetrievedChunk[]> {
  const { matchThreshold, matchCount, filterPillar } = {
    ...DEFAULT_CONFIG,
    ...config,
  }

  const { data, error } = await supabase.rpc('match_methodology', {
    query_embedding: queryEmbedding as any,
    match_threshold: matchThreshold,
    match_count: matchCount,
    filter_pillar: filterPillar ?? null,
  })

  if (error) {
    console.error('RAG retrieval error:', error)
    return []
  }

  return (data ?? []) as RetrievedChunk[]
}

// --- Full RAG Pipeline ---

export async function ragPipeline(
  supabase: SupabaseClient<Database>,
  query: string,
  embeddingApiKey: string,
  config?: Partial<RAGConfig>
): Promise<RetrievedChunk[]> {
  // 1. Generate embedding for the user's query
  const queryEmbedding = await generateEmbedding(query, embeddingApiKey)

  // 2. Retrieve relevant methodology chunks
  const chunks = await retrieveMethodology(supabase, queryEmbedding, config)

  // 3. Filter by quality threshold
  return chunks.filter(c => c.similarity >= (config?.matchThreshold ?? 0.75))
}

// --- Ingestion (for loading methodology docs) ---

export interface MethodologyDoc {
  title: string
  content: string
  pillar: PillarType | null
  metadata?: Record<string, unknown>
}

export async function ingestMethodologyDoc(
  supabase: SupabaseClient<Database>,
  doc: MethodologyDoc,
  embeddingApiKey: string,
  chunkSize: number = 600,
  chunkOverlap: number = 100
): Promise<number> {
  // Split content into chunks
  const chunks = chunkText(doc.content, chunkSize, chunkOverlap)

  let inserted = 0
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i], embeddingApiKey)

    const { error } = await supabase.from('methodology_documents').insert({
      title: doc.title,
      pillar: doc.pillar,
      content: chunks[i],
      embedding: embedding as any,
      metadata: {
        ...doc.metadata,
        chunk_total: chunks.length,
      },
      chunk_index: i,
    })

    if (!error) inserted++
  }

  return inserted
}

function chunkText(text: string, maxTokens: number, overlap: number): string[] {
  // Simple word-based chunking (approx 1 token ≈ 0.75 words for Portuguese)
  const words = text.split(/\s+/)
  const wordsPerChunk = Math.floor(maxTokens * 0.75)
  const overlapWords = Math.floor(overlap * 0.75)

  const chunks: string[] = []
  let start = 0

  while (start < words.length) {
    const end = Math.min(start + wordsPerChunk, words.length)
    chunks.push(words.slice(start, end).join(' '))
    start = end - overlapWords
    if (start >= words.length - overlapWords) break
  }

  return chunks
}
