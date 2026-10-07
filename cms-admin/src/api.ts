const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cms-portfolio-0yaf.onrender.com/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('cms_admin_jwt');
}

export function setAuthToken(token: string) {
  localStorage.setItem('cms_admin_jwt', token);
}

export function removeAuthToken() {
  localStorage.removeItem('cms_admin_jwt');
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.error || parsed.message || errorMessage;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const authApi = {
  login: (username: string, password: string) =>
    apiFetch<{ token: string; username: string; email: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  getMe: () => apiFetch<{ username: string }>('/auth/me'),
};

export const aboutApi = {
  get: () => apiFetch<any>('/about'),
  update: (data: any) =>
    apiFetch<any>('/about', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const skillsApi = {
  getAll: () => apiFetch<any[]>('/skills'),
  create: (data: any) => apiFetch<any>('/skills', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiFetch<any>(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch<void>(`/skills/${id}`, { method: 'DELETE' }),
};

export const servicesApi = {
  getAll: () => apiFetch<any[]>('/services'),
  create: (data: any) => apiFetch<any>('/services', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiFetch<any>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch<void>(`/services/${id}`, { method: 'DELETE' }),
};

export const projectsApi = {
  getAll: () => apiFetch<any[]>('/projects'),
  create: (data: any) => apiFetch<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiFetch<any>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch<void>(`/projects/${id}`, { method: 'DELETE' }),
};

export const blogsApi = {
  getAdminAll: () => apiFetch<any[]>('/blogs/all'),
  create: (data: any) => apiFetch<any>('/blogs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiFetch<any>(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch<void>(`/blogs/${id}`, { method: 'DELETE' }),
};

export const experienceApi = {
  getAll: () => apiFetch<any[]>('/experience'),
  create: (data: any) => apiFetch<any>('/experience', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiFetch<any>(`/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch<void>(`/experience/${id}`, { method: 'DELETE' }),
};

export const testimonialsApi = {
  getAll: () => apiFetch<any[]>('/testimonials'),
  create: (data: any) => apiFetch<any>('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiFetch<any>(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch<void>(`/testimonials/${id}`, { method: 'DELETE' }),
};

export const mediaApi = {
  getAll: () => apiFetch<any[]>('/media'),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch<any>('/upload/image', { method: 'POST', body: formData });
  },
  delete: (id: number) => apiFetch<void>(`/media/${id}`, { method: 'DELETE' }),
};

export const contactApi = {
  getMessages: () => apiFetch<any[]>('/contact/messages'),
  deleteMessage: (id: number) => apiFetch<void>(`/contact/messages/${id}`, { method: 'DELETE' }),
};
