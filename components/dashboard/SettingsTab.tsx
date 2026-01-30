
import React from 'react';
import { Palette, CheckCircle2 } from 'lucide-react';
import { ThemeType } from '../../context/ThemeContext';

interface SettingsTabProps {
  theme: string;
  setTheme: (t: ThemeType) => void;
  setPreviewTheme: (t: ThemeType | null) => void;
}

const THEMES: { id: ThemeType, name: string, description: string, colors: string[] }[] = [
  { id: 'dark', name: 'استودیو تاریک', description: 'حالت پیش‌فرض برای تمرکز بالا در شب.', colors: ['#0f0f13', '#ff0055'] },
  { id: 'light', name: 'استودیو روشن', description: 'تم تمیز و با کنتراست بالا برای محیط‌های روشن.', colors: ['#ffffff', '#ff0055'] },
  { id: 'neon', name: 'نئون پالس', description: 'فضایی مدرن با رنگ‌های درخشان و پویا.', colors: ['#05000a', '#06b6d4'] },
  { id: 'classic', name: 'اولد اسکول', description: 'حس نوستالژیک هیپ هاپ کلاسیک با فیلتر سپیا.', colors: ['#1a1815', '#fbbf24'] },
];

export const SettingsTab: React.FC<SettingsTabProps> = ({ theme, setTheme, setPreviewTheme }) => {
  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h3 className={`text-xl font-black flex items-center gap-2 ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}><Palette className="text-rap-accent" /> تنظیمات ظاهری</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {THEMES.map((t) => (
          <button 
            key={t.id}
            onMouseEnter={() => setPreviewTheme(t.id)}
            onMouseLeave={() => setPreviewTheme(null)}
            onClick={() => setTheme(t.id)}
            className={`group p-6 rounded-[24px] border-2 transition-all text-right relative overflow-hidden flex flex-col items-start ${theme === t.id ? 'bg-rap-accent/10 border-rap-accent shadow-xl shadow-rap-accent/10' : (theme === 'light' ? 'bg-zinc-50 border-zinc-200 hover:border-zinc-300' : 'bg-black/20 border-white/10 hover:border-white/30')}`}
          >
            <div className="flex justify-between items-center w-full mb-4">
              <div className="flex gap-1">{t.colors.map((c, i) => <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />)}</div>
              {theme === t.id && <CheckCircle2 size={18} className="text-rap-accent" />}
            </div>
            <h4 className={`text-lg font-black mb-1 transition-colors ${theme === t.id ? 'text-rap-accent' : (theme === 'light' ? 'text-zinc-900' : 'text-white')}`}>{t.name}</h4>
            <p className={`text-xs leading-relaxed opacity-70 ${theme === 'light' ? 'text-zinc-600' : 'text-gray-400'}`}>{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
