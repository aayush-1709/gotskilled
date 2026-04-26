import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

type ManualTextInputProps = {
  onBackToVoice: () => void;
  onSaveProfile: () => void;
};

export function ManualTextInput({ onBackToVoice, onSaveProfile }: ManualTextInputProps) {
  const [storyText, setStoryText] = useState(() => localStorage.getItem('gotskilled.manualInput') ?? '');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('gotskilled.manualInput', storyText);
  }, [storyText]);

  const handleSaveProfile = () => {
    localStorage.setItem('gotskilled.manualInput', storyText.trim());
    localStorage.setItem('gotskilled.profileLastUpdatedAt', new Date().toISOString());
    setSaveMessage('Profile details updated.');
    onSaveProfile();
  };

  return (
    <div className="flex flex-col min-h-screen pt-24 md:pt-32 px-6 pb-24 md:pb-32 max-w-7xl mx-auto items-center">
      <div className="max-w-2xl w-full">
        <div className="w-full flex justify-between items-center mb-14 gap-4">
          <div className="flex-1 h-3 bg-secondary rounded-full shadow-[0_0_12px_rgba(75,65,225,0.4)]"></div>
          <div className="flex-1 h-3 bg-slate-100 rounded-full"></div>
          <div className="flex-1 h-3 bg-slate-100 rounded-full"></div>
          <div className="flex-1 h-3 bg-slate-100 rounded-full"></div>
        </div>

        <div className="text-center mb-10 space-y-5">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-violet-50 border border-violet-100 rounded-2xl">
            <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              edit_note
            </span>
            <span className="text-[12px] font-black text-secondary tracking-[0.2em] uppercase">Manual Intake</span>
          </div>
          <h2 className="text-[40px] md:text-[56px] font-black text-primary leading-[1.1] tracking-tighter">
            Type your experience
          </h2>
          <p className="text-lg text-on-surface-variant font-medium max-w-xl mx-auto">
            Share your day-to-day work, strongest projects, and real outcomes. The richer your story, the better your skill map.
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4"
        >
          <label htmlFor="manual-intake" className="block text-[12px] font-black text-primary tracking-[0.2em] uppercase">
            Your Narrative
          </label>
          <textarea
            id="manual-intake"
            value={storyText}
            onChange={(event) => setStoryText(event.target.value)}
            placeholder="Example: I coordinate a small construction team, plan schedules, monitor safety, and reduce delays by resolving material bottlenecks quickly..."
            className="w-full min-h-[220px] resize-y rounded-2xl border border-slate-200 px-4 py-4 text-[15px] leading-relaxed text-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/50"
          />
          <p className="text-xs text-slate-500 font-medium">
            Tip: Mention tools, decisions, team size, constraints, and measurable impact.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={handleSaveProfile}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary text-white text-[12px] font-black tracking-widest uppercase hover:bg-secondary transition-all"
          >
            Save & Update Profile
          </button>
          <button
            onClick={onBackToVoice}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 text-primary text-[12px] font-black tracking-widest uppercase hover:bg-slate-50 transition-all"
          >
            Back to voice intake
          </button>
        </div>
        {saveMessage && <p className="mt-3 text-sm font-medium text-emerald-700">{saveMessage}</p>}
      </div>
    </div>
  );
}
