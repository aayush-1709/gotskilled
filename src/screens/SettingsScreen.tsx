import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { User, Bell, Lock, Database, HelpCircle, ChevronRight, LogOut } from 'lucide-react';

export function SettingsScreen({ onLogout }: { onLogout?: () => void }) {
  const sections = [
    {
      title: 'System Preferences',
      items: [
        { label: 'Regional Focus', val: 'SE Asia corridor', icon: Database },
        { label: 'Notification Settings', val: 'Critical Only', icon: Bell },
        { label: 'Security & Auth', val: 'Biometric + AI Key', icon: Lock },
      ]
    },
    {
      title: 'Profile & Account',
      items: [
        { label: 'Identity Verification', val: 'Oracle Verified', icon: User },
        { label: 'Help & Support', val: '', icon: HelpCircle },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pt-20 px-6 pb-24 max-w-3xl mx-auto space-y-8">
      <section>
        <h2 className="text-3xl font-black text-primary">System Settings</h2>
        <p className="text-on-surface-variant font-bold text-sm">Configure your global identity and analysis filters.</p>
      </section>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-[12px] font-black tracking-[0.2em] text-slate-400 uppercase px-2">{section.title}</h3>
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              {section.items.map((item, i) => (
                <button 
                  key={item.label}
                  className={cn(
                    "w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group",
                    i !== section.items.length - 1 && "border-b border-slate-100"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:text-secondary group-hover:bg-secondary/5 transition-all">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">{item.label}</p>
                      {item.val && <p className="text-[11px] text-slate-400 font-medium">{item.val}</p>}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-5 bg-red-50 text-red-600 rounded-3xl font-bold border border-red-100 hover:bg-red-100 transition-all active:scale-95 translate-y-0 hover:-translate-y-1 shadow-sm hover:shadow-md"
        >
          <LogOut className="w-5 h-5" />
          Log Out of Network
        </motion.button>
      </div>

      <footer className="pt-8 text-center opacity-30">
        <p className="text-[10px] font-black tracking-widest uppercase">System Version: Oracle 4.2.1-stable</p>
      </footer>
    </div>
  );
}
