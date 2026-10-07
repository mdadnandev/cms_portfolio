'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Layers, ExternalLink, Sparkles, X, Code } from 'lucide-react';
import { projectsApi } from '@/lib/api';

const defaultProjects = [
  {
    id: 1,
    title: 'Custom Enterprise Portfolio & Headless CMS',
    description:
      'Full-stack headless CMS engine built with Java Spring Boot, JWT Security, and PostgreSQL paired with a Next.js Executive Portfolio.',
    longDescription:
      'Full-stack architecture with Java 21 Spring Boot REST APIs, PostgreSQL database, Cloudinary media CDN, JWT authentication, and Next.js frontend.',
    category: 'Full-Stack & CMS',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    tags: 'Java, Spring Boot, React, Next.js, PostgreSQL, Tailwind',
    featured: true,
  },
  {
    id: 2,
    title: 'FinTech Wealth Analytics Dashboard',
    description:
      'Real-time cryptocurrency and stocks analytical platform with interactive charting and automated ledger feeds.',
    longDescription:
      'High-throughput analytics platform with real-time WebSockets streams, responsive glassmorphic cards, and custom data processing.',
    category: 'Web App',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    tags: 'React, Tailwind, Node.js, WebSockets, Chart.js',
    featured: true,
  },
  {
    id: 3,
    title: 'Cloudinary-Powered Asset Engine',
    description:
      'Automated asset optimization microservice for fast media streaming, transformations, and global CDN distribution.',
    longDescription:
      'Media management microservice that hooks directly into Cloudinary REST APIs for on-the-fly transformations and metadata indexing.',
    category: 'Cloud & API',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    tags: 'Spring Boot, Cloudinary API, Docker, PostgreSQL',
    featured: false,
  },
];

const getValidProjectImage = (url?: string) => {
  if (!url || url.startsWith('/project') || url.startsWith('/blog') || url.startsWith('/avatar')) {
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop';
  }
  return url;
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<any>(null);

  useEffect(() => {
    projectsApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) setProjects(data);
        else setProjects(defaultProjects);
      })
      .catch((_) => setProjects(defaultProjects));
  }, []);

  const filters = ['All', 'Full-Stack & CMS', 'Web App', 'Cloud & API'];

  const filteredProjects =
    selectedFilter === 'All'
      ? projects
      : projects.filter((p) => p.category?.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <section id="projects" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-blue-600" /> Showcase Portfolio
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Featured Works & <span className="blue-text-gradient">Projects</span>
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                selectedFilter === filter
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const tagList = project.tags ? project.tags.split(',') : [];
            const img = getValidProjectImage(project.imageUrl);
            return (
              <div
                key={project.id}
                className="white-card rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={img}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {project.featured && (
                    <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md">
                      Featured
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-blue-700 text-xs font-bold px-3 py-1 rounded-lg border border-blue-200 shadow-sm">
                    {project.category}
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex flex-wrap gap-1.5">
                      {tagList.map((tag: string, i: number) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-200">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => setActiveModalProject(project)}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View Details <Sparkles className="w-3 h-3" />
                      </button>
                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-blue-600 border border-slate-200 transition-all"
                          >
                            <Code className="w-4 h-4" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {activeModalProject.category}
              </span>
              <h3 className="text-2xl font-black text-slate-900">{activeModalProject.title}</h3>
            </div>

            <div className="relative h-64 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={getValidProjectImage(activeModalProject.imageUrl)}
                alt={activeModalProject.title}
                fill
                className="object-cover"
              />
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {activeModalProject.longDescription || activeModalProject.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex flex-wrap gap-1.5">
                {activeModalProject.tags?.split(',').map((t: string, idx: number) => (
                  <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200 font-semibold">
                    {t.trim()}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                {activeModalProject.demoUrl && (
                  <a
                    href={activeModalProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  >
                    Live Demo <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
