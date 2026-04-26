import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface HeaderProps {
  userPhoto?: string;
}

export function Header({ userPhoto }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full bg-slate-50/90 backdrop-blur-md border-b border-slate-200 shadow-sm z-50">
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-slate-200">
            {userPhoto ? (
              <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD193PuGZwOm9SckfPor9Pi-F1LsbH2YW5LYZIEXMxNeKfUuBWvqReaxKBz0xBEbb9LYpDPuON4Q37IVI8e49S3k_554QT-a-r1m2cz-SW9CvjvCq0iJFbIEO7D7gmYdSv-7vXSAzkbTB4GWIP6Bv0RmlFBUgPHz_qfZljpWK-vR2rTF5lRB1zd-o9XVkgQ2LCI_X-JqhjFWi6NhXRW9zfJwxuY0Nlm-_r3zj2aBxMHMMhvn-v91W1whgxTxU0ZslfC55cNVPySEgM"
                alt="User profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter">GotSkilled AI</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 duration-150">
          <span className="material-symbols-outlined text-slate-900">tune</span>
        </button>
      </div>
    </header>
  );
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPolicymaker?: boolean;
}

export function BottomNav({ activeTab, onTabChange, isPolicymaker }: BottomNavProps) {
  const tabs = isPolicymaker ? [
    { id: 'home', label: 'Home', icon: 'dashboard' },
    { id: 'coach', label: 'AI Coach', icon: 'psychology' },
    { id: 'map', label: 'Global Map', icon: 'public' },
    { id: 'policy', label: 'Policy', icon: 'description' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ] : [
    { id: 'profile', label: 'Profile', icon: 'badge' },
    { id: 'coach', label: 'AI Coach', icon: 'psychology' },
    { id: 'skills', label: 'Skills', icon: 'military_tech' },
    { id: 'jobs', label: 'Jobs', icon: 'work_outline' },
    { id: 'future', label: 'Future', icon: 'timeline' },
  ];

  return (
    <nav className="fixed bottom-0 md:bottom-8 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-auto md:min-w-[500px] bg-white/95 md:bg-white/80 backdrop-blur-lg border-t md:border border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:shadow-2xl h-20 md:h-18 flex justify-around md:gap-4 items-center px-4 md:px-8 pb-safe md:pb-0 z-50 rounded-t-2xl md:rounded-[28px]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex flex-col items-center justify-center px-3 py-1 transition-all active:scale-90",
              isActive ? "text-secondary font-bold" : "text-slate-500 font-medium"
            )}
          >
            <span className="material-symbols-outlined mb-1 text-[24px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {tab.icon}
            </span>
            <span className="text-[11px] whitespace-nowrap">{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="nav-glow"
                className="absolute inset-0 bg-secondary/5 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
