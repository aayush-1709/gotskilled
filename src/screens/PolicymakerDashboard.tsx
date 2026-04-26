import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
// We use Material Symbols for the specialized icons

export function PolicymakerDashboard() {
  return (
    <div className="flex flex-col min-h-screen pt-20 px-4 pb-32 max-w-7xl mx-auto space-y-12">
      {/* Header & Mode Segment */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-[40px] font-black text-primary leading-none">Regional Insights</h2>
          <p className="text-on-surface-variant font-bold text-lg tracking-tight">Southeast Asia Economic Corridor • 2026 Analysis</p>
          <div className="flex items-center gap-4 pt-2">
            <span className="text-[11px] font-black text-secondary tracking-widest uppercase bg-secondary/5 px-3 py-1 rounded-full border border-secondary/10">Trust Score: 98%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validated by AI Oracle</span>
          </div>
        </div>
        
        <div className="w-full lg:w-auto bg-slate-50 p-2 rounded-2xl flex items-center shadow-inner border border-slate-100 h-16">
          <button className="flex-1 lg:px-8 py-3 text-[12px] font-black tracking-[0.2em] uppercase text-slate-400 rounded-xl transition-all hover:text-slate-600">
            Individual
          </button>
          <button className="flex-1 lg:px-8 py-3 text-[12px] font-black tracking-[0.2em] uppercase bg-secondary text-white shadow-xl rounded-xl ring-4 ring-white">
            Policymaker
          </button>
        </div>
      </section>

      {/* Primary Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'TOP GROWING SKILLS', val: '+14.2%', sub: ['GenAI', 'Prompt Eng'], color: 'secondary' },
          { label: 'RISK EXPOSURE', val: 'Low-Mid', sub: ['Retail', 'Entry'], color: 'error' },
          { label: 'LABOR MOBILITY', val: '68%', sub: ['Active Passport'], color: 'secondary' },
          { label: 'AI ADOPTION', val: 'High', sub: ['SME Sector'], color: 'secondary' }
        ].map(stat => (
          <div key={stat.label} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4 hover:shadow-lg transition-all group">
            <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">{stat.label}</span>
            <span className={cn("text-[40px] font-black leading-none group-hover:scale-110 transition-transform origin-left", stat.color === 'secondary' ? "text-secondary" : "text-error")}>
              {stat.val}
            </span>
            <div className="flex flex-wrap gap-2">
              {stat.sub.map(s => (
                <span key={s} className={cn(
                  "text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider",
                  stat.color === 'secondary' ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"
                )}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Main Analysis Area: Map & Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-black">Skill Exposure Map</h3>
            <span className="material-symbols-outlined text-slate-300 text-3xl">info</span>
          </div>
          <div className="relative bg-white p-10 rounded-[48px] border border-slate-200 overflow-hidden shadow-xl h-[500px] flex items-center justify-center ring-8 ring-slate-50">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #4b41e1 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="relative w-full h-full">
              {/* Dynamic Bubbles for Desktop */}
              <motion.div 
                 animate={{ y: [-10, 10, -10], scale: [1, 1.02, 1] }}
                 transition={{ duration: 7, repeat: Infinity }}
                 className="absolute top-1/4 left-1/6 w-48 h-48 bg-secondary/10 border-4 border-secondary/20 rounded-full flex flex-col items-center justify-center backdrop-blur-md shadow-2xl p-6"
              >
                <div className="w-12 h-12 bg-secondary/20 rounded-full mb-3 flex items-center justify-center">
                   <span className="material-symbols-outlined text-secondary">palette</span>
                </div>
                <span className="text-[12px] font-black text-secondary text-center leading-tight uppercase tracking-widest">Creative Tech</span>
              </motion.div>
              
              <motion.div 
                 animate={{ y: [10, -10, 10], scale: [1, 0.98, 1] }}
                 transition={{ duration: 8, repeat: Infinity }}
                 className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-error/5 border-4 border-error/10 rounded-full flex flex-col items-center justify-center backdrop-blur-md shadow-2xl p-8"
              >
                <div className="w-14 h-14 bg-error/10 rounded-full mb-4 flex items-center justify-center">
                   <span className="material-symbols-outlined text-error">assignment</span>
                </div>
                <span className="text-[12px] font-black text-error text-center leading-tight uppercase tracking-widest">Admin Services</span>
              </motion.div>
              
              <motion.div 
                 animate={{ x: [-10, 10, -10] }}
                 transition={{ duration: 9, repeat: Infinity }}
                 className="absolute top-10 right-1/4 w-32 h-32 bg-violet-100/50 border-4 border-violet-500/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl"
              >
                <span className="text-[11px] font-black text-violet-700 text-center px-4 leading-tight uppercase tracking-wider">AI Ethics</span>
              </motion.div>
            </div>

            <div className="absolute bottom-10 right-10 bg-white/90 backdrop-blur-xl p-6 rounded-[32px] text-[11px] font-black border border-white shadow-2xl space-y-4">
              <div className="flex items-center gap-3 uppercase tracking-[0.2em]">
                <span className="w-4 h-4 rounded-full bg-error ring-4 ring-error/20"></span> High Risk
              </div>
              <div className="flex items-center gap-3 uppercase tracking-[0.2em]">
                <span className="w-4 h-4 rounded-full bg-secondary ring-4 ring-secondary/20"></span> Opportunity
              </div>
            </div>
          </div>
        </section>

        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-8">
           <section className="space-y-6">
            <h3 className="text-2xl font-black px-4">Employment Projections</h3>
            <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-10 flex-1 flex flex-col">
              <div className="flex-1 relative min-h-[240px]">
                <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="trendGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#4b41e1', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#9863ff', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.5 }}
                    d="M0 130 Q 50 120, 100 80 T 200 60 T 300 40 T 400 20" 
                    fill="none" 
                    stroke="url(#trendGradient)" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                  />
                  {[0, 100, 200, 300, 400].map((x, i) => {
                    const ys = [130, 80, 60, 40, 20];
                    return (
                      <circle key={i} cx={x} cy={ys[i]} fill="white" stroke={i > 2 ? '#9863ff' : '#4b41e1'} strokeWidth="4" r="6" />
                    );
                  })}
                  <path d="M200 60 L 400 100" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="8 6" />
                </svg>
              </div>
              <div className="flex justify-between px-2 text-[11px] text-slate-400 font-black tracking-[0.3em] uppercase">
                <span>2022</span>
                <span>2024</span>
                <span>2026 (TARGET)</span>
              </div>
            </div>
          </section>

          <div className="p-8 bg-violet-600 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 flex items-start gap-6">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Policy Recommendation</p>
                <p className="text-xl leading-relaxed font-bold">
                  Accelerate vocational training in <span className="text-secondary-fixed underline decoration-2">Creative Tech</span> to mitigate 12% risk in Administrative roles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Actions Component */}
      <section className="space-y-8">
        <h3 className="text-2xl font-black px-4">Regional Priority Sectors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
          {[
            { name: 'Agri-Tech Robotics', type: 'High Priority', val: 75, color: 'emerald', icon: 'agriculture', desc: 'Automating paddy cultivation in Central Plains.' },
            { name: 'Health Data Science', type: 'Critical Gap', val: 40, color: 'violet', icon: 'medical_services', desc: 'Unified patient records for border clinics.' },
            { name: 'Solar Grid Ops', type: 'Emerging', val: 62, color: 'sky', icon: 'bolt', desc: 'Decentralized energy management systems.' }
          ].map(focus => (
            <div key={focus.name} className="flex flex-col gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-secondary/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[32px]">{focus.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xl">{focus.name}</h4>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.1em]",
                    focus.color === 'emerald' ? "text-emerald-500" : focus.color === 'violet' ? "text-violet-500" : "text-sky-500"
                  )}>{focus.type}</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{focus.desc}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-black uppercase">
                   <span className="opacity-40">Talent Readiness</span>
                   <span className="text-primary">{focus.val}%</span>
                </div>
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${focus.val}%` }}
                    transition={{ duration: 1.5, delay: 0.1 }}
                    className={cn(
                      "h-full rounded-full shadow-sm",
                      focus.color === 'emerald' ? "bg-emerald-500" : focus.color === 'violet' ? "bg-violet-500" : "bg-sky-500"
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAB */}
      <button className="fixed bottom-24 right-8 lg:right-16 bg-primary text-white w-20 h-20 rounded-[28px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 ring-8 ring-white/50 group">
        <span className="material-symbols-outlined text-[36px] font-bold group-hover:rotate-90 transition-transform duration-300">add</span>
      </button>
    </div>
  );
}
