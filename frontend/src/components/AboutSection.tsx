'use client';

import React, { useEffect, useState } from 'react';
import { User, MapPin, Mail, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { aboutApi } from '@/lib/api';

export default function AboutSection() {
  const [about, setAbout] = useState<any>(null);

  useEffect(() => {
    aboutApi
      .get()
      .then((data) => setAbout(data))
      .catch((err) => console.log('About fetch fallback:', err));
  }, []);

  const bio =
    about?.bio ||
    'Passionate software engineer with over 6 years of expertise crafting scalable microservices, custom headless CMS platforms, and high-performance frontend interfaces. Specialist in Spring Boot, PostgreSQL, Next.js, and Cloud Infrastructure.';

  return (
    <section id="about" className="py-20 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <User className="w-3.5 h-3.5" /> About The Architect
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Engineered for Performance, <span className="blue-text-gradient">Built from Scratch</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Card 1: Main Story */}
          <div className="lg:col-span-7 white-card p-8 rounded-2xl space-y-6">
            <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              Full-Stack Architecture & Custom Backends
            </h3>
            <p className="text-slate-600 leading-relaxed text-base">{bio}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Spring Boot REST API</h4>
                  <p className="text-xs text-slate-500">JWT Authentication & BCrypt Security.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Supabase PostgreSQL</h4>
                  <p className="text-xs text-slate-500">Production relational database with pooling.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Cloudinary Media CDN</h4>
                  <p className="text-xs text-slate-500">Fast CDN image transformations & uploads.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Next.js 14 Web UI</h4>
                  <p className="text-xs text-slate-500">Dynamic REST data fetching & reactive state.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Contact Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="white-card p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Location</span>
                <p className="text-base font-bold text-slate-900">{about?.location || 'San Francisco, CA / Remote'}</p>
              </div>
            </div>

            <div className="white-card p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Primary Email</span>
                <p className="text-base font-bold text-slate-900">{about?.primaryEmail || 'adnan.developer@example.com'}</p>
              </div>
            </div>

            <div className="white-card p-6 rounded-2xl border-blue-300 bg-blue-50/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shrink-0 shadow-md shadow-blue-500/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-blue-700 font-bold uppercase tracking-wider">Separate Standalone CMS Admin</span>
                <p className="text-sm font-bold text-slate-900">Custom Built Control Panel Engine</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
