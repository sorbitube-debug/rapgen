
import React from 'react';
import { Cpu, Terminal, Globe, Search, Monitor, ListMusic, CheckCircle2, Settings, Monitor as MonitorIcon, Key, Zap, Loader2, XCircle, Info } from 'lucide-react';
import { AIConfig, AIProvider } from '../../types';

interface AIEngineTabProps {
  theme: string;
  aiConfig: AIConfig;
  onConfigChange: (config: AIConfig) => void;
  validationStatus: 'idle' | 'validating' | 'success' | 'error';
  validationMsg: string;
  onValidate: () => void;
  onProviderChange: (providerId: AIProvider) => void;
}

const PROVIDERS: { id: AIProvider, name: string, description: string, icon: any, color: string }[] = [
  { id: 'gemini', name: 'Google Gemini', description: 'بهینه‌ترین موتور برای زبان فارسی و درک وزن.', icon: Zap, color: 'text-blue-400' },
  { id: 'openai', name: 'ChatGPT (OpenAI)', description: 'استاندارد جهانی با خلاقیت بالا در تصویرسازی.', icon: Cpu, color: 'text-green-400' },
  { id: 'grok', name: 'Grok (xAI)', description: 'زبان تند و تیز، مناسب برای دیس‌بَتل و اشعار گزنده.', icon: Terminal, color: 'text-white' },
  { id: 'openrouter', name: 'OpenRouter', description: 'دسترسی به ده‌ها مدل لاما و کلاود در یکجا.', icon: Globe, color: 'text-purple-400' },
  { id: 'deepseek', name: 'DeepSeek', description: 'قدرتمند در استدلال و ساختارهای پیچیده ادبی.', icon: Cpu, color: 'text-cyan-400' },
  { id: 'huggingface', name: 'Hugging Face', description: 'دسترسی به مدل‌های متن‌باز و تخصصی.', icon: Search, color: 'text-yellow-400' },
  { id: 'ollama', name: 'Ollama (Local)', description: 'اجرای کاملاً رایگان و آفلاین روی سیستم شما.', icon: Monitor, color: 'text-orange-400' },
  { id: 'suno', name: 'Suno (Lyrics)', description: 'تمرکز بر لیریک‌های ریتمیک و ترانه‌سرایی.', icon: ListMusic, color: 'text-pink-400' },
];

export const AIEngineTab: React.FC<AIEngineTabProps> = ({ theme, aiConfig, onConfigChange, validationStatus, validationMsg, onValidate, onProviderChange }) => {
  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="text-rap-accent" size={24} />
            <h3 className={`text-xl font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>انتخاب موتور پردازش</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROVIDERS.map((p) => (
              <button key={p.id} onClick={() => onProviderChange(p.id)} className={`p-4 rounded-2xl border-2 text-right transition-all group relative overflow-hidden ${aiConfig.provider === p.id ? 'border-rap-accent bg-rap-accent/5' : (theme === 'light' ? 'bg-zinc-50 border-zinc-200 hover:border-zinc-300' : 'bg-black/20 border-white/5 hover:border-white/10')}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl bg-white/5 ${p.color}`}><p.icon size={20} /></div>
                  <span className={`font-black text-sm ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>{p.name}</span>
                  {aiConfig.provider === p.id && <CheckCircle2 size={16} className="text-rap-accent mr-auto" />}
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{p.description}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full md:w-80 space-y-6">
          <div className="p-6 rounded-[32px] border border-white/10 bg-black/20 space-y-6">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Settings size={14} /> پیکربندی</h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5"><MonitorIcon size={12} /> شناسه مدل</label>
                <input type="text" value={aiConfig.modelId} onChange={(e) => onConfigChange({...aiConfig, modelId: e.target.value})} placeholder="Model ID" className={`w-full p-3 rounded-xl border text-xs font-mono outline-none focus:border-rap-accent ${theme === 'light' ? 'bg-white border-zinc-200' : 'bg-black/40 border-white/5 text-white'}`} />
              </div>
              {aiConfig.provider !== 'gemini' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5"><Key size={12} /> کلید API</label>
                    <div className="relative">
                      <input type="password" value={aiConfig.apiKey || ''} onChange={(e) => onConfigChange({...aiConfig, apiKey: e.target.value})} placeholder="sk-..." className={`w-full p-3 pr-10 rounded-xl border text-xs outline-none focus:border-rap-accent ${theme === 'light' ? 'bg-white border-zinc-200' : 'bg-black/40 border-white/5 text-white'}`} dir="ltr" />
                      {validationStatus === 'success' && <CheckCircle2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />}
                      {validationStatus === 'error' && <XCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />}
                      {validationStatus === 'validating' && <Loader2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-rap-accent animate-spin" />}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5"><Globe size={12} /> آدرس API</label>
                    <input type="text" value={aiConfig.baseUrl || ''} onChange={(e) => onConfigChange({...aiConfig, baseUrl: e.target.value})} placeholder="Base URL" className={`w-full p-3 rounded-xl border text-[10px] outline-none focus:border-rap-accent ${theme === 'light' ? 'bg-white border-zinc-200' : 'bg-black/40 border-white/5 text-white'}`} dir="ltr" />
                  </div>
                  <button onClick={onValidate} disabled={validationStatus === 'validating'} className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    {validationStatus === 'validating' ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} fill="currentColor" />}
                    بررسی اتصال
                  </button>
                  {validationMsg && <p className={`text-[9px] font-bold mt-1 ${validationStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}>{validationMsg}</p>}
                </>
              )}
            </div>
            <div className="pt-4 border-t border-white/5 text-[10px] text-gray-500 flex items-start gap-2"><Info size={14} className="shrink-0 text-rap-accent" /> کلیدها محلی ذخیره می‌شوند.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
