'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { BookOpen, Clock, Tag, ArrowUpRight } from 'lucide-react';
import { blogsApi } from '@/lib/api';

const defaultBlogs = [
  {
    id: 1,
    title: 'Building a Custom Headless CMS from Scratch with Java Spring Boot',
    slug: 'building-custom-cms-spring-boot',
    summary:
      'Learn how to build a lightweight, ultra-secure CMS backend without relying on third-party SaaS dependencies.',
    content:
      'In this deep dive, we explore how to construct a robust Java 21 Spring Boot REST API backed by PostgreSQL, JWT authentication, and Cloudinary image uploads.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop',
    author: 'Adnan',
    readTime: '6 min read',
    tags: 'Java, Spring Boot, CMS, Backend',
  },
  {
    id: 2,
    title: 'Designing Clean White & Blue Enterprise Portfolios with Tailwind CSS',
    slug: 'clean-white-blue-portfolio-design',
    summary:
      'Mastering high-trust enterprise portfolio aesthetics with vibrant royal cobalt blue accents.',
    content:
      'Visual clarity and high contrast typography are essential for corporate software architects. Here is how we implemented blue halo lighting and sleek white card elevation.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
    author: 'Adnan',
    readTime: '4 min read',
    tags: 'React, Tailwind CSS, Design',
  },
];

export default function BlogSection() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedBlogModal, setSelectedBlogModal] = useState<any>(null);

  useEffect(() => {
    blogsApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) setBlogs(data);
        else setBlogs(defaultBlogs);
      })
      .catch((_) => setBlogs(defaultBlogs));
  }, []);

  return (
    <section id="blog" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Engineering Publications
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Latest Technical <span className="blue-text-gradient">Articles</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="white-card rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer"
              onClick={() => setSelectedBlogModal(blog)}
            >
              <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={blog.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop'}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md border border-slate-200 text-blue-700 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3.5 h-3.5" />
                  {blog.readTime}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">{blog.summary}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                    {blog.tags}
                  </span>
                  <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Modal */}
      {selectedBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedBlogModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-full"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Published by {selectedBlogModal.author} • {selectedBlogModal.readTime}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{selectedBlogModal.title}</h3>
            </div>

            <div className="relative h-64 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={selectedBlogModal.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop'}
                alt={selectedBlogModal.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-4">
              <p className="text-base font-bold text-blue-900">{selectedBlogModal.summary}</p>
              <p>{selectedBlogModal.content}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
