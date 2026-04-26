import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { FileText, Shield, Globe, Users, ArrowRight } from 'lucide-react';

export function PolicyScreen() {
  const policies = [
    {
      title: 'Global Skills Passport',
      status: 'In Review',
      impact: 'High',
      desc: 'Standardizing skill certifications across the SE Asia corridor to allow frictionless labor movement.',
      tags: ['Labor Mobility', 'Skill Standards']
    },
    {
      title: 'AI Augmentation Subsidy',
      status: 'Active',
      impact: 'Medium',
      desc: 'Funding for small businesses to integrate AI task-assistants for manual data processing.',
      tags: ['SME Support', 'Automation']
    },
    {
      title: 'Privacy Shield v4',
      status: 'Draft',
      impact: 'Critical',
      desc: 'New data sovereignty rules for behavioral skill mapping profiles.',
      tags: ['Data Ethics', 'Privacy']
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pt-20 px-6 pb-24 max-w-7xl mx-auto space-y-8">
      <section>
        <h2 className="text-3xl font-black text-primary">Policy Frameworks</h2>
        <p className="text-on-surface-variant font-bold text-sm">Draft, review, and deploy regional economic initiatives.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy, i) => (
          <motion.div
            key={policy.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  policy.status === 'Active' ? "bg-emerald-50 text-emerald-600" : 
                  policy.status === 'In Review' ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"
                )}>
                  {policy.status}
                </span>
                <span className="text-[10px] font-black text-secondary tracking-widest uppercase">Impact: {policy.impact}</span>
              </div>
              <h3 className="text-xl font-bold">{policy.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{policy.desc}</p>
              <div className="flex flex-wrap gap-2">
                {policy.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold transition-colors">
              View Briefing <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}

        <button className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-secondary hover:border-secondary/30 transition-all hover:bg-secondary/5">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <span className="font-bold text-sm uppercase tracking-widest">New Policy Draft</span>
        </button>
      </div>
    </div>
  );
}
