import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { mobileRepairProfile } from '@/src/data/careerData';
import { useGuidedFlow } from '@/src/context/GuidedFlowContext';

export function FutureReadiness() {
  const [year, setYear] = useState(2027);
  const risk = 32;
  const { isGuidedMode, currentStep } = useGuidedFlow();
  const riskSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isGuidedMode || currentStep !== 2 || !riskSectionRef.current) return;
    riskSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [isGuidedMode, currentStep]);

  return (
    <div className="flex flex-col min-h-screen pt-20 px-4 pb-24 max-w-7xl mx-auto space-y-12">
      <section className="flex flex-col items-center justify-center text-center py-12 px-6">
        <h2 className="text-[32px] md:text-[48px] font-black text-primary mb-2">Future Readiness</h2>
        <p className="text-on-surface-variant font-medium text-lg max-w-xl mx-auto">Evaluating your competitive edge in the age of global automation.</p>
      </section>

      <div
        ref={riskSectionRef}
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:items-start rounded-[44px] transition-all',
          isGuidedMode && currentStep === 2 ? 'ring-4 ring-secondary/30 shadow-[0_0_0_10px_rgba(75,65,225,0.08)]' : '',
        )}
      >
        {/* Risk Assessment Circle */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-10 bg-white rounded-[40px] shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold mb-10">Risk Exposure</h3>
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle 
                className="text-slate-50" 
                cx="50" cy="50" r="44" 
                fill="transparent" 
                stroke="currentColor" 
                strokeWidth="10" 
              />
              <motion.circle
                initial={{ strokeDashoffset: 276 }}
                animate={{ strokeDashoffset: 276 - (276 * (risk / 100)) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-secondary ai-glow" 
                cx="50" cy="50" r="44" 
                fill="transparent" 
                stroke="currentColor" 
                strokeWidth="10" 
                strokeDasharray="276" 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[64px] font-black text-primary leading-none tracking-tighter">{risk}%</span>
              <span className="text-[12px] font-black tracking-[0.3em] text-secondary uppercase mt-2">Low Risk</span>
            </div>
          </div>
          
          <p className="mt-12 px-4 text-on-surface-variant text-center font-bold text-sm leading-relaxed">
            {mobileRepairProfile.name}'s skillset is <span className="text-emerald-600">68% future-proof</span> against AI automation models through 2030.
          </p>
        </div>

        {/* Mid Column: Insights & Skills */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <motion.section 
            className="bg-primary-container p-8 rounded-[40px] text-white border-2 border-white/5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                <h3 className="font-bold text-[14px] tracking-[0.2em] uppercase opacity-80">AI Impact Analysis</h3>
              </div>
              <p className="text-[20px] md:text-[24px] text-slate-100 leading-relaxed font-medium">
                In <span className="font-black text-white underline decoration-secondary decoration-4 underline-offset-4">Mobile Device Repair</span>, automation speeds up diagnostics, but board-level judgment and physical repair precision remain human-critical in high-variance faults.
              </p>
            </div>
          </motion.section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 space-y-6">
              <div className="flex items-center gap-3 text-emerald-700">
                <span className="material-symbols-outlined text-xl font-bold">verified_user</span>
                <span className="text-[12px] font-black tracking-widest uppercase">Augmentation Alpha</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mobileRepairProfile.safeSkills.slice(0, 3).map(s => (
                  <span key={s} className="px-4 py-2 bg-white text-[12px] font-black rounded-xl border border-emerald-100 text-emerald-800 uppercase tracking-tighter">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 space-y-6">
              <div className="flex items-center gap-3 text-red-600">
                <span className="material-symbols-outlined text-xl font-bold">warning</span>
                <span className="text-[12px] font-black tracking-widest uppercase">Automation Beta</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mobileRepairProfile.atRiskSkills.map(s => (
                  <span key={s} className="px-4 py-2 bg-white text-[12px] font-black rounded-xl border border-red-100 text-red-800 uppercase tracking-tighter">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-surface-container p-8 rounded-[40px] space-y-8 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-2xl">Evolution Timeline</h3>
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
               <span className="text-secondary font-black text-lg tracking-tighter">{year} Projection</span>
            </div>
          </div>
          <div className="relative py-4">
            <input 
              type="range" 
              min="2024" 
              max="2035" 
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full h-4 bg-white rounded-full appearance-none cursor-pointer accent-secondary border-2 border-slate-200"
            />
            <div className="flex justify-between text-[11px] font-black tracking-[0.2em] text-slate-400 mt-6 px-1">
              <span>PRESENT</span>
              <span>2028</span>
              <span>2032</span>
              <span>SINGULARITY+</span>
            </div>
          </div>
          <div className="p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-sm ring-1 ring-slate-100">
            <p className="text-[16px] text-on-surface-variant leading-relaxed font-bold">
              By <span className="font-black text-primary">{year}</span>, your role will require 90% orchestration and 10% execution. Immediate pivot: <span className="text-secondary">Agentic System Governance</span>.
            </p>
          </div>
        </section>

        <section className="bg-secondary-container p-8 rounded-[40px] text-white space-y-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-[12px] font-black tracking-[0.3em] uppercase">High-Value Upskilling Targets</span>
          </div>
          <div className="space-y-8">
            {[
               { name: 'Advanced Micro-Soldering', val: 72, desc: 'Board-level repair capability for premium devices' },
               { name: 'OEM Diagnostic Tooling', val: 54, desc: 'Vendor-grade troubleshooting workflows' },
               { name: 'Service Center Process Digitization', val: 43, desc: 'Digital intake, CRM, and repair tracking' }
            ].map(skill => (
              <div key={skill.name} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-lg font-bold truncate">{skill.name}</p>
                    <p className="text-[11px] text-white/50 font-black uppercase tracking-wider">{skill.desc}</p>
                  </div>
                  <span className="text-xl font-black">{skill.val}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.val}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
