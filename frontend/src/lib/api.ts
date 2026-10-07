// API Client for Custom Java Spring Boot CMS Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cms-portfolio-0yaf.onrender.com/api';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cms_jwt_token');
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cms_jwt_token', token);
  }
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cms_jwt_token');
  }
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

// 1. Authentication APIs
export const authApi = {
  login: (username: string, password: string) =>
    apiFetch<{ token: string; username: string; email: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  getMe: () => apiFetch<{ username: string }>('/auth/me'),
};

// 2. About APIs
export const aboutApi = {
  get: () => apiFetch<any>('/about'),
  update: (data: any) =>
    apiFetch<any>('/about', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// 3. Skills APIs
export const skillsApi = {
  getAll: () => apiFetch<any[]>('/skills'),
  create: (data: any) =>
    apiFetch<any>('/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiFetch<any>(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiFetch<void>(`/skills/${id}`, {
      method: 'DELETE',
    }),
};

// 4. Projects APIs
export const projectsApi = {
  getAll: () => apiFetch<any[]>('/projects'),
  getById: (id: number) => apiFetch<any>(`/projects/${id}`),
  create: (data: any) =>
    apiFetch<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiFetch<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiFetch<void>(`/projects/${id}`, {
      method: 'DELETE',
    }),
};

// 5. Blogs APIs
export const blogsApi = {
  getAll: () => apiFetch<any[]>('/blogs'),
  getAdminAll: () => apiFetch<any[]>('/blogs/all'),
  getBySlug: (slug: string) => apiFetch<any>(`/blogs/${slug}`),
  create: (data: any) =>
    apiFetch<any>('/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiFetch<any>(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiFetch<void>(`/blogs/${id}`, {
      method: 'DELETE',
    }),
};

// 6. Experience APIs
export const experienceApi = {
  getAll: () => apiFetch<any[]>('/experience'),
  create: (data: any) =>
    apiFetch<any>('/experience', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiFetch<any>(`/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiFetch<void>(`/experience/${id}`, {
      method: 'DELETE',
    }),
};

// 7. Services APIs
export const servicesApi = {
  getAll: () => apiFetch<any[]>('/services'),
  create: (data: any) =>
    apiFetch<any>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiFetch<any>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiFetch<void>(`/services/${id}`, {
      method: 'DELETE',
    }),
};

// 8. Testimonials APIs
export const testimonialsApi = {
  getAll: () => apiFetch<any[]>('/testimonials'),
  create: (data: any) =>
    apiFetch<any>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiFetch<any>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiFetch<void>(`/testimonials/${id}`, {
      method: 'DELETE',
    }),
};

// 9. Media & Upload APIs
export const mediaApi = {
  getAll: () => apiFetch<any[]>('/media'),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch<any>('/upload/image', {
      method: 'POST',
      body: formData,
    });
  },
  delete: (id: number) =>
    apiFetch<void>(`/media/${id}`, {
      method: 'DELETE',
    }),
};

// 10. Contact APIs
export const contactApi = {
  send: (data: { name: string; email: string; subject: string; message: string }) =>
    apiFetch<{ message: string; id: number }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMessages: () => apiFetch<any[]>('/contact/messages'),
  markRead: (id: number) =>
    apiFetch<any>(`/contact/messages/${id}/read`, {
      method: 'PUT',
    }),
  deleteMessage: (id: number) =>
    apiFetch<void>(`/contact/messages/${id}`, {
      method: 'DELETE',
    }),
};
