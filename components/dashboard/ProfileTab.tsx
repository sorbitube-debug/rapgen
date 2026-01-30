
import React, { useState, useMemo } from 'react';
import { 
  User, Calendar, Shield, Camera, Pencil, Loader2, Save, 
  Trophy, FolderOpen, Coins, Activity as ActivityIcon, Zap, 
  Clock, FileText, ArrowUpRight, LogOut, ShieldCheck
} from 'lucide-react';
import { User as UserType, CloudProject } from '../../types';

interface ProfileTabProps {
  user: UserType;
  theme: string;
  projects: CloudProject[];
  onLoadProject: (project: CloudProject) => void;
  onLogout: () => void;
  onNavigateToProjects: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user, theme, projects, onLoadProject, onLogout, onNavigateToProjects }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(user?.name || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'done'>('idle');

  const handleUpdateProfile = () => {
    if (!tempName.trim()) return;
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('done');
      setIsEditingProfile(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const userLevel = useMemo(() => {
    if (user.credits > 500) return { name: 'طلایی', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    if (user.credits > 100) return { name: 'نقره‌ای', color: 'text-gray-300', bg: 'bg-gray-300/10' };
    return { name: 'پایه', color: 'text-orange-400', bg: 'bg-orange-400/10' };
  }, [user.credits]);

  return (
    <div className="animate-fadeIn space-y-10">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="relative group mx-auto md:mx-0 shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-rap-accent via-purple-500 to-cyan-400 shadow-2xl shadow-rap-accent/20">
            <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-8 text-gray-500" />}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="text-white" size={24} />
              </div>
            </div>
          </div>
          <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg ${userLevel.bg} ${userLevel.color}`}>
            <Trophy size={10} /> سطح {userLevel.name}
          </div>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-right w-full">
          <div className="space-y-1">
            {isEditingProfile ? (
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <input 
                  type="text" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  className={`bg-transparent border-b-2 border-rap-accent text-3xl font-black outline-none py-1 w-full md:w-64 ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}
                />
                <button onClick={handleUpdateProfile} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all">
                  {saveStatus === 'saving' ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                </button>
              </div>
            ) : (
              <h2 className={`text-3xl md:text-4xl font-black flex items-center gap-3 justify-center md:justify-start ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                {user.name}
                <button onClick={() => setIsEditingProfile(true)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-rap-accent transition-all"><Pencil size={18} /></button>
              </h2>
            )}
            <p className="text-gray-500 text-sm dir-ltr font-mono">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-gray-500 flex items-center gap-1"><Calendar size={12} /> عضویت از دی ۱۴۰۲</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-gray-500 flex items-center gap-1"><Shield size={12} /> حساب تایید شده</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5">
            <div className={`p-4 rounded-3xl border ${theme === 'light' ? 'bg-zinc-50 border-zinc-100' : 'bg-black/20 border-white/5'}`}>
              <div className="text-[10px] font-bold text-gray-500 mb-1 flex items-center gap-1 justify-center md:justify-start"><FolderOpen size={10} /> کل پروژه‌ها</div>
              <div className={`text-xl font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>{projects.length}</div>
            </div>
            <div className={`p-4 rounded-3xl border ${theme === 'light' ? 'bg-zinc-50 border-zinc-100' : 'bg-black/20 border-white/5'}`}>
              <div className="text-[10px] font-bold text-gray-500 mb-1 flex items-center gap-1 justify-center md:justify-start"><Coins size={10} /> اعتبار کل</div>
              <div className={`text-xl font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>{user.credits}</div>
            </div>
            <div className={`p-4 rounded-3xl border ${theme === 'light' ? 'bg-zinc-50 border-zinc-100' : 'bg-black/20 border-white/5'}`}>
              <div className="text-[10px] font-bold text-gray-500 mb-1 flex items-center gap-1 justify-center md:justify-start"><ActivityIcon size={10} /> لیریک ماهانه</div>
              <div className={`text-xl font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>۱۲</div>
            </div>
            <div className={`p-4 rounded-3xl border ${theme === 'light' ? 'bg-zinc-50 border-zinc-100' : 'bg-black/20 border-white/5'}`}>
              <div className="text-[10px] font-bold text-gray-500 mb-1 flex items-center gap-1 justify-center md:justify-start"><Zap size={10} /> فلو ریت</div>
              <div className={`text-xl font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>۹۸٪</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <div className="space-y-6">
          <h3 className={`text-lg font-black flex items-center gap-2 ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}><Clock className="text-rap-accent" size={20} /> آخرین پروژه‌های فعال</h3>
          <div className="space-y-3">
            {projects.slice(0, 3).map(p => (
              <div key={p.id} onClick={() => onLoadProject(p)} className={`p-4 rounded-2xl border transition-all cursor-pointer group ${theme === 'light' ? 'bg-zinc-50 border-zinc-100 hover:border-zinc-300' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rap-accent/10 flex items-center justify-center text-rap-accent"><FileText size={18} /></div>
                    <div>
                      <div className={`text-xs font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>{p.title}</div>
                      <div className="text-[9px] text-gray-500 mt-0.5">{p.style}</div>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-gray-600 group-hover:text-rap-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </div>
            ))}
            <button onClick={onNavigateToProjects} className="w-full py-3 rounded-xl border border-dashed border-white/10 text-[10px] font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-all">مشاهده آرشیو کامل</button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className={`text-lg font-black flex items-center gap-2 ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}><ShieldCheck className="text-green-500" size={20} /> امنیت و حساب</h3>
          <div className={`p-6 rounded-3xl border space-y-6 ${theme === 'light' ? 'bg-zinc-50 border-zinc-100' : 'bg-black/20 border-white/5'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-xs font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>ورود دو مرحله‌ای</div>
                <div className="text-[10px] text-gray-500 mt-1">امنیت حساب خود را ارتقا دهید.</div>
              </div>
              <button className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-bold text-gray-400 border border-white/5 hover:text-white transition-all">فعال‌سازی</button>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div>
                <div className={`text-xs font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>تغییر کلمه عبور</div>
                <div className="text-[10px] text-gray-500 mt-1">آخرین تغییر: ۳ ماه پیش</div>
              </div>
              <button className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-bold text-gray-400 border border-white/5 hover:text-white transition-all">بروزرسانی</button>
            </div>
            <button onClick={onLogout} className="w-full bg-red-500/10 hover:bg-red-500/20 py-3 rounded-xl text-red-500 text-xs font-black transition-all flex items-center justify-center gap-2 mt-4">
              <LogOut size={16} /> خروج از حساب کاربری
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
