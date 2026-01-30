
import React, { useState } from 'react';
import { Coins, Zap, Star, ArrowUpRight, History, CreditCard as CardIcon, HelpCircle, CheckCircle2 } from 'lucide-react';

interface CreditsTabProps {
  theme: string;
  onUpdateCredits: (amount: number) => void;
}

const CREDIT_PLANS = [
  { 
    id: 'starter', 
    name: 'بسته برنزی', 
    units: 50, 
    price: '۲۹,۰۰۰', 
    features: ['تولید ۵ لیریک حرفه‌ای', 'کاور آرت استاندارد (1K)', 'دسترسی به تمام سبک‌ها'],
    color: 'from-orange-500/20 to-transparent',
    icon: Zap
  },
  { 
    id: 'pro', 
    name: 'بسته نقره‌ای (ویژه)', 
    units: 200, 
    price: '۹۹,۰۰۰', 
    features: ['تولید ۲۰ لیریک حرفه‌ای', 'کاور آرت با کیفیت (2K)', 'اولویت در صف پردازش', 'بدون واترمارک'],
    color: 'from-rap-accent/20 to-transparent',
    icon: Star,
    popular: true
  },
  { 
    id: 'studio', 
    name: 'بسته طلایی استودیو', 
    units: 600, 
    price: '۲۴۹,۰۰۰', 
    features: ['تولید ۶۰ لیریک حرفه‌ای', 'کاور آرت فوق‌العاده (4K)', 'پشتیبانی از مدل‌های Thinking', 'دسترسی زودهنگام به افزونه‌ها'],
    color: 'from-yellow-500/20 to-transparent',
    icon: CardIcon
  }
];

export const CreditsTab: React.FC<CreditsTabProps> = ({ theme, onUpdateCredits }) => {
  const [history] = useState([
    { id: 'tr-1', date: '۱۴۰۲/۱۰/۱۲', amount: 50, status: 'موفق', type: 'خرید بسته' },
    { id: 'tr-2', date: '۱۴۰۲/۰۹/۰۵', amount: 200, status: 'موفق', type: 'خرید بسته ویژه' }
  ]);

  return (
    <div className="animate-fadeIn">
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-rap-accent/10 border border-rap-accent/20 px-4 py-1 rounded-full text-rap-accent text-[10px] font-black uppercase tracking-widest mb-6">
          <Coins size={12} /> Credit Studio System
        </div>
        <h3 className={`text-3xl md:text-4xl font-black mb-4 ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>انتخاب بسته شارژ</h3>
        <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">برای استفاده از موتورهای هوشمند و تولید محتوای اختصاصی، اعتبار استودیو خود را شارژ کنید.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {CREDIT_PLANS.map((plan) => (
          <div key={plan.id} className={`relative flex flex-col rounded-[32px] border-2 p-8 transition-all hover:scale-[1.02] ${plan.popular ? 'border-rap-accent shadow-2xl shadow-rap-accent/20 bg-rap-card' : (theme === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-black/20 border-white/10')}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rap-accent text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-rap-accent/30 flex items-center gap-1">
                <Zap size={10} fill="currentColor" /> پیشنهادی
              </div>
            )}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${plan.color}`}>
              <plan.icon className={plan.popular ? 'text-rap-accent' : 'text-gray-400'} size={24} />
            </div>
            <h4 className={`text-xl font-black mb-2 ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>{plan.name}</h4>
            <div className="flex items-baseline gap-2 mb-8">
              <span className={`text-4xl font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>{plan.units}</span>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">UNIT</span>
            </div>
            <div className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-500 font-medium">
                  <CheckCircle2 size={14} className="text-rap-accent shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
            <button onClick={() => onUpdateCredits(plan.units)} className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${plan.popular ? 'bg-rap-accent text-white shadow-xl shadow-rap-accent/20' : (theme === 'light' ? 'bg-zinc-900 text-white' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10')}`}>
              خرید با {plan.price} تومان
              <ArrowUpRight size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`p-8 rounded-[32px] border ${theme === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-black/20 border-white/10'}`}>
          <div className="flex items-center gap-3 mb-6">
            <History className="text-rap-accent" size={20} />
            <h4 className={`text-lg font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>تاریخچه تراکنش‌ها</h4>
          </div>
          <div className="space-y-4">
            {history.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="flex items-center gap-4 text-right">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500"><CardIcon size={18} /></div>
                  <div>
                    <div className={`text-xs font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>{item.type}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{item.date}</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-green-400">+{item.amount} UNIT</div>
                  <div className="text-[10px] text-gray-600 font-bold">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-8 rounded-[32px] border ${theme === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-black/20 border-white/10'}`}>
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="text-rap-accent" size={20} />
            <h4 className={`text-lg font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>سوالات متداول</h4>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className={`text-xs font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>سیستم واحد (Unit) چیست؟</div>
              <p className="text-[11px] text-gray-500 leading-relaxed">هر عملیات در استودیو هزینه‌ای دارد. تولید لیریک ۱۰ واحد و تولید کاور ۵ واحد کسر می‌کند. اعتبار شما هرگز منقضی نمی‌شود.</p>
            </div>
            <div className="space-y-2">
              <div className={`text-xs font-black ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>اگر از لیریک راضی نبودم چه؟</div>
              <p className="text-[11px] text-gray-500 leading-relaxed">در صورت بروز خطای فنی، اعتبار به حساب شما بازگردانده می‌شود. برای بازنویسی خطوط، اعتباری کسر نخواهد شد.</p>
            </div>
            <div className="pt-4 flex justify-center">
              <button className="text-[10px] font-black text-rap-accent border-b border-rap-accent/30 pb-1">مشاهده قوانین کامل مالی و بازگشت وجه</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
