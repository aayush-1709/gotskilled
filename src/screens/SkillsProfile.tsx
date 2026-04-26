import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { buildJobsForProfile, mobileRepairProfile } from '@/src/data/careerData';

export function SkillsProfile() {
  const skillClusters = mobileRepairProfile.skillClusters.map((item, index) => ({
    ...item,
    sub: index === 0 ? 'Hands-on diagnostics and component accuracy' : index === 1 ? 'Recovery and software-level troubleshooting' : index === 2 ? 'Service communication and trust building' : 'Repair business process management',
    status: item.confidence >= 85 ? 'CORE' : 'ADJACENT',
  }));
  const jobs = buildJobsForProfile(mobileRepairProfile).slice(0, 2).map((job, index) => ({
    title: job.title,
    details: `${job.location} • ${job.income}`,
    dark: index === 0,
  }));

  return (
    <div className="flex flex-col min-h-screen pt-20 px-4 pb-24 max-w-7xl mx-auto space-y-8">
      <section className="md:text-center lg:text-left">
        <h1 className="text-[40px] md:text-[56px] font-bold text-primary leading-tight">Skills Profile</h1>
        <p className="text-body-md md:text-body-lg text-on-surface-variant max-w-2xl md:mx-auto lg:mx-0">
          {mobileRepairProfile.name}'s profile validated through repair history, task complexity, and outcome consistency.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: AI Insight */}
        <div className="lg:col-span-5 space-y-8">
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-[-20px] right-[-20px] p-4 opacity-5">
              <span className="material-symbols-outlined text-[140px]">psychology</span>
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <h3 className="font-bold text-xl">AI Explanation</h3>
              </div>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Our AI cross-referenced repair outcomes with <span className="font-bold text-secondary">Global Talent Benchmarks</span>. Consistent fault isolation and customer retention emerged as top differentiators.
              </p>
              <div className="bg-surface-container-low rounded-2xl p-6 border-l-8 border-secondary">
                <p className="text-[16px] font-medium text-on-surface italic leading-relaxed">"The mapping reveals strong board-level troubleshooting under time pressure and high reliability in service completion."</p>
              </div>
            </div>
          </motion.section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold px-1">Top Matching Roles</h2>
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <motion.div 
                  key={job.title}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center justify-between p-6 rounded-3xl cursor-pointer transition-all hover:shadow-lg hover:border-secondary/20 border border-transparent",
                    job.dark ? "bg-primary-container text-white" : "bg-white border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      job.dark ? "bg-white/10" : "bg-slate-100 text-slate-400"
                    )}>
                      <span className="material-symbols-outlined text-[28px]">work_outline</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{job.title}</p>
                      <p className={cn("text-sm", job.dark ? "text-on-primary-container" : "text-on-surface-variant")}>{job.details}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined opacity-30">chevron_right</span>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Skill Clusters */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-end pb-2">
            <h2 className="text-2xl font-bold">Skill Clusters</h2>
            <button className="text-secondary text-[12px] font-bold tracking-widest uppercase hover:underline">VIEW ALL CLUSTERS</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {skillClusters.map((skill, i) => (
              <motion.div 
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 hover:border-secondary/20 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xl leading-tight group-hover:text-secondary transition-colors">{skill.name}</h4>
                    <p className="text-sm text-on-surface-variant font-medium mt-1">{skill.sub}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black px-3 py-1.5 rounded-lg tracking-widest border",
                    skill.status === 'CORE' ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-slate-50 text-slate-400 border-slate-100"
                  )}>{skill.status}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[12px] font-black uppercase tracking-widest">
                    <span className="text-on-surface opacity-60">Confidence Level</span>
                    <span className="text-secondary">{skill.confidence}%</span>
                  </div>
                  <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.confidence}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className="h-full bg-ai-gradient rounded-full shadow-sm"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {skill.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-slate-50 text-[13px] rounded-2xl text-on-surface-variant font-bold border border-slate-100 hover:bg-white hover:border-secondary/20 transition-all cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
