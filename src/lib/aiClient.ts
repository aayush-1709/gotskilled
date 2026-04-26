import type { AssistantContextKey, UserDataPayload } from '@/src/context/AIAssistantContext';

export type ContextChatRequest = {
  query: string;
  context: AssistantContextKey;
  user_data: UserDataPayload;
};

export type ContextChatResponse = {
  response: string;
  insight: string;
  actions: string[];
};

export async function postContextChat(payload: ContextChatRequest): Promise<ContextChatResponse> {
  const apiBaseUrl = import.meta.env.VITE_AI_API_BASE_URL ?? 'http://127.0.0.1:8000';
  const response = await fetch(`${apiBaseUrl}/ai/context-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`AI request failed with status ${response.status}`);
  }

  const data = (await response.json()) as ContextChatResponse;
  return {
    response: data.response ?? '',
    insight: data.insight ?? '',
    actions: Array.isArray(data.actions) ? data.actions : [],
  };
}

