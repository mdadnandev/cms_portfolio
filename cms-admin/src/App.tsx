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

  // Skill Modal State (Create / Edit)
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Backend',
    proficiency: 85,
    iconName: 'Code2',
    displayOrder: 0,
  });

  // Blog Article Modal State
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    coverImage: '',
    author: 'Md Adnan',
    readTime: '5 min read',
    tags: 'Java, Spring Boot, Architecture',
    published: true,
  });
  const [uploadingBlogImage, setUploadingBlogImage] = useState(false);

  // Service Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    iconName: 'Server',
    features: 'Spring Boot REST APIs, Next.js Frontend, Supabase Database',
    displayOrder: 0,
  });

  // Experience Modal State
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(null);
  const [experienceForm, setExperienceForm] = useState({
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: 'Present',
    isCurrent: false,
    description: '',
    achievements: 'Architected scalable backend microservices, Integrated Cloudinary CDN',
    displayOrder: 0,
  });

  // Testimonial Modal State
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    clientName: '',
    clientRole: 'Product Lead / Director',
    company: '',
    avatarUrl: '',
    quote: '',
    rating: 5,
  });
  const [uploadingAvatarImage, setUploadingAvatarImage] = useState(false);

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

  // SKILL ACTIONS (Create / Edit Modal)
  const openNewSkillModal = () => {
    setEditingSkillId(null);
    setSkillForm({
      name: '',
      category: 'Backend',
      proficiency: 85,
      iconName: 'Code2',
      displayOrder: skillsList.length + 1,
    });
    setSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: any) => {
    setEditingSkillId(skill.id);
    setSkillForm({
      name: skill.name || '',
      category: skill.category || 'Backend',
      proficiency: skill.proficiency ?? 85,
      iconName: skill.iconName || 'Code2',
      displayOrder: skill.displayOrder ?? 0,
    });
    setSkillModalOpen(true);
  };

  const saveSkillForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkillId) {
        const updated = await skillsApi.update(editingSkillId, skillForm);
        setSkillsList(skillsList.map((s) => (s.id === editingSkillId ? updated : s)));
        showNotify('success', 'Skill updated successfully!');
      } else {
        const created = await skillsApi.create(skillForm);
        setSkillsList([...skillsList, created]);
        showNotify('success', 'Skill added successfully!');
      }
      setSkillModalOpen(false);
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to save skill');
    }
  };

  const deleteSkill = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await skillsApi.delete(id);
      setSkillsList(skillsList.filter((s) => s.id !== id));
      showNotify('success', 'Skill deleted.');
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  // BLOG ACTIONS
  const openNewBlogModal = () => {
    setEditingBlogId(null);
    setBlogForm({
      title: '',
      slug: '',
      summary: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
      author: 'Md Adnan',
      readTime: '5 min read',
      tags: 'Java, Spring Boot, Architecture',
      published: true,
    });
    setBlogModalOpen(true);
  };

  const openEditBlogModal = (blog: any) => {
    setEditingBlogId(blog.id);
    setBlogForm({
      title: blog.title || '',
      slug: blog.slug || '',
      summary: blog.summary || '',
      content: blog.content || '',
      coverImage: blog.coverImage || '',
      author: blog.author || 'Md Adnan',
      readTime: blog.readTime || '5 min read',
      tags: blog.tags || '',
      published: blog.published !== false,
    });
    setBlogModalOpen(true);
  };

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingBlogImage(true);
    try {
      const uploaded = await mediaApi.uploadImage(file);
      setBlogForm((prev) => ({ ...prev, coverImage: uploaded.fileUrl }));
      showNotify('success', `Uploaded "${file.name}" to Cloudinary!`);
    } catch (err: any) {
      showNotify('error', err.message || 'Image upload failed');
    } finally {
      setUploadingBlogImage(false);
    }
  };

  const saveBlogForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlogId) {
        const updated = await blogsApi.update(editingBlogId, blogForm);
        setBlogsList(blogsList.map((b) => (b.id === editingBlogId ? updated : b)));
        showNotify('success', 'Blog article updated!');
      } else {
        const created = await blogsApi.create(blogForm);
        setBlogsList([created, ...blogsList]);
        showNotify('success', 'Blog article published successfully!');
      }
      setBlogModalOpen(false);
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to save blog');
    }
  };

  const deleteBlog = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this blog article?')) return;
    try {
      await blogsApi.delete(id);
      setBlogsList(blogsList.filter((b) => b.id !== id));
      showNotify('success', 'Blog article deleted.');
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  // SERVICE ACTIONS
  const openNewServiceModal = () => {
    setEditingServiceId(null);
    setServiceForm({
      title: '',
      description: '',
      iconName: 'Server',
      features: 'Spring Boot REST APIs, Next.js Frontend, Supabase Database',
      displayOrder: servicesList.length + 1,
    });
    setServiceModalOpen(true);
  };

  const openEditServiceModal = (srv: any) => {
    setEditingServiceId(srv.id);
    setServiceForm({
      title: srv.title || '',
      description: srv.description || '',
      iconName: srv.iconName || 'Server',
      features: srv.features || '',
      displayOrder: srv.displayOrder ?? 0,
    });
    setServiceModalOpen(true);
  };

  const saveServiceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingServiceId) {
        const updated = await servicesApi.update(editingServiceId, serviceForm);
        setServicesList(servicesList.map((s) => (s.id === editingServiceId ? updated : s)));
        showNotify('success', 'Service updated successfully!');
      } else {
        const created = await servicesApi.create(serviceForm);
        setServicesList([...servicesList, created]);
        showNotify('success', 'Service added successfully!');
      }
      setServiceModalOpen(false);
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to save service');
    }
  };

  const deleteService = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await servicesApi.delete(id);
      setServicesList(servicesList.filter((s) => s.id !== id));
      showNotify('success', 'Service deleted.');
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  // EXPERIENCE ACTIONS
  const openNewExperienceModal = () => {
    setEditingExperienceId(null);
    setExperienceForm({
      role: '',
      company: '',
      location: 'Remote',
      startDate: 'Jan 2023',
      endDate: 'Present',
      isCurrent: true,
      description: '',
      achievements: 'Architected scalable backend microservices, Integrated Cloudinary CDN',
      displayOrder: experienceList.length + 1,
    });
    setExperienceModalOpen(true);
  };

  const openEditExperienceModal = (exp: any) => {
    setEditingExperienceId(exp.id);
    setExperienceForm({
      role: exp.role || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      isCurrent: !!exp.isCurrent,
      description: exp.description || '',
      achievements: exp.achievements || '',
      displayOrder: exp.displayOrder ?? 0,
    });
    setExperienceModalOpen(true);
  };

  const saveExperienceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExperienceId) {
        const updated = await experienceApi.update(editingExperienceId, experienceForm);
        setExperienceList(experienceList.map((ex) => (ex.id === editingExperienceId ? updated : ex)));
        showNotify('success', 'Experience timeline updated!');
      } else {
        const created = await experienceApi.create(experienceForm);
        setExperienceList([...experienceList, created]);
        showNotify('success', 'Experience timeline item added!');
      }
      setExperienceModalOpen(false);
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to save experience');
    }
  };

  const deleteExperience = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this experience entry?')) return;
    try {
      await experienceApi.delete(id);
      setExperienceList(experienceList.filter((ex) => ex.id !== id));
      showNotify('success', 'Experience entry deleted.');
    } catch (err: any) {
      showNotify('error', err.message);
    }
  };

  // TESTIMONIAL ACTIONS
  const openNewTestimonialModal = () => {
    setEditingTestimonialId(null);
    setTestimonialForm({
      clientName: '',
      clientRole: 'Product Lead / Director',
      company: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
      quote: '',
      rating: 5,
    });
    setTestimonialModalOpen(true);
  };

  const openEditTestimonialModal = (t: any) => {
    setEditingTestimonialId(t.id);
    setTestimonialForm({
      clientName: t.clientName || '',
      clientRole: t.clientRole || '',
      company: t.company || '',
      avatarUrl: t.avatarUrl || '',
      quote: t.quote || '',
      rating: t.rating ?? 5,
    });
    setTestimonialModalOpen(true);
  };

  const handleAvatarImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingAvatarImage(true);
    try {
      const uploaded = await mediaApi.uploadImage(file);
      setTestimonialForm((prev) => ({ ...prev, avatarUrl: uploaded.fileUrl }));
      showNotify('success', `Uploaded "${file.name}" to Cloudinary!`);
    } catch (err: any) {
      showNotify('error', err.message || 'Avatar upload failed');
    } finally {
      setUploadingAvatarImage(false);
    }
  };

  const saveTestimonialForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestimonialId) {
        const updated = await testimonialsApi.update(editingTestimonialId, testimonialForm);
        setTestimonialsList(testimonialsList.map((t) => (t.id === editingTestimonialId ? updated : t)));
        showNotify('success', 'Testimonial updated!');
      } else {
        const created = await testimonialsApi.create(testimonialForm);
        setTestimonialsList([...testimonialsList, created]);
        showNotify('success', 'Testimonial added successfully!');
      }
      setTestimonialModalOpen(false);
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to save testimonial');
    }
  };

  const deleteTestimonial = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await testimonialsApi.delete(id);
      setTestimonialsList(testimonialsList.filter((t) => t.id !== id));
      showNotify('success', 'Testimonial deleted.');
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Services Manager</h2>
                  <p className="text-xs text-slate-500">Define services, solution features, and ordering for portfolio showcase</p>
                </div>
                <button
                  onClick={openNewServiceModal}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add New Service
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesList.map((srv) => (
                  <div key={srv.id} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-slate-900">{srv.title}</h4>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                          Order: {srv.displayOrder || 0}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-3">{srv.description}</p>
                      
                      {srv.features && (
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold uppercase text-slate-400">Features:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {srv.features.split(',').map((feat: string, idx: number) => (
                              <span key={idx} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                                • {feat.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                      <button
                        onClick={() => openEditServiceModal(srv)}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteService(srv.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Experience Timeline</h2>
                  <p className="text-xs text-slate-500">Manage work experience history, companies, date ranges, and achievements</p>
                </div>
                <button
                  onClick={openNewExperienceModal}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Experience Entry
                </button>
              </div>

              <div className="space-y-4">
                {experienceList.map((exp) => (
                  <div key={exp.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{exp.role}</h4>
                        <span className="text-slate-400 font-bold">@</span>
                        <span className="text-sm font-semibold text-blue-600">{exp.company}</span>
                        {exp.isCurrent && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                            Current Role
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {exp.startDate} - {exp.endDate} • {exp.location}
                      </p>
                      {exp.description && <p className="text-xs text-slate-700">{exp.description}</p>}
                      {exp.achievements && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {exp.achievements.split(',').map((ach: string, idx: number) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium">
                              ✓ {ach.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-2 shrink-0">
                      <button
                        onClick={() => openEditExperienceModal(exp)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                        title="Edit Entry"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BLOG ARTICLES */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Blog Articles Manager</h2>
                  <p className="text-xs text-slate-500">Publish tech articles, insights, tutorials, and manage blog posts</p>
                </div>
                <button
                  onClick={openNewBlogModal}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" /> Post New Article
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogsList.map((blog) => (
                  <div key={blog.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        {blog.coverImage ? (
                          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">No Cover Image</div>
                        )}
                        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                          blog.published !== false ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {blog.published !== false ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="space-y-1">
                          <h4 className="text-base font-bold text-slate-900 line-clamp-1">{blog.title}</h4>
                          <p className="text-[11px] text-blue-600 font-semibold">{blog.author || 'Md Adnan'} • {blog.readTime || '5 min read'}</p>
                          <p className="text-xs text-slate-600 line-clamp-2">{blog.summary}</p>
                        </div>

                        {blog.tags && (
                          <div className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded line-clamp-1">
                            {blog.tags}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                      <span className="text-[10px] text-slate-400">
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditBlogModal(blog)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                          title="Edit Article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteBlog(blog.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Testimonials Manager</h2>
                  <p className="text-xs text-slate-500">Manage client reviews, ratings, and recommendations</p>
                </div>
                <button
                  onClick={openNewTestimonialModal}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonialsList.map((t) => (
                  <div key={t.id} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {t.avatarUrl ? (
                          <img src={t.avatarUrl} alt={t.clientName} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-base">
                            {t.clientName?.charAt(0) || 'C'}
                          </div>
                        )}
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{t.clientName}</h4>
                          <p className="text-xs text-slate-500">{t.clientRole} {t.company ? `@ ${t.company}` : ''}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>

                      <p className="text-xs text-slate-700 italic">&ldquo;{t.quote}&rdquo;</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                      <button
                        onClick={() => openEditTestimonialModal(t)}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                        title="Edit Testimonial"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTestimonial(t.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Skills & Tech Stack</h2>
                  <p className="text-xs text-slate-500">Manage technical competencies, categories, and proficiency levels</p>
                </div>
                <button
                  onClick={openNewSkillModal}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Custom Skill
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skillsList.map((skill) => (
                  <div key={skill.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{skill.name}</h4>
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider mt-1">
                            {skill.category}
                          </span>
                        </div>
                        <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                          {skill.proficiency}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${Math.min(Math.max(skill.proficiency || 0, 0), 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Order: {skill.displayOrder || 0}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditSkillModal(skill)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                          title="Edit Skill"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSkill(skill.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="Delete Skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
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

      {/* FULL SKILL EDITOR MODAL */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSkillModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {editingSkillId ? 'Edit Skill' : 'Add Custom Skill'}
              </h3>
              <p className="text-xs text-slate-500">Configure skill name, category, proficiency level and display order</p>
            </div>

            <form onSubmit={saveSkillForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. Java & Spring Boot, React, PostgreSQL"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600 font-bold"
                >
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">Proficiency Level (%)</label>
                  <span className="text-xs font-black text-blue-600">{skillForm.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skillForm.proficiency}
                  onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) || 0 })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>0% Beginner</span>
                  <span>50% Intermediate</span>
                  <span>100% Expert</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Icon Type</label>
                  <select
                    value={skillForm.iconName}
                    onChange={(e) => setSkillForm({ ...skillForm, iconName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600"
                  >
                    <option value="Server">Server (Backend)</option>
                    <option value="Code2">Code2 (Frontend)</option>
                    <option value="Database">Database</option>
                    <option value="Layers">Layers (DevOps)</option>
                    <option value="Cpu">Cpu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={skillForm.displayOrder}
                    onChange={(e) => setSkillForm({ ...skillForm, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  {editingSkillId ? 'Update Skill' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOG EDITOR MODAL */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setBlogModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {editingBlogId ? 'Edit Article' : 'Post New Blog Article'}
              </h3>
              <p className="text-xs text-slate-500">Write, edit, upload cover image to Cloudinary, and publish tech articles</p>
            </div>

            <form onSubmit={saveBlogForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => {
                      const titleVal = e.target.value;
                      const slugVal = titleVal.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/(^-|-$)/g, '');
                      setBlogForm({ ...blogForm, title: titleVal, slug: editingBlogId ? blogForm.slug : slugVal });
                    }}
                    placeholder="e.g. Building Enterprise Scalable CMS with Spring Boot"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                    placeholder="building-enterprise-scalable-cms"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              {/* COVER IMAGE UPLOAD & URL */}
              <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700">Article Cover Image</label>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                    <Upload className="w-4 h-4" />
                    {uploadingBlogImage ? 'Uploading to Cloudinary...' : 'Upload Image File'}
                    <input type="file" accept="image/*" onChange={handleBlogImageUpload} className="hidden" />
                  </label>

                  <span className="text-xs text-slate-400 font-bold uppercase">or enter URL:</span>

                  <input
                    type="text"
                    value={blogForm.coverImage}
                    onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none"
                  />
                </div>

                {blogForm.coverImage && (
                  <div className="relative h-36 w-full rounded-xl overflow-hidden border border-slate-200 mt-2">
                    <img src={blogForm.coverImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    placeholder="5 min read"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={blogForm.tags}
                    onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                    placeholder="Java, Spring Boot, Architecture"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Article Summary (Short Excerpt)</label>
                <textarea
                  rows={2}
                  required
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  placeholder="A short overview of what this article covers..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Article Full Content (Markdown / Text)</label>
                <textarea
                  rows={8}
                  required
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Full text of the blog article..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedCheck"
                  checked={blogForm.published}
                  onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="publishedCheck" className="text-xs font-bold text-slate-800">
                  Publish Article Immediately (Visible on Public Portfolio)
                </label>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  {editingBlogId ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE EDITOR MODAL */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setServiceModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {editingServiceId ? 'Edit Service' : 'Add New Service'}
              </h3>
              <p className="text-xs text-slate-500">Specify service offerings and key highlights</p>
            </div>

            <form onSubmit={saveServiceForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  placeholder="e.g. Full-Stack Web Development"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Icon Type</label>
                  <select
                    value={serviceForm.iconName}
                    onChange={(e) => setServiceForm({ ...serviceForm, iconName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600"
                  >
                    <option value="Server">Server (Backend)</option>
                    <option value="Code2">Code2 (Frontend)</option>
                    <option value="Database">Database</option>
                    <option value="Layers">Layers (Architecture)</option>
                    <option value="Cpu">Cpu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={serviceForm.displayOrder}
                    onChange={(e) => setServiceForm({ ...serviceForm, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Description</label>
                <textarea
                  rows={3}
                  required
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Detailed breakdown of what this service entails..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Key Features (Comma Separated)</label>
                <input
                  type="text"
                  value={serviceForm.features}
                  onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                  placeholder="Spring Boot APIs, React Frontend, Supabase Database"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  {editingServiceId ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERIENCE EDITOR MODAL */}
      {experienceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setExperienceModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {editingExperienceId ? 'Edit Experience' : 'Add Experience Entry'}
              </h3>
              <p className="text-xs text-slate-500">Configure role title, company name, timeframe, and achievements</p>
            </div>

            <form onSubmit={saveExperienceForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={experienceForm.role}
                    onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={experienceForm.company}
                    onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                    placeholder="e.g. Tech Solutions Inc."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    required
                    value={experienceForm.startDate}
                    onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                    placeholder="Jan 2023"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="text"
                    disabled={experienceForm.isCurrent}
                    value={experienceForm.isCurrent ? 'Present' : experienceForm.endDate}
                    onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                    placeholder="Dec 2024"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={experienceForm.location}
                    onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                    placeholder="Remote / USA"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="currentRoleCheck"
                  checked={experienceForm.isCurrent}
                  onChange={(e) => setExperienceForm({ ...experienceForm, isCurrent: e.target.checked, endDate: e.target.checked ? 'Present' : experienceForm.endDate })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="currentRoleCheck" className="text-xs font-bold text-slate-800">
                  I currently work here
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Description</label>
                <textarea
                  rows={3}
                  value={experienceForm.description}
                  onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                  placeholder="Summary of responsibilities..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Key Achievements (Comma Separated)</label>
                <input
                  type="text"
                  value={experienceForm.achievements}
                  onChange={(e) => setExperienceForm({ ...experienceForm, achievements: e.target.value })}
                  placeholder="Architected microservices, Optimized PostgreSQL queries"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setExperienceModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  {editingExperienceId ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TESTIMONIAL EDITOR MODAL */}
      {testimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setTestimonialModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {editingTestimonialId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <p className="text-xs text-slate-500">Manage client endorsement, avatar picture, rating, and feedback quote</p>
            </div>

            <form onSubmit={saveTestimonialForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={testimonialForm.clientName}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                    placeholder="e.g. Sarah Connor"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={testimonialForm.company}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                    placeholder="e.g. Cyberdyne Tech"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client Role Title</label>
                  <input
                    type="text"
                    value={testimonialForm.clientRole}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, clientRole: e.target.value })}
                    placeholder="e.g. Product Lead"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) || 5 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none font-bold"
                  >
                    <option value={5}>5 Stars (★ ★ ★ ★ ★)</option>
                    <option value={4}>4 Stars (★ ★ ★ ★)</option>
                    <option value={3}>3 Stars (★ ★ ★)</option>
                    <option value={2}>2 Stars (★ ★)</option>
                    <option value={1}>1 Star (★)</option>
                  </select>
                </div>
              </div>

              {/* AVATAR UPLOAD */}
              <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700">Client Avatar Picture</label>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                    <Upload className="w-4 h-4" />
                    {uploadingAvatarImage ? 'Uploading...' : 'Upload Avatar'}
                    <input type="file" accept="image/*" onChange={handleAvatarImageUpload} className="hidden" />
                  </label>

                  <input
                    type="text"
                    value={testimonialForm.avatarUrl}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Testimonial Quote</label>
                <textarea
                  rows={4}
                  required
                  value={testimonialForm.quote}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                  placeholder="Feedback quote from the client..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setTestimonialModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  {editingTestimonialId ? 'Update Testimonial' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
