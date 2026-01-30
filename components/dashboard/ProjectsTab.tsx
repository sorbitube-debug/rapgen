
import React, { useMemo, useState } from 'react';
import { 
  LayoutGrid, Search, Filter, Plus, Loader2, FileText, 
  Pencil, Trash2, CheckCircle2, CalendarDays, ChevronLeft 
} from 'lucide-react';
import { CloudProject, RapStyle } from '../../types';
import { cloudStorage } from '../../services/cloudStorage';

interface ProjectsTabProps {
  projects: CloudProject[];
  loading: boolean;
  theme: string;
  onLoadProject: (project: CloudProject) => void;
  onNavigateHome: () => void;
  onReload: () => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects, loading, theme, onLoadProject, onNavigateHome, onReload }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [styleFilter, setStyleFilter] = useState<RapStyle | 'all'>('all');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStyle = styleFilter === 'all' || p.style === styleFilter;
      return matchesSearch && matchesStyle;
    });
  }, [projects, searchQuery, styleFilter]);

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('آیا از حذف این پروژه اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
      cloudStorage.deleteProject(id);
      onReload();
    }
  };

  const handleStartRename = (e: React.MouseEvent, project: CloudProject) => {
    e.stopPropagation();
    setEditingProjectId(project.id);
    setEditTitleValue(project.title);
  };

  const handleSaveRename = (project: CloudProject) => {
    if (editTitleValue.trim() && editTitleValue !== project.title) {
      cloudStorage.saveProject({ ...project, title: editTitleValue.trim() });
      onReload();
    }
    setEditingProjectId(null);
  };

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <h3 className={`text-2xl font-black flex items-center gap-3 ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>
          <LayoutGrid className="text-rap-accent" size={28} /> آرشیو پروژه‌ها
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rap-accent transition-colors" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در عنوان یا متن..."
              className={`w-full md:w-64 pr-11 pl-4 py-2.5 rounded-2xl border text-xs outline-none focus:border-rap-accent transition-all ${theme === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-black/20 border-white/5 text-white'}`}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <select 
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value as any)}
              className={`pr-10 pl-4 py-2.5 rounded-2xl border text-[10px] font-black outline-none focus:border-rap-accent appearance-none transition-all cursor-pointer ${theme === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-black/20 border-white/5 text-white'}`}
            >
              <option value="all">همه سبک‌ها</option>
              {Object.values(RapStyle).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
          <Loader2 className="animate-spin text-rap-accent" size={32} />
          <p className="font-bold text-sm">در حال بازیابی فایل‌ها...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mb-6 text-gray-600">
            <FileText size={40} strokeWidth={1.5} />
          </div>
          <h4 className={`text-xl font-black mb-2 ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>پروژه‌ای پیدا نشد</h4>
          <p className="text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
            {searchQuery ? 'پروژه‌ای با این مشخصات در آرشیو شما موجود نیست.' : 'شما هنوز هیچ لیریکی تولید نکرده‌اید. همین حالا شروع کنید!'}
          </p>
          {!searchQuery && (
            <button onClick={onNavigateHome} className="bg-rap-accent text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
              <Plus size={18} /> تولید اولین لیریک
            </button>
          )}
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setStyleFilter('all'); }} className="text-rap-accent text-xs font-black underline underline-offset-4">نمایش همه پروژه‌ها</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => onLoadProject(project)}
              className={`group border rounded-[32px] p-6 transition-all relative overflow-hidden flex flex-col cursor-pointer border-2 h-full ${
                theme === 'light' 
                ? 'bg-white border-zinc-100 hover:border-rap-accent shadow-sm' 
                : 'bg-[#0a0a0c] border-white/5 hover:border-rap-accent/50 shadow-xl'
              }`}
            >
              <div className="flex justify-between items-center mb-5">
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                  theme === 'light' ? 'bg-zinc-100 text-zinc-600' : 'bg-rap-accent/10 text-rap-accent'
                }`}>
                  {project.style}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => handleStartRename(e, project)} className="p-2 text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    <Pencil size={14} />
                  </button>
                  <button onClick={(e) => handleDeleteProject(e, project.id)} className="p-2 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              {editingProjectId === project.id ? (
                <div className="mb-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <input autoFocus type="text" value={editTitleValue} onChange={(e) => setEditTitleValue(e.target.value)} onBlur={() => handleSaveRename(project)} onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(project)} className={`flex-1 bg-transparent border-b-2 border-rap-accent text-lg font-black outline-none py-1 ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`} />
                  <CheckCircle2 size={18} className="text-green-500 cursor-pointer" onClick={() => handleSaveRename(project)} />
                </div>
              ) : (
                <h4 className={`text-xl font-black mb-3 line-clamp-1 group-hover:text-rap-accent transition-colors ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                  {project.title}
                </h4>
              )}

              <p className={`text-xs line-clamp-4 leading-loose mb-6 flex-grow ${theme === 'light' ? 'text-zinc-500' : 'text-gray-400'}`}>
                {project.content.replace(/\[.*?\]/g, '')}
              </p>
              
              <div className="flex items-center justify-between pt-5 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-bold">
                  <CalendarDays size={12} />
                  {new Date(project.lastModified).toLocaleDateString('fa-IR')}
                </div>
                <div className="text-[10px] font-black text-rap-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                  باز کردن <ChevronLeft size={10} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
