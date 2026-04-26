import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';

type SpeechRecognitionAlternative = {
  transcript: string;
};

type SpeechRecognitionResult = {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
};

type SpeechRecognitionEvent = Event & {
  resultIndex: number;
  results: SpeechRecognitionResult[];
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function SkillsIntake({ onSwitchToManual }: { onSwitchToManual: () => void }) {
  const [isListening, setIsListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const shouldResumeRef = useRef(false);

  const isSpeechSupported = useMemo(
    () => typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
    [],
  );

  useEffect(() => {
    if (!isSpeechSupported) return;

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      let finalized = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (!result?.[0]) continue;

        if (result.isFinal) {
          finalized += `${result[0].transcript} `;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalized.trim()) {
        setFinalTranscript((current) => `${current}${current ? ' ' : ''}${finalized.trim()}`.trim());
      }
      setInterimTranscript(interim);
      setErrorMessage('');
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      shouldResumeRef.current = false;
      setErrorMessage(
        event.error === 'not-allowed'
          ? 'Microphone permission was denied. Please enable microphone access.'
          : 'Voice capture failed. Please try again or switch to manual input.',
      );
    };

    recognition.onend = () => {
      if (shouldResumeRef.current) {
        recognition.start();
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldResumeRef.current = false;
      if (finalTranscript.trim()) {
        localStorage.setItem('gotskilled.voiceTranscript', finalTranscript.trim());
      }
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, [isSpeechSupported, finalTranscript]);

  useEffect(() => {
    if (!finalTranscript.trim()) return;
    localStorage.setItem('gotskilled.voiceTranscript', finalTranscript.trim());
  }, [finalTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      shouldResumeRef.current = false;
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    try {
      setErrorMessage('');
      shouldResumeRef.current = true;
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setErrorMessage('Voice capture failed to start. Please try again.');
      setIsListening(false);
      shouldResumeRef.current = false;
    }
  };

  const visibleTranscript = `${finalTranscript}${finalTranscript && interimTranscript ? ' ' : ''}${interimTranscript}`.trim();

  return (
    <div className="flex flex-col min-h-screen pt-24 md:pt-32 px-6 pb-24 md:pb-32 max-w-7xl mx-auto items-center">
      <div className="max-w-2xl w-full flex flex-col items-center">
        {/* Progress Circles */}
        <div className="w-full flex justify-between items-center mb-20 gap-4">
          <div className="flex-1 h-3 bg-secondary rounded-full shadow-[0_0_12px_rgba(75,65,225,0.4)]"></div>
          <div className="flex-1 h-3 bg-slate-100 rounded-full"></div>
          <div className="flex-1 h-3 bg-slate-100 rounded-full"></div>
          <div className="flex-1 h-3 bg-slate-100 rounded-full"></div>
        </div>

        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-violet-50 border border-violet-100 rounded-2xl">
            <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-[12px] font-black text-secondary tracking-[0.2em] uppercase">AI Talent Intake</span>
          </div>
          <h2 className="text-[48px] md:text-[64px] font-black text-primary leading-[1.1] tracking-tighter">Tell us your story.</h2>
          <p className="text-lg md:text-xl text-on-surface-variant font-medium max-w-lg mx-auto">
            Describe your daily work, your proudest projects, or your hidden expertise. Our AI will translate it into a Global Skill DNA.
          </p>
        </div>

        <div className="relative flex items-center justify-center py-20 mb-16">
          {/* Decorative Pulsing Blobs */}
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full -z-10"
          />
          
          <button
            onClick={toggleListening}
            disabled={!isSpeechSupported}
            className="relative w-48 h-48 bg-primary rounded-[60px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] flex items-center justify-center group active:scale-95 transition-all duration-300 border-[12px] border-white ring-1 ring-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <motion.div 
               animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute inset-[-20px] rounded-[70px] border-2 border-primary/10"
            />
            <motion.div 
               animate={{ scale: [1, 1.25, 1] }}
               transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
               className="absolute inset-[-40px] rounded-[80px] border border-primary/5"
            />
            <span className="material-symbols-outlined text-white text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-10 mb-20">
          <div className="flex items-center gap-4">
            <motion.div 
              animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-secondary rounded-full"
            />
            <p className="text-[14px] font-black text-secondary tracking-[0.3em] uppercase">
              {isSpeechSupported ? (isListening ? 'Listening for the narrative...' : 'Tap mic to start voice input') : 'Voice input is not supported in this browser'}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
          >
            <p className="text-[11px] font-black text-primary tracking-[0.25em] uppercase mb-3">Live Transcript</p>
            <p className="min-h-[88px] text-[15px] leading-relaxed text-on-surface-variant">
              {visibleTranscript || 'Your speech will appear here live while you talk.'}
            </p>
            {errorMessage && <p className="mt-3 text-sm font-medium text-red-600">{errorMessage}</p>}
          </motion.div>
          
          <button
            onClick={onSwitchToManual}
            className="text-secondary font-black text-[12px] tracking-widest uppercase border-b-2 border-secondary/20 pb-1 hover:border-secondary transition-all"
          >
            Switch to manual text input
          </button>
        </div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex gap-8 items-center"
        >
          <div className="p-4 bg-primary/5 rounded-[24px]">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
          </div>
          <div className="space-y-1">
            <p className="font-black text-[12px] text-primary tracking-[0.2em] uppercase">Expert Tip</p>
            <p className="text-[16px] text-on-surface-variant font-medium leading-relaxed">
              Don't just list titles. Describe the <span className="font-bold text-primary italic">complexity</span> and <span className="font-bold text-primary italic">impact</span> of your work to optimize matching.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
