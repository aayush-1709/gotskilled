import { useEffect, useRef, useState } from 'react';
import { Header, BottomNav } from './components/Navigation';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { SkillsProfile } from './screens/SkillsProfile';
import { SkillsIntake } from './screens/SkillsIntake';
import { FutureReadiness } from './screens/FutureReadiness';
import { JobMatches } from './screens/JobMatches';
import { AICoach } from './screens/AICoach';
import { PolicymakerDashboard } from './screens/PolicymakerDashboard';
import { PolicyScreen } from './screens/PolicyScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ManualTextInput } from './screens/ManualTextInput';
import { ProfileScreen } from './screens/ProfileScreen';
import { AnimatePresence, motion } from 'motion/react';
import { GlobalAIAssistant } from './components/GlobalAIAssistant';
import { useAIAssistant, type AssistantContextKey } from './context/AIAssistantContext';
import { buildJobsForProfile, mobileRepairProfile } from './data/careerData';
import { GuidedModeBanner } from './components/GuidedModeBanner';
import { useGuidedFlow } from './context/GuidedFlowContext';

type ScreenId = 'welcome' | 'home' | 'coach' | 'skills' | 'jobs' | 'future' | 'map' | 'policy' | 'settings' | 'intake' | 'manual-input' | 'profile';
type AppNavState = {
  __gotskilled: true;
  activeTab: ScreenId;
  onboardingComplete: boolean;
  isPolicymaker: boolean;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ScreenId>('welcome');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isPolicymaker, setIsPolicymaker] = useState(false);
  const handlingPopStateRef = useRef(false);
  const { setCurrentContext, setUserData, addMessage } = useAIAssistant();
  const { currentStep, isGuidedMode, startGuidedMode, nextStep, goToStep } = useGuidedFlow();
  const announcedStepRef = useRef<number | null>(null);

  const getPathForTab = (tab: ScreenId) => {
    if (tab === 'welcome') return '/';
    return `/${tab}`;
  };

  const parsePathToTab = (path: string): ScreenId => {
    const cleanPath = path.replace(/^\/+/, '') as ScreenId | '';
    const knownTabs: ScreenId[] = ['welcome', 'home', 'coach', 'skills', 'jobs', 'future', 'map', 'policy', 'settings', 'intake', 'manual-input', 'profile'];
    if (!cleanPath) return 'welcome';
    return knownTabs.includes(cleanPath) ? cleanPath : 'welcome';
  };

  const applyNavState = (nextState: AppNavState) => {
    setActiveTab(nextState.activeTab);
    setOnboardingComplete(nextState.onboardingComplete);
    setIsPolicymaker(nextState.isPolicymaker);
    localStorage.setItem('gotskilled.onboardingComplete', String(nextState.onboardingComplete));
    localStorage.setItem('gotskilled.isPolicymaker', String(nextState.isPolicymaker));
  };

  const navigateTo = (
    tab: ScreenId,
    options?: { replace?: boolean; onboarding?: boolean; policymaker?: boolean },
  ) => {
    const nextState: AppNavState = {
      __gotskilled: true,
      activeTab: tab,
      onboardingComplete: options?.onboarding ?? onboardingComplete,
      isPolicymaker: options?.policymaker ?? isPolicymaker,
    };

    applyNavState(nextState);

    if (handlingPopStateRef.current) return;

    const targetPath = getPathForTab(tab);
    if (options?.replace) {
      window.history.replaceState(nextState, '', targetPath);
      return;
    }
    window.history.pushState(nextState, '', targetPath);
  };

  // Simple routing logic
  const renderScreen = () => {
    if (!onboardingComplete) {
      if (activeTab === 'welcome') return <WelcomeScreen onStart={() => navigateTo('intake')} />;
      if (activeTab === 'intake') return <SkillsIntake onSwitchToManual={() => navigateTo('manual-input')} />;
      if (activeTab === 'manual-input') {
        return (
          <ManualTextInput
            onBackToVoice={() => navigateTo('intake')}
            onSaveProfile={() => {
              startGuidedMode();
              navigateTo('profile', { onboarding: true });
            }}
          />
        );
      }
      return <WelcomeScreen onStart={() => navigateTo('intake')} />;
    }

    if (isPolicymaker) {
      switch (activeTab) {
        case 'home':
        case 'map': return <PolicymakerDashboard />;
        case 'coach': return <AICoach />;
        case 'policy': return <PolicyScreen />;
        case 'settings': return <SettingsScreen onLogout={handleLogout} />;
        default: return <PolicymakerDashboard />;
      }
    }

    switch (activeTab) {
      case 'profile': return <ProfileScreen onEditProfile={() => navigateTo('manual-input')} />;
      case 'home': return <SkillsProfile />;
      case 'skills': return <SkillsProfile />;
      case 'coach': return <AICoach />;
      case 'jobs': return <JobMatches />;
      case 'future': return <FutureReadiness />;
      case 'intake': return <SkillsIntake onSwitchToManual={() => navigateTo('manual-input')} />;
      case 'manual-input':
        return (
          <ManualTextInput
            onBackToVoice={() => navigateTo('profile')}
            onSaveProfile={() => {
              startGuidedMode();
              navigateTo('profile');
            }}
          />
        );
      case 'settings': return <SettingsScreen onLogout={handleLogout} />;
      default: return <SkillsProfile />;
    }
  };

  const handleStartApp = () => {
    startGuidedMode();
    navigateTo('profile', { onboarding: true });
  };

  const handleLogout = () => {
    navigateTo('welcome', { onboarding: false, policymaker: false });
  };

  const toggleMode = () => {
    navigateTo('home', { onboarding: true, policymaker: !isPolicymaker });
  };

  const showNav = onboardingComplete && activeTab !== 'welcome';
  const showHeader = activeTab !== 'welcome';

  const getAssistantContext = (tab: ScreenId, policymaker: boolean): AssistantContextKey => {
    if (policymaker && (tab === 'map' || tab === 'policy')) return 'policy';
    if (tab === 'profile') return 'profile';
    if (tab === 'jobs') return 'jobs';
    if (tab === 'skills' || tab === 'home') return 'skills';
    if (tab === 'future') return 'future';
    if (tab === 'policy' || tab === 'map') return 'policy';
    return 'general';
  };

  useEffect(() => {
    const savedOnboarding = localStorage.getItem('gotskilled.onboardingComplete') === 'true';
    const savedPolicymaker = localStorage.getItem('gotskilled.isPolicymaker') === 'true';
    const pathTab = parsePathToTab(window.location.pathname);
    const state = window.history.state as AppNavState | null;

    const isPostOnboardingTab = pathTab !== 'welcome' && pathTab !== 'intake' && pathTab !== 'manual-input';
    const initialState: AppNavState =
      state && state.__gotskilled
        ? state
        : {
            __gotskilled: true,
            activeTab: pathTab,
            onboardingComplete: isPostOnboardingTab ? true : savedOnboarding,
            isPolicymaker: savedPolicymaker,
          };

    applyNavState(initialState);
    window.history.replaceState(initialState, '', getPathForTab(initialState.activeTab));

    const onPopState = (event: PopStateEvent) => {
      const poppedState = event.state as AppNavState | null;
      handlingPopStateRef.current = true;

      if (poppedState && poppedState.__gotskilled) {
        applyNavState(poppedState);
      } else {
        const poppedTab = parsePathToTab(window.location.pathname);
        const fallbackState: AppNavState = {
          __gotskilled: true,
          activeTab: poppedTab,
          onboardingComplete: poppedTab !== 'welcome' && poppedTab !== 'intake' && poppedTab !== 'manual-input',
          isPolicymaker: savedPolicymaker,
        };
        applyNavState(fallbackState);
      }

      handlingPopStateRef.current = false;
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const jobs = buildJobsForProfile(mobileRepairProfile);
    const topOpportunities = jobs
      .sort((a, b) => b.match - a.match)
      .slice(0, 8)
      .map((item) => ({
        role: item.title,
        match: item.match,
        income: item.income,
        growth: item.growth,
      }));

    setUserData({
      profile: {
        name: mobileRepairProfile.name,
        role: mobileRepairProfile.currentRole,
        yearsExperience: mobileRepairProfile.yearsExperience,
        educationLevel: mobileRepairProfile.educationLevel,
        location: mobileRepairProfile.location,
      },
      skills: mobileRepairProfile.skillScores,
      risk: {
        automationRisk: 32,
        safeSkills: mobileRepairProfile.safeSkills,
        atRiskSkills: mobileRepairProfile.atRiskSkills,
      },
      opportunities: topOpportunities,
    });
  }, [setUserData]);

  useEffect(() => {
    setCurrentContext(getAssistantContext(activeTab, isPolicymaker));
  }, [activeTab, isPolicymaker, setCurrentContext]);

  useEffect(() => {
    if (!isGuidedMode) return;
    if (announcedStepRef.current === currentStep) return;
    announcedStepRef.current = currentStep;

    const guidanceByStep: Record<number, string> = {
      1: 'You have strong technical skills. Want to explore opportunities next?',
      2: 'Your risk is moderate. Let us see better roles and improve resilience.',
      3: 'You have strong matches. Want help choosing the best opportunity?',
      4: 'Here is what you should do next. I can help prioritize your first action.',
    };

    addMessage({
      role: 'assistant',
      content: guidanceByStep[currentStep],
      insight: 'Guided step suggestion',
      actions: ['View Jobs', 'Improve Skills'],
    });
  }, [isGuidedMode, currentStep, addMessage]);

  const moveToGuidedStep = (step: 1 | 2 | 3 | 4) => {
    goToStep(step);
    if (step === 1) navigateTo('profile');
    if (step === 2) navigateTo('future');
    if (step === 3) navigateTo('jobs');
    if (step === 4) navigateTo('profile');
  };

  const handleGuidedNext = () => {
    if (currentStep === 1) {
      moveToGuidedStep(2);
      return;
    }
    if (currentStep === 2) {
      moveToGuidedStep(3);
      return;
    }
    if (currentStep === 3) {
      moveToGuidedStep(4);
      return;
    }
    nextStep();
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-secondary/20 selection:text-secondary font-sans">
      {showHeader && <Header />}
      <GuidedModeBanner onNext={handleGuidedNext} />
      
      <main className={showHeader ? "pt-4" : ""}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (isPolicymaker ? 'poly' : 'ind')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Special onboarding flow helper */}
      {!onboardingComplete && (activeTab === 'intake' || activeTab === 'manual-input') && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[60] w-full max-w-xs px-4">
          <button 
            onClick={handleStartApp}
            className="w-full bg-primary text-white py-4 rounded-2xl text-[12px] font-black tracking-widest uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            Complete Assessment
          </button>
        </div>
      )}

      {/* Mode Toggle for demo */}
      {onboardingComplete && (
        <div className="fixed top-20 right-4 md:right-8 z-[60]">
          <button 
            onClick={toggleMode}
            className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-black tracking-widest uppercase shadow-lg hover:bg-white hover:border-secondary transition-all group"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] group-hover:text-secondary">swap_horiz</span>
              {isPolicymaker ? 'Individual Mode' : 'Policymaker Mode'}
            </span>
          </button>
        </div>
      )}

      {showNav && (
        <div className="md:max-w-3xl md:mx-auto">
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={(tab) => navigateTo(tab as ScreenId)} 
            isPolicymaker={isPolicymaker}
          />
        </div>
      )}
      <GlobalAIAssistant
        onNavigate={(target) => {
          const routeMap: Record<AssistantContextKey, ScreenId> = {
            profile: 'profile',
            jobs: 'jobs',
            skills: 'skills',
            future: 'future',
            policy: 'policy',
            general: 'profile',
          };
          navigateTo(routeMap[target]);
        }}
      />
    </div>
  );
}
