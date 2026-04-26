import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { buildJobsForProfile, mobileRepairProfile } from '@/src/data/careerData';
import { useGuidedFlow } from '@/src/context/GuidedFlowContext';
import { useEffect, useRef } from 'react';

export function JobMatches() {
  const { isGuidedMode, currentStep } = useGuidedFlow();
  const topMatchesRef = useRef<HTMLDivElement | null>(null);
  const jobs = buildJobsForProfile(mobileRepairProfile);
  const mobileRepairDemand = jobs.filter((job) => job.requiresMobileRepairWorker).length;
  const avgMatch = Math.round(jobs.reduce((total, job) => total + job.match, 0) / jobs.length);

  const toFeasibility = (match: number) => {
    if (match >= 80) return 'High';
    if (match >= 70) return 'Medium';
    return 'Low';
  };

  useEffect(() => {
    if (!isGuidedMode || currentStep !== 3 || !topMatchesRef.current) return;
    topMatchesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [isGuidedMode, currentStep]);

  return (
    <div className="flex flex-col min-h-screen pt-20 px-4 pb-24 max-w-7xl mx-auto space-y-8">
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl bg-gradient-to-br from-secondary-container/10 to-violet-100 border border-secondary-container/20 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            <span className="text-[11px] font-black text-secondary uppercase tracking-[0.2em]">AI Recommendation</span>
          </div>
          <h3 className="text-3xl font-bold text-primary mb-1">{jobs.length} Matches Found</h3>
          <p className="text-[16px] text-on-surface-variant font-medium">
            Profile match built for {mobileRepairProfile.name} ({mobileRepairProfile.currentRole}). {mobileRepairDemand} roles directly require mobile repair experience.
          </p>
        </div>
        <div className="bg-white/70 px-6 py-4 rounded-2xl border border-white text-primary">
          <p className="text-[11px] uppercase tracking-[0.2em] font-black opacity-60">Average Match</p>
          <p className="text-3xl font-black">{avgMatch}%</p>
        </div>
      </motion.section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold">Discover Jobs</h2>
          <p className="text-secondary text-sm font-bold">Upskilling suggestion appears below 70% match.</p>
        </div>
        
        <div className="flex overflow-x-auto lg:overflow-visible gap-4 pb-2 no-scrollbar">
          {[
            { label: 'Mobile Repair Required (10)', icon: 'build', active: true },
            { label: 'Adj. Technical Roles (30)', icon: 'memory', active: false },
            { label: 'Upskilling Path Enabled', icon: 'school', active: false },
          ].map((filter) => (
            <button 
              key={filter.label}
              className={cn(
                "flex-shrink-0 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm border-2 transition-all hover:border-secondary/30",
                filter.active 
                  ? "bg-secondary text-white border-transparent shadow-md" 
                  : "bg-white border-slate-100 text-on-surface font-black text-sm uppercase tracking-wider"
              )}
            >
              <span className="material-symbols-outlined text-[20px]">{filter.icon}</span>
                <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div
        ref={topMatchesRef}
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 rounded-[36px] transition-all',
          isGuidedMode && currentStep === 3 ? 'ring-4 ring-secondary/30 shadow-[0_0_0_10px_rgba(75,65,225,0.08)]' : '',
        )}
      >
        {jobs.map((job, i) => (
          <motion.article 
            key={job.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-violet-50 to-transparent -mr-16 -mt-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-[0.1em]",
                    toFeasibility(job.match) === 'High' ? 'bg-green-100 text-green-700' :
                    toFeasibility(job.match) === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  )}>
                    {toFeasibility(job.match)} Feasibility
                  </span>
                  <h3 className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors">{job.title}</h3>
                  <p className="text-sm text-on-surface-variant font-bold">{job.company} • {job.location}</p>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-50 flex items-center justify-center relative shadow-inner">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        className={cn(job.match < 70 ? 'text-red-400' : 'text-secondary')}
                        cx="32" cy="32" r="28" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="5" 
                        strokeDasharray="176" 
                        strokeDashoffset={176 - (176 * (job.match/100))}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className={cn('text-sm font-black', job.match < 70 ? 'text-red-500' : 'text-secondary')}>{job.match}%</span>
                  </div>
                  <span className="text-[10px] font-black text-on-surface-variant mt-2 tracking-[0.2em] uppercase">Match</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-public-sans">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Expected Income</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-primary">{job.income}</span>
                    <span className="text-[11px] text-on-surface-variant font-bold opacity-60">/yr</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Growth Trend</p>
                  <div className={cn(
                    "flex items-center gap-1 font-black",
                    job.growth.startsWith('+') ? "text-green-600" : "text-red-500"
                  )}>
                    <span className="material-symbols-outlined text-xl">{job.growth.startsWith('+') ? 'trending_up' : 'trending_down'}</span>
                    <span className="text-2xl">{job.growth}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-violet-50/50 text-secondary border border-secondary/10 rounded-2xl text-[12px] font-bold hover:bg-white hover:border-secondary transition-all">
                    {tag}
                  </span>
                ))}
                {job.requiresMobileRepairWorker && (
                  <span className="px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-2xl text-[12px] font-bold">
                    Mobile Repair Background Required
                  </span>
                )}
              </div>
            </div>

            <button 
              className={cn(
                "w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] mt-8",
                job.match >= 80 ? 'bg-secondary text-white shadow-xl shadow-secondary/20 hover:bg-secondary/90' :
                job.match >= 70 ? 'border-2 border-secondary text-secondary shadow-none bg-transparent hover:bg-secondary/5' :
                'bg-surface-container-highest text-on-surface-variant shadow-none border border-slate-200'
              )}
            >
              {job.match >= 80 ? 'Apply Now' : job.match >= 70 ? 'Apply with Coaching' : 'Upskilling Recommended'}
            </button>
            {job.match < 70 && (
              <button className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest mt-3 border-2 border-secondary text-secondary hover:bg-secondary/5 transition-all">
                Start Upskilling Plan
              </button>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  );
}
