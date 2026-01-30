
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, LogIn, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await login(email, password);
      else await signup(name, email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'خطایی رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="w-full max-w-md bg-rap-card border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-rap-accent to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rap-accent/20">
               <Sparkles className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-black text-white">{mode === 'login' ? 'خوش آمدید' : 'شروع مهندسی'}</h2>
            <p className="text-gray-400 text-sm mt-1">وارد حساب کاربری خود شوید</p>
          </div>

          <div className="flex bg-black/40 p-1 rounded-2xl mb-8 border border-white/5">
            <button onClick={() => setMode('login')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${mode === 'login' ? 'bg-white/10 text-white shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>ورود</button>
            <button onClick={() => setMode('signup')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${mode === 'signup' ? 'bg-white/10 text-white shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>ثبت‌نام</button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative group">
                <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rap-accent transition-colors" size={18} />
                <input required type="text" placeholder="نام نمایشی" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-2xl pr-12 pl-4 py-4 text-sm focus:border-rap-accent outline-none text-white transition-all" />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rap-accent transition-colors" size={18} />
              <input required type="email" placeholder="آدرس ایمیل" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-2xl pr-12 pl-4 py-4 text-sm focus:border-rap-accent outline-none text-white transition-all" dir="ltr" />
            </div>
            <div className="relative group">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rap-accent transition-colors" size={18} />
              <input required type="password" placeholder="کلمه عبور" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-2xl pr-12 pl-4 py-4 text-sm focus:border-rap-accent outline-none text-white transition-all" dir="ltr" />
            </div>

            <button disabled={loading} className="w-full bg-gradient-to-r from-rap-accent to-purple-600 hover:from-rap-accentHover hover:to-purple-700 py-4.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-rap-accent/20 disabled:opacity-50 mt-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
                {mode === 'login' ? 'ورود به پنل کاربری' : 'شروع رایگان مهندسی لیریک'}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
