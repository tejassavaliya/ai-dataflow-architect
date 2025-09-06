export type ChatMessage = { role: 'user' | 'assistant', content: string }
export type GraphPayload = { nodes: any[]; edges: any[] } | undefined

export async function askAI(history: ChatMessage[]): Promise<{ text: string; graph?: GraphPayload }> {
  const base = import.meta.env.VITE_API_BASE || ''
  const res = await fetch(`${base}/api/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`AI error: ${res.status} ${text}`)
  }
  const data = await res.json()
  // Debug
  console.log('askAI <-', { hasGraph: !!data.graph, text: (data.text || '').slice(0, 80) })
  return { text: data.text as string, graph: data.graph as GraphPayload }
}
