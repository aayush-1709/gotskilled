import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { PlusCircle, ArrowUp, Eye, ListTodo, Lightbulb, Zap, Clock, TrendingUp } from 'lucide-react';

export function AICoach() {
  return (
    <div className="flex flex-col min-h-screen pt-20 px-4 pb-44 max-w-7xl mx-auto">
      <div className="flex flex-col gap-10 flex-1 max-w-4xl mx-auto w-full">
        {/* User Message */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-end ml-12 md:ml-32"
        >
          <div className="bg-surface-container-highest rounded-3xl rounded-tr-none px-6 py-4 shadow-sm border border-outline-variant/20">
            <p className="text-on-surface text-[16px] md:text-lg font-medium leading-relaxed">
              How can I increase my income while working in data entry?
            </p>
          </div>
        </motion.div>

        {/* AI Response */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-ai-gradient flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <span className="text-[12px] font-black text-secondary tracking-[0.2em] uppercase">AI STRATEGIST</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-outline-variant/30 rounded-[40px] rounded-tl-none p-8 md:p-10 shadow-2xl ai-glow space-y-12"
          >
            {/* Reasoning */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-secondary tracking-[0.3em] uppercase flex items-center gap-3">
                <Eye className="w-4 h-4" /> Strategic Context
              </h4>
              <p className="text-on-surface-variant text-[18px] md:text-xl leading-relaxed font-medium">
                Based on current global talent shifts, manual data entry is being rapidly automated. To increase income, transitioning towards <span className="font-black text-on-surface">Data Quality Assurance</span> or <span className="font-black text-on-surface">AI Training Operations</span> offers a <span className="text-secondary font-black bg-secondary/5 px-2 py-1 rounded">40% higher</span> entry-point salary.
              </p>
            </div>

            {/* Action Steps */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-secondary tracking-[0.3em] uppercase flex items-center gap-3">
                <ListTodo className="w-4 h-4" /> Recommended Evolution Path
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Complete: \"AI Data Labeling Foundations\"",
                  "Optimize: \"99.8% precision notation\"",
                  "Apply: Specialized LLM training platforms"
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-3xl group hover:bg-primary hover:text-white border border-slate-100 hover:border-primary transition-all cursor-pointer">
                    <span className="w-7 h-7 rounded-lg bg-secondary text-white text-[11px] font-black flex items-center justify-center shrink-0 shadow-sm group-hover:bg-white group-hover:text-primary transition-colors">
                      {i + 1}
                    </span>
                    <p className="font-bold text-[15px] leading-tight">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Insight */}
            <div className="bg-secondary/5 border-l-8 border-secondary p-8 rounded-r-[32px] ring-1 ring-secondary/10">
              <div className="flex items-start gap-6">
                <Lightbulb className="w-8 h-8 text-secondary shrink-0" fill="currentColor" />
                <div>
                  <p className="font-black text-secondary text-sm tracking-[0.2em] uppercase mb-2">Alpha Insight</p>
                  <p className="text-on-surface-variant text-[16px] md:text-lg font-bold leading-relaxed">
                    Regional demand for <span className="text-primary font-black">Context-Aware Validation</span> is increasing by 15% WoW. Your background satisfies 80% of entry requirements.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {[
            "Deep dive into AI Training Ops",
            "Show local remote vacancies",
            "Recalibrate my growth path"
          ].map(text => (
            <button key={text} className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl text-[12px] font-black tracking-widest uppercase text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
              {text}
            </button>
          ))}
        </div>
      </div>

      {/* Persistent Bottom Chat Interface */}
      <div className="fixed bottom-24 left-0 w-full px-8 pb-8 space-y-6 pointer-events-none z-50">
        <div className="max-w-4xl mx-auto w-full pointer-events-auto space-y-6">
          {/* Next Best Action */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-[40px] border-2 border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 ring-1 ring-slate-100"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-secondary rounded-[24px] flex items-center justify-center text-white shrink-0 shadow-2xl shadow-secondary/30 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <Zap className="w-10 h-10 relative z-10" fill="currentColor" />
              </div>
              <div>
                <p className="text-[11px] font-black text-secondary uppercase tracking-[0.3em] mb-2">Recommended Micro-Pivot</p>
                <p className="font-black text-on-surface text-2xl md:text-3xl tracking-tighter leading-none">AI Quality Auditor Pathway</p>
                <div className="flex items-center gap-6 mt-4">
                  <span className="text-[11px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                    <Clock className="w-4 h-4" /> 15 MIN EVAL
                  </span>
                  <span className="text-[11px] font-black text-emerald-500 flex items-center gap-2 uppercase tracking-widest">
                    <TrendingUp className="w-4 h-4" /> +12% ROI Potential
                  </span>
                </div>
              </div>
            </div>
            <button className="w-full md:w-auto bg-primary text-white px-12 py-6 rounded-3xl font-black text-sm tracking-[0.2em] uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all">
              Initialize
            </button>
          </motion.div>

          {/* Input Layer */}
          <div className="bg-white rounded-[32px] border-4 border-slate-50 p-2 flex items-center shadow-2xl focus-within:border-secondary transition-all group ring-1 ring-slate-200 h-20 md:h-24 px-4">
            <button className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-slate-400 hover:text-secondary hover:bg-secondary/5 rounded-2xl transition-all">
              <PlusCircle className="w-8 h-8" />
            </button>
            <input 
              type="text" 
              placeholder="Query the Talent Oracle..." 
              className="flex-1 bg-transparent border-none focus:ring-0 px-6 text-lg md:text-xl font-black text-primary placeholder:text-slate-300"
            />
            <button className="w-14 h-14 md:w-16 md:h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all">
              <ArrowUp className="w-8 h-8 md:w-10 md:h-10" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
