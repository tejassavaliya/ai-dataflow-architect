import { googleAI } from '@genkit-ai/google-genai';
import type { Handler } from '@netlify/functions';
import { genkit } from 'genkit';
import { AI_PROMPTS, GRAPH_SCHEMA_EXAMPLE } from '../constants/prompts';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const ai = genkit({ plugins: [googleAI({ apiKey })] });

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const messages = (body.messages ?? []) as Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;
    const convo = messages.map((m) => `${m.role}: ${m.content}`).join('\n');

    // Ask the model to produce a human-readable message AND (optionally) a GRAPH_JSON block.
    const resp = await ai.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: [
        ...AI_PROMPTS.SYSTEM_PROMPT,
        JSON.stringify(GRAPH_SCHEMA_EXAMPLE, null, 2),
        '',
        AI_PROMPTS.CONVERSATION_PREFIX,
        convo,
      ].join('\n'),
    });

    const raw = resp.text;
    let { messageText, graph } = splitMessageAndGraph(raw);

    // Deterministic guarantee: if it says "ready" but no graph, force a JSON-only pass.
    if (
      !graph &&
      /ready|configured|finali[sz]ed?|pipeline.*ready/i.test(messageText)
    ) {
      const force = await ai.generate({
        model: googleAI.model('gemini-2.5-flash'),
        prompt: [
          ...AI_PROMPTS.FORCE_JSON_PROMPT,
          convo,
        ].join('\n'),
      });
      const forced = splitMessageAndGraph(
        `GRAPH_JSON:\n\`\`\`json\n${force.text}\n\`\`\``
      );
      if (forced.graph) graph = forced.graph;
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: messageText, graph }),
    };
  } catch (e: any) {
    console.error(e);
    return { statusCode: 500, body: e?.message || 'Server error' };
  }
};

function splitMessageAndGraph(s: string): { messageText: string; graph?: any } {
  const msgMatch = s.match(
    /MESSAGE:\s*([\s\S]*?)(?:\n{2,}|GRAPH_JSON:|```|$)/i
  );
  const messageText = (msgMatch?.[1] ?? s).trim();

  // Prefer GRAPH_JSON fenced block
  const block =
    s.match(/GRAPH_JSON:[\s\S]*?```json\s*([\s\S]*?)```/i) ||
    s.match(/GRAPH_JSON:[\s\S]*?```\s*([\s\S]*?)```/i);

  if (block) {
    try {
      const g = JSON.parse(block[1]);
      if (isGraphShape(g)) return { messageText, graph: g };
    } catch {}
  }

  // Fallback: any fenced JSON
  const anyBlock =
    s.match(/```json\s*([\s\S]*?)```/i) || s.match(/```\s*([\s\S]*?)```/i);
  if (anyBlock) {
    try {
      const g = JSON.parse(anyBlock[1]);
      if (isGraphShape(g)) return { messageText, graph: g };
    } catch {}
  }

  return { messageText };
}

function isGraphShape(g: any) {
  return g && Array.isArray(g.nodes) && Array.isArray(g.edges);
}
