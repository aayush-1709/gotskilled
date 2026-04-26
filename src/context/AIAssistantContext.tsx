import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AssistantContextKey = 'profile' | 'jobs' | 'skills' | 'future' | 'policy' | 'general';

export type UserDataPayload = {
  profile: Record<string, unknown>;
  skills: Record<string, unknown>[];
  risk: Record<string, unknown>;
  opportunities: Record<string, unknown>[];
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  insight?: string;
  actions?: string[];
  timestamp: number;
};

type AIAssistantContextValue = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  chatHistory: ChatMessage[];
  setChatHistory: (value: ChatMessage[]) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  currentContext: AssistantContextKey;
  setCurrentContext: (value: AssistantContextKey) => void;
  userData: UserDataPayload;
  setUserData: (value: UserDataPayload) => void;
};

const AI_CONTEXT_STORAGE_KEY = 'gotskilled.ai.chatHistory';
const AI_CONTEXT_OPEN_KEY = 'gotskilled.ai.isOpen';

const AIAssistantContext = createContext<AIAssistantContextValue | null>(null);

const defaultUserData: UserDataPayload = {
  profile: {},
  skills: [],
  risk: {},
  opportunities: [],
};

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem(AI_CONTEXT_OPEN_KEY) === 'true');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const raw = localStorage.getItem(AI_CONTEXT_STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as ChatMessage[];
      return Array.isArray(parsed) ? parsed.slice(-10) : [];
    } catch {
      return [];
    }
  });
  const [currentContext, setCurrentContext] = useState<AssistantContextKey>('general');
  const [userData, setUserData] = useState<UserDataPayload>(defaultUserData);

  useEffect(() => {
    localStorage.setItem(AI_CONTEXT_STORAGE_KEY, JSON.stringify(chatHistory.slice(-10)));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem(AI_CONTEXT_OPEN_KEY, String(isOpen));
  }, [isOpen]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setChatHistory((current) => [
      ...current.slice(-9),
      {
        ...message,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: Date.now(),
      },
    ]);
  };

  const value = useMemo<AIAssistantContextValue>(
    () => ({
      isOpen,
      setIsOpen,
      chatHistory,
      setChatHistory,
      addMessage,
      currentContext,
      setCurrentContext,
      userData,
      setUserData,
    }),
    [isOpen, chatHistory, currentContext, userData],
  );

  return <AIAssistantContext.Provider value={value}>{children}</AIAssistantContext.Provider>;
}

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error('useAIAssistant must be used within AIAssistantProvider');
  }
  return context;
}

