import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  LogOut,
  LayoutDashboard,
  FileText,
  Briefcase,
  Cpu,
  Layers,
  MessageSquare,
  Image as ImageIcon,
  Star,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  AlertCircle,
  Upload,
  Database,
  Cloud,
  X,
} from 'lucide-react';
import {
  authApi,
  aboutApi,
  skillsApi,
  servicesApi,
  projectsApi,
  blogsApi,
  experienceApi,
  testimonialsApi,
  mediaApi,
  contactApi,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
} from './api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Auth State
  const [loginUser, setLoginUser] = useState('admin');
  const [loginPass, setLoginPass] = useState('admin123');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Content Data State
  const [aboutData, setAboutData] = useState<any>({});
  const [skillsList, setSkillsList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [experienceList, setExperienceList] = useState<any[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);

  // Project Modal State (Create / Edit)
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: 'Full-Stack & CMS',
    imageUrl: '',
    demoUrl: '',
    githubUrl: '',
    tags: '',
    featured: false,
    displayOrder: 0,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
      loadAllContent();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await authApi.login(loginUser, loginPass);
      if (res.token) {
        setAuthToken(res.token);
        setIsAuthenticated(true);
        loadAllContent();
        showNotify('success', 'Welcome to Custom CMS Management Dashboard.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Invalid username or password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    showNotify('success', 'Logged out.');
  };

  const showNotify = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAllContent = async () => {
    try {
      const [ab, sk, sv, pr, bl, ex, ts, md, ms] = await Promise.all([
        aboutApi.get().catch(() => ({})),
        skillsApi.getAll().catch(() => []),
        servicesApi.getAll().catch(() => []),
        projectsApi.getAll().catch(() => []),
        blogsApi.getAdminAll().catch(() => []),
        experienceApi.getAll().catch(() => []),
        testimonialsApi.getAll().catch(() => []),
        mediaApi.getAll().catch(() => []),
        contactApi.getMessages().catch(() => []),
      ]);

      setAboutData(ab || {});
      setSkillsList(sk || []);
      setServicesList(sv || []);
      setProjectsList(pr || []);
      setBlogsList(bl || []);
      setExperienceList(ex || []);
      setTestimonialsList(ts || []);
      setMediaList(md || []);
      setMessagesList(ms || []);
    } catch (err: any) {
      console.error('Failed to load content:', err);
    }
  };

  // ABOUT SAVE
  const saveAbout = async () => {
    try {
      const updated = await aboutApi.update(aboutData);
      setAboutData(updated);
      showNotify('success', 'About details updated.');
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  // PROJECT ACTIONS (Create / Edit Modal)
  const openNewProjectModal = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      description: '',
      longDescription: '',
      category: 'Full-Stack & CMS',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
      demoUrl: '',
      githubUrl: '',
      tags: 'Java, Spring Boot, React, Supabase',
      featured: false,
      displayOrder: projectsList.length + 1,
    });
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: any) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title || '',
      description: proj.description || '',
      longDescription: proj.longDescription || '',
      category: proj.category || 'Full-Stack & CMS',
      imageUrl: proj.imageUrl || '',
      demoUrl: proj.demoUrl || '',
      githubUrl: proj.githubUrl || '',
      tags: proj.tags || '',
      featured: !!proj.featured,
      displayOrder: proj.displayOrder || 0,
    });
    setProjectModalOpen(true);
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    try {
      const uploaded = await mediaApi.uploadImage(file);
      setProjectForm((prev) => ({ ...prev, imageUrl: uploaded.fileUrl }));
      showNotify('success', `Uploaded "${file.name}" to Cloudinary!`);
    } catch (err: any) {
      showNotify('error', err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProjectId) {
        const updated = await projectsApi.update(editingProjectId, projectForm);
        setProjectsList(projectsList.map((p) => (p.id === editingProjectId ? updated : p)));
        showNotify('success', 'Project updated successfully!');
      } else {
        const created = await projectsApi.create(projectForm);
        setProjectsList([...projectsList, created]);
        showNotify('success', 'Project created successfully!');
      }
      setProjectModalOpen(false);
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to save project');
    }
  };

  const deleteProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsApi.delete(id);
      setProjectsList(projectsList.filter((p) => p.id !== id));
      showNotify('success', 'Project deleted.');
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  const deleteSkill = async (id: number) => {
    try {
      await skillsApi.delete(id);
      setSkillsList(skillsList.filter((s) => s.id !== id));
      showNotify('success', 'Skill deleted.');
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const uploaded = await mediaApi.uploadImage(file);
      setMediaList([uploaded, ...mediaList]);
      showNotify('success', `Uploaded "${file.name}" to Cloudinary.`);
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Custom CMS Admin Panel</h1>
            <p className="text-xs text-slate-500 font-medium">Standalone Enterprise Content Control Center</p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none"
                  placeholder="admin123"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
            >
              {authLoading ? 'Authenticating...' : 'Sign In To CMS Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
            CMS
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900">Custom CMS Dashboard</h1>
            <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Connected to Supabase PostgreSQL & Cloudinary CDN
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 space-y-1">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'about', label: 'About Info Manager', icon: User },
            { id: 'skills', label: 'Skills & Tech Stack', icon: Cpu },
            { id: 'services', label: 'Services', icon: Layers },
            { id: 'projects', label: 'Projects Manager', icon: Briefcase },
            { id: 'blogs', label: 'Blog Articles', icon: FileText },
            { id: 'experience', label: 'Experience Timeline', icon: Briefcase },
            { id: 'testimonials', label: 'Testimonials', icon: Star },
            { id: 'media', label: 'Media Library (Cloudinary)', icon: ImageIcon },
            { id: 'messages', label: 'Contact Messages Inbox', icon: MessageSquare },
          ].map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {notification && (
            <div
              className={`p-3.5 rounded-xl mb-6 flex items-center gap-2 text-xs font-bold ${
                notification.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{notification.msg}</span>
            </div>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900">CMS Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Projects</span>
                  <p className="text-3xl font-black text-blue-600 mt-1">{projectsList.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Services</span>
                  <p className="text-3xl font-black text-blue-600 mt-1">{servicesList.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Blog Articles</span>
                  <p className="text-3xl font-black text-blue-600 mt-1">{blogsList.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold uppercase">Media Items</span>
                  <p className="text-3xl font-black text-blue-600 mt-1">{mediaList.length}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" /> Database & Storage Connections
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium">Supabase Host:</span>
                    <p className="font-mono text-blue-700 font-bold">aws-0-ap-southeast-1.pooler.supabase.com</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium">Cloudinary Account:</span>
                    <p className="font-mono text-blue-700 font-bold flex items-center gap-1">
                      <Cloud className="w-3.5 h-3.5 text-blue-600" /> tambvqrv
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ABOUT MANAGER */}
          {activeTab === 'about' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">About Info Manager</h2>
                <button
                  onClick={saveAbout}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  <Save className="w-4 h-4" /> Save About Details
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={aboutData.fullName || ''}
                      onChange={(e) => setAboutData({ ...aboutData, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={aboutData.title || ''}
                      onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bio</label>
                  <textarea
                    rows={4}
                    value={aboutData.bio || ''}
                    onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROJECTS MANAGER */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Projects Manager</h2>
                  <p className="text-xs text-slate-500">Create, edit and manage portfolio showcase projects with custom images</p>
                </div>
                <button
                  onClick={openNewProjectModal}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" /> Create New Project
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectsList.map((proj) => (
                  <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group">
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      {proj.imageUrl ? (
                        <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">No Image</div>
                      )}
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        {proj.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-slate-900">{proj.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {proj.tags || 'No tags'}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditProjectModal(proj)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProject(proj.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Services Manager</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {servicesList.map((srv) => (
                  <div key={srv.id} className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-sm">
                    <h4 className="text-base font-bold text-slate-900">{srv.title}</h4>
                    <p className="text-xs text-slate-600">{srv.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Experience Timeline</h2>
              <div className="space-y-3">
                {experienceList.map((exp) => (
                  <div key={exp.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900">{exp.role} @ {exp.company}</h4>
                    <p className="text-xs text-blue-600 font-semibold">{exp.startDate} - {exp.endDate} ({exp.location})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Testimonials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonialsList.map((t) => (
                  <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900">{t.clientName} ({t.company})</h4>
                    <p className="text-xs text-slate-600 italic">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Cloudinary Media Library</h2>
                  <p className="text-xs text-slate-500">Connected to Cloudinary Account: tambvqrv</p>
                </div>

                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700">
                  <Upload className="w-4 h-4" /> Upload Image to CDN
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaList.map((media) => (
                  <div key={media.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
                    <img src={media.fileUrl} alt={media.filename} className="w-full h-32 object-cover" />
                    <div className="p-2 bg-slate-900 text-white text-[10px] truncate">{media.filename}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">Skills</h2>
                <button
                  onClick={async () => {
                    const created = await skillsApi.create({
                      name: 'New Tech Skill',
                      category: 'Backend',
                      proficiency: 90,
                      iconName: 'Code',
                      displayOrder: skillsList.length + 1,
                    });
                    setSkillsList([...skillsList, created]);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" /> Add Skill
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillsList.map((skill) => (
                  <div key={skill.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{skill.name}</h4>
                      <p className="text-xs text-blue-600 font-semibold">{skill.category} • {skill.proficiency}%</p>
                    </div>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MESSAGES INBOX */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Received Contact Inquiries</h2>
              <div className="space-y-3">
                {messagesList.map((msg) => (
                  <div key={msg.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-blue-600">{msg.name} ({msg.email})</span>
                      <span className="text-slate-400">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{msg.subject}</h4>
                    <p className="text-xs text-slate-600">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* FULL PROJECT EDITOR MODAL */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setProjectModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {editingProjectId ? 'Edit Project Details' : 'Create New Project'}
              </h3>
              <p className="text-xs text-slate-500">Fill in project specs and upload image directly to Cloudinary CDN</p>
            </div>

            <form onSubmit={saveProjectForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. Enterprise Headless CMS Platform"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600 font-bold"
                  >
                    <option value="Full-Stack & CMS">Full-Stack & CMS</option>
                    <option value="Web App">Web App</option>
                    <option value="Cloud & API">Cloud & API</option>
                    <option value="Mobile App">Mobile App</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Summary/Description</label>
                <input
                  type="text"
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Brief 1-2 sentence overview of key features..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description (Modal View)</label>
                <textarea
                  rows={3}
                  value={projectForm.longDescription}
                  onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                  placeholder="Detailed architectural breakdown..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              {/* IMAGE UPLOAD & URL FIELD */}
              <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700">Project Cover Image</label>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                    <Upload className="w-4 h-4" />
                    {uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Image File'}
                    <input type="file" accept="image/*" onChange={handleProjectImageUpload} className="hidden" />
                  </label>

                  <span className="text-xs text-slate-400 font-bold uppercase">or enter URL:</span>

                  <input
                    type="text"
                    value={projectForm.imageUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none"
                  />
                </div>

                {/* Live Image Preview */}
                {projectForm.imageUrl && (
                  <div className="relative h-36 w-full rounded-xl overflow-hidden border border-slate-200 mt-2">
                    <img src={projectForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Live Demo URL</label>
                  <input
                    type="text"
                    value={projectForm.demoUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                    placeholder="https://my-app.vercel.app"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Repo URL</label>
                  <input
                    type="text"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tech Stack Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  placeholder="Java, Spring Boot, React, Next.js, Supabase"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featuredCheck" className="text-xs font-bold text-slate-800">
                  Mark as Featured Project on Portfolio Hero
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  {editingProjectId ? 'Save Project Updates' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
