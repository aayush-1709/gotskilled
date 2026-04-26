import { motion } from 'motion/react';

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col min-h-screen pt-24 md:pt-32 px-6 pb-24 md:pb-32 max-w-7xl mx-auto items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center md:text-left space-y-8"
        >
          <div className="inline-block px-6 py-2 bg-secondary/10 text-secondary rounded-2xl font-black text-[14px] tracking-[0.2em] mb-4 uppercase">
            Future-Proof Your Potential
          </div>
          <h2 className="text-[48px] md:text-[72px] font-black text-primary leading-[1.1] tracking-tighter">
            Map your path <br/> to <span className="text-secondary italic">what's next.</span>
          </h2>
          <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed font-medium max-w-xl">
            Unlock global opportunities by translating your existing skills into the new economy. No resume. No bias. Just the future.
          </p>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-6"
          >
            <button 
              onClick={onStart}
              className="w-full md:w-auto px-12 h-[80px] bg-primary text-white rounded-3xl shadow-2xl flex items-center justify-center gap-6 text-xl font-black tracking-tight hover:bg-secondary transition-all group"
            >
              <span className="material-symbols-outlined text-[36px] group-hover:rotate-12 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              Start Skill Mapping
            </button>
            <p className="mt-6 text-on-surface-variant text-sm font-black uppercase tracking-widest opacity-60">
              AI-Powered Match Engine • 100% Free
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative hidden md:block"
        >
          <div className="absolute inset-0 bg-secondary/20 blur-[120px] rounded-full -z-10"></div>
          <div className="rounded-[60px] overflow-hidden shadow-2xl border-8 border-white ring-1 ring-slate-100 h-[600px] relative group">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBwDOJBzESGHiS8Ew3-9G5brf0YTHx6icro6RXvC5TSXVtty4SWQnZEEsxwzLc_HSRWOHkUR-WS4VZg4HY5_GYGcwLmRHlj6BWGcS6Kn4G1Y8jjNHQo9A65shJNVCqcNz9BQ5OTblahUE8G4mkux5QWGSWJCBJgmQb4qNlFIKl86PCmk8UqUdHCm6hL4K18shcGUQipUmA044y9LXddLQfndrhZZeegqzuf94dtYSi5OYViize1PDuwrbTmca3GrTHpUUbjOdwmU0" 
              alt="Skills network"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20 text-white">
               <p className="text-[12px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Live Insight</p>
               <p className="text-2xl font-bold leading-tight">642 new "Solar Operative" roles just mapped in your corridor.</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-16 md:mt-24 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-3xl">language</span>
            </div>
            <div>
              <p className="font-black text-primary text-lg leading-none mb-1">Language</p>
              <p className="text-sm font-medium text-slate-400">Current: English</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-slate-50 text-slate-900 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-slate-100">
            Change
          </button>
        </div>

        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center text-slate-400 shadow-sm">
              <span className="material-symbols-outlined text-3xl">network_check</span>
            </div>
            <div>
              <p className="font-black text-primary text-lg leading-none mb-1">Bandwidth</p>
              <p className="text-sm font-medium text-slate-400">Optimized for reliability</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input className="sr-only peer" type="checkbox" defaultChecked />
            <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-secondary"></div>
          </label>
        </div>
      </div>

      <footer className="mt-20 md:mt-32 text-center opacity-30 pb-12">
        <p className="text-[12px] tracking-[0.4em] font-black text-primary uppercase">
          Built for Global Equity • Powered by GotSkilled AI • 2026
        </p>
      </footer>
    </div>
  );
}
