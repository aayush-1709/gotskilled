import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type GuidedStep = 1 | 2 | 3 | 4;

type GuidedFlowContextValue = {
  currentStep: GuidedStep;
  totalSteps: 4;
  isGuidedMode: boolean;
  isCompleted: boolean;
  startGuidedMode: () => void;
  goToStep: (step: GuidedStep) => void;
  nextStep: () => void;
  exitGuidedMode: () => void;
  restartGuidedMode: () => void;
};

const GuidedFlowContext = createContext<GuidedFlowContextValue | null>(null);

export function GuidedFlowProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<GuidedStep>(1);
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const startGuidedMode = () => {
    setCurrentStep(1);
    setIsGuidedMode(true);
    setIsCompleted(false);
  };

  const goToStep = (step: GuidedStep) => {
    setCurrentStep(step);
    setIsGuidedMode(true);
    setIsCompleted(false);
  };

  const nextStep = () => {
    if (currentStep >= 4) {
      setIsCompleted(true);
      setIsGuidedMode(false);
      return;
    }
    setCurrentStep((prev) => (prev + 1) as GuidedStep);
  };

  const exitGuidedMode = () => {
    setIsGuidedMode(false);
  };

  const restartGuidedMode = () => {
    setCurrentStep(1);
    setIsGuidedMode(true);
    setIsCompleted(false);
  };

  const value = useMemo<GuidedFlowContextValue>(
    () => ({
      currentStep,
      totalSteps: 4,
      isGuidedMode,
      isCompleted,
      startGuidedMode,
      goToStep,
      nextStep,
      exitGuidedMode,
      restartGuidedMode,
    }),
    [currentStep, isGuidedMode, isCompleted],
  );

  return <GuidedFlowContext.Provider value={value}>{children}</GuidedFlowContext.Provider>;
}

export function useGuidedFlow() {
  const context = useContext(GuidedFlowContext);
  if (!context) {
    throw new Error('useGuidedFlow must be used within GuidedFlowProvider');
  }
  return context;
}

