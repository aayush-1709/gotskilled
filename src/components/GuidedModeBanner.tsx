import { motion } from 'motion/react';
import { useGuidedFlow, type GuidedStep } from '@/src/context/GuidedFlowContext';

type GuidedModeBannerProps = {
  onNext: () => void;
};

const stepConfig: Record<GuidedStep, { title: string; next: string }> = {
  1: { title: 'Review your skills profile', next: 'Check your risk & readiness' },
  2: { title: 'Understand your risk & readiness', next: 'Explore top opportunities' },
  3: { title: 'Compare opportunity matches', next: 'Review next best actions' },
  4: { title: 'Take your next best action', next: 'Complete guided flow' },
};

export function GuidedModeBanner({ onNext }: GuidedModeBannerProps) {
  const { currentStep, totalSteps, isGuidedMode, isCompleted, exitGuidedMode, restartGuidedMode } = useGuidedFlow();

  if (!isGuidedMode && !isCompleted) return null;

  if (isCompleted) {
    return (
      <div className="sticky top-16 z-[65] border-b border-emerald-100 bg-emerald-50/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-emerald-800 font-bold">You are ready to take action 🚀</p>
          <button
            onClick={restartGuidedMode}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest"
          >
            Restart Guided Mode
          </button>
        </div>
      </div>
    );
  }

  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="sticky top-16 z-[65] border-b border-secondary/20 bg-white/95 backdrop-blur-md px-4 py-3">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="text-sm font-bold text-primary">
            Step {currentStep}/{totalSteps}: {stepConfig[currentStep].title} → Next: {stepConfig[currentStep].next}
          </p>
          <div className="flex gap-2">
            <button
              onClick={exitGuidedMode}
              className="px-3 py-2 rounded-xl border border-slate-200 text-primary text-[10px] font-black uppercase tracking-widest"
            >
              Exit Guided Mode
            </button>
            <button
              onClick={onNext}
              className="px-4 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest"
            >
              {currentStep === 4 ? 'Finish' : 'Next Step'}
            </button>
          </div>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-ai-gradient rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </div>
    </div>
  );
}

