const LLM_BASE_URL = process.env.LLM_BASE_URL ?? 'http://llm:11434/api/chat';

type AssistantMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type AssistantPayload = {
  model?: string;
  messages: AssistantMessage[];
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as Partial<AssistantPayload>;

  if (!payload.messages || payload.messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages array is required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const body = JSON.stringify({
    model: payload.model ?? 'llama3',
    messages: payload.messages,
    stream: false,
  });

  try {
    const upstream = await fetch(LLM_BASE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
    });
  } catch (error) {
    console.error('LLM request failed', error);
    return new Response(JSON.stringify({ error: 'LLM service unreachable' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }
}

