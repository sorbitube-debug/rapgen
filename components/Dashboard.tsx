
import React, { useState, useEffect } from 'react';
import { User, FolderOpen, Palette, Cpu, Coins, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cloudStorage } from '../services/cloudStorage';
import { validateAIConfig } from '../services/aiDispatcher';
import { CloudProject, AIConfig, AIProvider } from '../types';

// Sub-components
import { ProfileTab } from './dashboard/ProfileTab';
import { ProjectsTab } from './dashboard/ProjectsTab';
import { CreditsTab } from './dashboard/CreditsTab';
import { AIEngineTab } from './dashboard/AIEngineTab';
import { SettingsTab } from './dashboard/SettingsTab';

interface DashboardProps {
  initialTab?: 'profile' | 'projects' | 'credits' | 'settings' | 'ai_engine';
  onNavigateHome: () => void;
  onLoadProject: (project: CloudProject) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ initialTab = 'profile', onNavigateHome, onLoadProject }) => {
  const { user, logout, updateCredits } = useAuth();
  const { theme, setTheme, setPreviewTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'credits' | 'settings' | 'ai_engine'>(initialTab as any);
  const [projects, setProjects] = useState<CloudProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const [aiConfig, setAiConfig] = useState<AIConfig>(() => {
    const saved = localStorage.getItem('rapgen_ai_config');
    return saved ? JSON.parse(saved) : { provider: 'gemini', modelId: 'gemini-3-flash-preview' };
  });

  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [validationMsg, setValidationMsg] = useState('');

  useEffect(() => {
    setActiveTab(initialTab as any);
  }, [initialTab]);

  useEffect(() => {
    localStorage.setItem('rapgen_ai_config', JSON.stringify(aiConfig));
    setValidationStatus('idle');
  }, [aiConfig]);

  const loadProjects = () => {
    if (user) {
      setLoadingProjects(true);
      setTimeout(() => {
        setProjects(cloudStorage.getProjects(user.id).sort((a, b) => b.lastModified - a.lastModified));
        setLoadingProjects(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (user && (activeTab === 'projects' || activeTab === 'profile')) {
      loadProjects();
    }
  }, [user, activeTab]);

  const handleValidateAI = async () => {
    if (aiConfig.provider === 'gemini') return;
    setValidationStatus('validating');
    const result = await validateAIConfig(aiConfig);
    setValidationStatus(result.success ? 'success' : 'error');
    setValidationMsg(result.message);
  };

  const handleProviderChange = (providerId: AIProvider) => {
    const defaults: Record<string, string> = {
      gemini: 'gemini-3-flash-preview',
      openai: 'gpt-4o',
      grok: 'grok-1',
      openrouter: 'meta-llama/llama-3-70b-instruct',
      deepseek: 'deepseek-chat',
      huggingface: 'mistralai/Mistral-7B-Instruct-v0.2',
      ollama: 'llama3',
      suno: 'suno-v3'
    };
    setAiConfig({
      ...aiConfig,
      provider: providerId,
      modelId: defaults[providerId] || aiConfig.modelId,
      baseUrl: providerId === 'ollama' ? 'http://localhost:11434/v1/chat/completions' : ''
    });
  };

  if (!user) return null;

  const tabs = [
    { id: 'profile', icon: User, label: 'پروفایل' },
    { id: 'projects', icon: FolderOpen, label: 'پروژه‌ها' },
    { id: 'settings', icon: Palette, label: 'ظاهر' },
    { id: 'ai_engine', icon: Cpu, label: 'موتور AI' },
    { id: 'credits', icon: Coins, label: 'اعتبار' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 pt-8 animate-fadeIn text-right" dir="rtl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <button onClick={onNavigateHome} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> بازگشت به استودیو
        </button>
        
        <div className={`flex border p-1.5 rounded-2xl overflow-x-auto no-scrollbar scrollbar-hide ${theme === 'light' ? 'bg-zinc-200 border-zinc-300' : 'bg-rap-card border-white/10'}`}>
          {tabs.map(t => (
            <button 
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === t.id ? 'bg-white/10 text-white shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <t.icon size={16} /> <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`border rounded-[40px] p-6 md:p-10 shadow-2xl min-h-[500px] overflow-hidden ${theme === 'light' ? 'bg-white border-zinc-200' : 'bg-rap-card border-white/5'}`}>
        {activeTab === 'profile' && (
          <ProfileTab 
            user={user} 
            theme={theme} 
            projects={projects} 
            onLoadProject={onLoadProject} 
            onLogout={logout} 
            onNavigateToProjects={() => setActiveTab('projects')}
          />
        )}
        {activeTab === 'projects' && (
          <ProjectsTab 
            projects={projects} 
            loading={loadingProjects} 
            theme={theme} 
            onLoadProject={onLoadProject} 
            onNavigateHome={onNavigateHome}
            onReload={loadProjects}
          />
        )}
        {activeTab === 'credits' && (
          <CreditsTab 
            theme={theme} 
            onUpdateCredits={updateCredits} 
          />
        )}
        {activeTab === 'ai_engine' && (
          <AIEngineTab 
            theme={theme} 
            aiConfig={aiConfig} 
            onConfigChange={setAiConfig}
            validationStatus={validationStatus}
            validationMsg={validationMsg}
            onValidate={handleValidateAI}
            onProviderChange={handleProviderChange}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab 
            theme={theme} 
            setTheme={setTheme} 
            setPreviewTheme={setPreviewTheme}
          />
        )}
      </div>
    </div>
  );
};
