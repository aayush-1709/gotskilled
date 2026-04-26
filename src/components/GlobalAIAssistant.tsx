import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAIAssistant, type AssistantContextKey } from '@/src/context/AIAssistantContext';
import { postContextChat } from '@/src/lib/aiClient';

type GlobalAIAssistantProps = {
  onNavigate: (target: AssistantContextKey) => void;
};

const suggestedPromptsByContext: Record<AssistantContextKey, string[]> = {
  profile: ['Explain my strengths', 'What should I improve?'],
  jobs: ['Which job should I choose?', 'What skills am I missing?'],
  future: ['What should I do next?', 'How can I reduce my risk?'],
  skills: ['Which skills are most valuable?', 'What should I learn next?'],
  policy: ['What are key risks in this region?', 'Suggest policy improvements'],
  general: ['Give me guidance based on my profile', 'What should I focus on this week?'],
};

const autoSuggestionByContext: Record<AssistantContextKey, string> = {
  profile: 'Your profile has strong practical experience. Want a quick summary you can use in interviews?',
  jobs: 'You have multiple high-match roles. Want help choosing the best one for immediate income growth?',
  skills: 'You have strong core repair skills. Want to see what to learn next for higher-paying roles?',
  future: 'Your automation risk is moderate. Want a concrete 30-day plan to reduce it?',
  policy: 'I can highlight regional risks and suggest policy interventions based on your data.',
  general: 'I am ready to help across profile, skills, jobs, and future planning.',
};

const mapActionToContext = (action: string): AssistantContextKey | null => {
  const value = action.toLowerCase();
  if (value.includes('job')) return 'jobs';
  if (value.includes('learn') || value.includes('skill')) return 'skills';
  if (value.includes('future') || value.includes('risk')) return 'future';
  if (value.includes('policy')) return 'policy';
  if (value.includes('profile')) return 'profile';
  return null;
};

export function GlobalAIAssistant({ onNavigate }: GlobalAIAssistantProps) {
  const {
    isOpen,
    setIsOpen,
    chatHistory,
    addMessage,
    currentContext,
    userData,
  } = useAIAssistant();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const initializedContextsRef = useRef<Set<AssistantContextKey>>(new Set());
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const suggestions = useMemo(() => suggestedPromptsByContext[currentContext] ?? suggestedPromptsByContext.general, [currentContext]);

  useEffect(() => {
    if (initializedContextsRef.current.has(currentContext)) return;
    initializedContextsRef.current.add(currentContext);
    addMessage({
      role: 'assistant',
      content: autoSuggestionByContext[currentContext],
      insight: 'Auto-suggestion',
      actions: [],
    });
  }, [currentContext, addMessage]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, isLoading, isOpen]);

  const askAssistant = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    addMessage({ role: 'user', content: trimmed });
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await postContextChat({
        query: trimmed,
        context: currentContext,
        user_data: userData,
      });

      addMessage({
        role: 'assistant',
        content: response.response,
        insight: response.insight,
        actions: response.actions,
      });
    } catch {
      addMessage({
        role: 'assistant',
        content: 'Unable to reach AI service right now. Please retry in a moment.',
        insight: 'Connection issue',
        actions: ['View Jobs', 'Improve Skills'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 md:bottom-10 right-5 md:right-8 z-[80] w-14 h-14 rounded-full bg-primary text-white shadow-2xl hover:bg-secondary transition-all flex items-center justify-center"
        aria-label="Toggle AI assistant"
      >
        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-40 md:bottom-28 right-4 md:right-8 z-[79] w-[calc(100vw-2rem)] md:w-[420px] h-[560px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <p className="text-[11px] font-black tracking-[0.2em] uppercase text-secondary">Global AI Assistant</p>
              <p className="text-sm text-on-surface-variant font-medium mt-1">Context: {currentContext}</p>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-white">
              {chatHistory.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 text-primary'}`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.insight && message.role === 'assistant' && (
                      <p className="mt-2 text-xs font-semibold text-secondary">{message.insight}</p>
                    )}
                    {message.actions && message.actions.length > 0 && message.role === 'assistant' && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.actions.slice(0, 3).map((action) => (
                          <button
                            key={action}
                            onClick={() => {
                              const target = mapActionToContext(action);
                              if (target) onNavigate(target);
                            }}
                            className="text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl bg-white border border-slate-200 text-secondary"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-primary rounded-2xl px-4 py-3 text-sm font-medium">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-100 bg-white space-y-3">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => askAssistant(prompt)}
                    className="text-[10px] px-3 py-2 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary font-black uppercase tracking-widest"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  askAssistant(inputValue);
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Ask your AI assistant..."
                  className="flex-1 h-11 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="h-11 px-4 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

