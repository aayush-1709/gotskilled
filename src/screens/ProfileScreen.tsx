import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { buildJobsForProfile, mobileRepairProfile } from '@/src/data/careerData';
import { useGuidedFlow } from '@/src/context/GuidedFlowContext';

type ProfileScreenProps = {
  onEditProfile: () => void;
};

export function ProfileScreen({ onEditProfile }: ProfileScreenProps) {
  const [shareMessage, setShareMessage] = useState('');
  const manualInput = localStorage.getItem('gotskilled.manualInput') ?? '';
  const voiceTranscript = localStorage.getItem('gotskilled.voiceTranscript') ?? '';
  const narrative = (manualInput.trim() || voiceTranscript.trim()).trim();
  const { isGuidedMode, currentStep } = useGuidedFlow();
  const skillsSectionRef = useRef<HTMLElement | null>(null);
  const actionsSectionRef = useRef<HTMLElement | null>(null);

  const opportunities = useMemo(
    () =>
      buildJobsForProfile(mobileRepairProfile)
        .sort((a, b) => b.match - a.match)
        .slice(0, 5)
        .map((item) => ({
          role: item.title,
          income: item.income,
          growth: item.growth,
          match: item.match,
          feasibility: Math.max(55, Math.min(96, item.match - (item.requiresMobileRepairWorker ? 2 : 6))),
        })),
    [],
  );

  const tasks = useMemo(() => {
    if (!narrative) return mobileRepairProfile.taskSummary;
    return narrative
      .split(/[.!?]/)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 5);
  }, [narrative]);

  const educationLevel = narrative
    ? narrative.match(/bachelor|master|diploma|phd|graduate|college|school/i)
      ? 'Detected from input narrative'
      : mobileRepairProfile.educationLevel
    : mobileRepairProfile.educationLevel;

  const profileCompletion = useMemo(() => {
    let points = 55;
    if (manualInput.trim()) points += 20;
    if (voiceTranscript.trim()) points += 15;
    if (tasks[0] && !tasks[0].startsWith('No detailed')) points += 10;
    return Math.min(points, 100);
  }, [manualInput, voiceTranscript, tasks]);

  const automationRisk = 32;

  const professionalSummary = useMemo(() => {
    if (!narrative) {
      return mobileRepairProfile.professionalSummary;
    }
    return `Resourceful professional with demonstrated experience in ${tasks[0].toLowerCase()}. Shows strong transferability across coordination, execution, and stakeholder-facing responsibilities with above-average readiness for digitally augmented roles.`;
  }, [narrative, tasks]);

  const handleShare = async () => {
    const shareText = 'Explore my AI-verified skills profile on GotSkilled AI.';
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'GotSkilled AI Profile',
          text: shareText,
          url: window.location.href,
        });
        setShareMessage('Profile shared successfully.');
        return;
      }

      await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      setShareMessage('Share link copied to clipboard.');
    } catch {
      setShareMessage('Share cancelled or unavailable on this device.');
    }
  };

  const handleDownloadResume = () => {
    const resumeMarkup = `
      <html>
        <head><title>GotSkilled AI Resume</title></head>
        <body style="font-family:Arial,sans-serif;max-width:800px;margin:24px auto;padding:16px;color:#0f172a;">
          <h1 style="margin-bottom:4px;">Candidate Profile</h1>
          <p style="margin-top:0;color:#475569;">AI Verified Skills Profile • Completion: ${profileCompletion}%</p>
          <h2>Professional Summary</h2>
          <p>${professionalSummary}</p>
          <h2>Skills Overview</h2>
          <ul>${mobileRepairProfile.skillClusters.map((cluster) => `<li>${cluster.name} (${cluster.confidence}% confidence): ${cluster.tags.join(', ')}</li>`).join('')}</ul>
          <h2>Top Opportunities</h2>
          <ul>${opportunities.slice(0, 3).map((item) => `<li>${item.role} • ${item.income} • Growth ${item.growth} • Match ${item.match}%</li>`).join('')}</ul>
          <h2>AI Notes</h2>
          <p>Automation Risk Score: ${automationRisk}% (low-to-moderate). Strong human judgment and coordination skills improve long-term resilience.</p>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(resumeMarkup);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  useEffect(() => {
    if (!isGuidedMode) return;

    if (currentStep === 1 && skillsSectionRef.current) {
      skillsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (currentStep === 4 && actionsSectionRef.current) {
      actionsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isGuidedMode, currentStep]);

  return (
    <div className="flex flex-col min-h-screen pt-20 px-4 pb-28 max-w-7xl mx-auto space-y-8">
      <section className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary mb-2">Account / Profile</p>
            <h1 className="text-[34px] md:text-[48px] font-black text-primary leading-tight">{mobileRepairProfile.name}</h1>
            <p className="text-on-surface-variant font-medium mt-2">
              {mobileRepairProfile.currentRole} • {mobileRepairProfile.yearsExperience} years experience • {mobileRepairProfile.location}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-[11px] font-black uppercase tracking-[0.15em]">{mobileRepairProfile.identityNote}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[12px] font-black tracking-widest uppercase">
            <span className="text-on-surface-variant">Profile Completion</span>
            <span className="text-secondary">{profileCompletion}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div className="h-full bg-ai-gradient rounded-full" initial={{ width: 0 }} animate={{ width: `${profileCompletion}%` }} transition={{ duration: 0.9 }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={onEditProfile} className="px-5 py-3 rounded-2xl bg-primary text-white text-[12px] font-black uppercase tracking-widest hover:bg-secondary transition-colors">Edit Profile</button>
          <button onClick={handleShare} className="px-5 py-3 rounded-2xl border border-slate-200 text-primary text-[12px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">Share Profile</button>
          <button onClick={handleDownloadResume} className="px-5 py-3 rounded-2xl border border-secondary/30 text-secondary text-[12px] font-black uppercase tracking-widest hover:bg-secondary/5 transition-colors">Download Resume (PDF)</button>
        </div>
        {shareMessage && <p className="text-sm text-on-surface-variant font-medium">{shareMessage}</p>}
      </section>

      <section
        ref={skillsSectionRef}
        className={cn(
          'grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-[36px] transition-all',
          isGuidedMode && currentStep === 1 ? 'ring-4 ring-secondary/30 shadow-[0_0_0_10px_rgba(75,65,225,0.08)]' : '',
        )}
      >
        <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-primary">Skills Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mobileRepairProfile.skillClusters.map((cluster) => (
              <div key={cluster.name} className="rounded-3xl border border-slate-200 p-5 space-y-4">
                <div>
                  <p className="font-bold text-lg text-primary">{cluster.name}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cluster.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-on-surface-variant">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="text-on-surface-variant">Confidence</span>
                    <span className="text-secondary">{cluster.confidence}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: `${cluster.confidence}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-primary mb-3">Related Job Roles</p>
            <div className="flex flex-wrap gap-2">
              {mobileRepairProfile.relatedRoles.map((role) => (
                <span key={role} className="px-4 py-2 rounded-2xl bg-violet-50 border border-violet-100 text-secondary text-sm font-bold">{role}</span>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 bg-primary-container text-white rounded-[32px] p-6 md:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] opacity-80">AI Explanation</p>
          </div>
          <p className="text-[16px] leading-relaxed text-slate-100">
            Skills are derived from your narrative using semantic extraction, role ontology matching, and confidence scoring. The system maps repeated actions, domain terms, and measurable outcomes into portable skill clusters.
          </p>
          <p className="text-[13px] text-slate-300 leading-relaxed">
            Input signals used: manual text, voice transcript, task verbs, and context phrases tied to labor-market taxonomies.
          </p>
        </aside>
      </section>

      <section className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
        <h2 className="text-2xl font-black text-primary">Experience & Input Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.2em] font-black text-on-surface-variant">Education Level</p>
            <p className="font-semibold text-primary">{educationLevel}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.2em] font-black text-on-surface-variant">Work Experience Narrative</p>
            <p className="font-medium text-on-surface-variant">{narrative || mobileRepairProfile.workNarrative}</p>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] font-black text-on-surface-variant mb-2">Tasks You Described</p>
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task} className="text-[15px] text-on-surface-variant font-medium">- {task}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-black text-primary mb-5">AI Risk & Readiness</h2>
          <div className="relative w-44 h-44 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-slate-100" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * (automationRisk / 100))}
                className={cn(automationRisk > 60 ? 'text-red-500' : automationRisk > 35 ? 'text-amber-500' : 'text-emerald-500')}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-black text-primary">{automationRisk}%</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Automation Risk</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-emerald-700 mb-3">Safe Skills</p>
              <div className="flex flex-wrap gap-2">
              {mobileRepairProfile.safeSkills.map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold">{item}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-red-700 mb-3">At-Risk Skills</p>
              <div className="flex flex-wrap gap-2">
                {mobileRepairProfile.atRiskSkills.map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold">{item}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-2">AI Insight</p>
            <p className="text-on-surface-variant font-medium leading-relaxed">
              Risk remains moderate because repetitive reporting and template-heavy tasks are easier to automate. Your readiness stays strong due to human judgment, coordination, and exception handling that AI cannot reliably replace in dynamic environments.
            </p>
          </div>
        </div>
      </section>

      <section
        ref={actionsSectionRef}
        className={cn(
          'bg-white rounded-[32px] border p-6 md:p-8 shadow-sm space-y-6 transition-all',
          isGuidedMode && currentStep === 4 ? 'border-secondary ring-4 ring-secondary/25 shadow-[0_0_0_10px_rgba(75,65,225,0.08)]' : 'border-slate-200',
        )}
      >
        <h2 className="text-2xl font-black text-primary">Opportunity Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {opportunities.map((item) => (
            <article key={item.role} className="rounded-3xl border border-slate-200 p-5 space-y-4 hover:border-secondary/30 transition-colors">
              <div className="flex justify-between items-start gap-3">
                <h3 className="text-lg font-bold text-primary leading-snug">{item.role}</h3>
                <span className="text-[10px] px-2 py-1 rounded-lg bg-secondary/10 text-secondary font-black uppercase tracking-[0.12em]">Top Match</span>
              </div>
              <div className="space-y-2 text-sm font-medium text-on-surface-variant">
                <p>Expected income: <span className="font-bold text-primary">{item.income}</span></p>
                <p>Growth trend: <span className={cn('font-bold', item.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-500')}>{item.growth}</span></p>
                <p>Match score: <span className="font-bold text-secondary">{item.match}%</span></p>
                <p>Feasibility score: <span className="font-bold text-primary">{item.feasibility}%</span></p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <h2 className="text-2xl font-black text-primary">Next Best Actions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {mobileRepairProfile.nextBestActions.map((item) => (
            <div key={item.action} className="border border-slate-200 rounded-3xl p-5 space-y-3 bg-slate-50/60">
              <p className="font-bold text-primary leading-relaxed">{item.action}</p>
              <p className="text-sm text-on-surface-variant font-medium">Time required: <span className="font-bold">{item.timeRequired}</span></p>
              <p className="text-sm text-secondary font-semibold">{item.expectedImpact}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
        <h2 className="text-2xl font-black text-primary">AI Summary (Resume Mode)</h2>
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-on-surface-variant mb-2">Professional Summary</p>
            <p className="text-on-surface-variant font-medium leading-relaxed">{professionalSummary}</p>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-on-surface-variant mb-2">Skills Overview</p>
            <p className="text-on-surface-variant font-medium">
              {mobileRepairProfile.skillClusters.map((cluster) => `${cluster.name} (${cluster.confidence}%)`).join(' • ')}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-on-surface-variant mb-2">Core Strengths</p>
            <p className="text-on-surface-variant font-medium">
              {mobileRepairProfile.strengths.join(', ')}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
