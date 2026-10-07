'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Sparkles, Download, ArrowRight, Code, Database, Server, Cpu } from 'lucide-react';
import { aboutApi } from '@/lib/api';

export default function Hero() {
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    aboutApi
      .get()
      .then((data) => setAboutData(data))
      .catch((err) => console.log('Using default about info in hero:', err));
  }, []);

  const fullName = aboutData?.fullName || 'Adnan';
  const subtitle =
    aboutData?.subtitle ||
    'Building enterprise Java Spring Boot backends & ultra-performant React/Next.js dynamic web architectures with custom CMS engines.';
  const expYears = aboutData?.experienceYears || 6;
  const completedProjects = aboutData?.completedProjects || 42;
  const happyClients = aboutData?.happyClients || 28;
  const avatarUrl = aboutData?.avatarUrl && aboutData.avatarUrl.startsWith('http') ? aboutData.avatarUrl : '/hero-portrait.jpeg';

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/30 to-white">
      {/* Subtle Royal Blue Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Bio & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Full-Stack Architecture & Custom CMS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Architecting High Performance <br className="hidden sm:inline" />
              <span className="blue-text-gradient">Web Systems & Custom APIs</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              Hi, I&apos;m <span className="text-blue-600 font-bold">{fullName}</span>. {subtitle}
            </p>

            {/* Quick Tech Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                <Server className="w-3.5 h-3.5 text-blue-600" /> Java Spring Boot 3.x
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                <Code className="w-3.5 h-3.5 text-blue-600" /> React & Next.js
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                <Database className="w-3.5 h-3.5 text-blue-600" /> PostgreSQL & Supabase
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                <Cpu className="w-3.5 h-3.5 text-blue-600" /> Custom CMS Engine
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:scale-[1.02] transition-all"
              >
                View Selected Works
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={aboutData?.resumeUrl || '/resume.pdf'}
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 font-bold text-sm border border-slate-300 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200 max-w-xl mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-black text-blue-600">{expYears}+</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Years Experience</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-black text-blue-600">{completedProjects}+</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Projects Completed</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-black text-blue-600">{happyClients}+</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Satisfied Clients</div>
              </div>
            </div>
          </div>

          {/* Right Column: Portrait with Royal Blue Halo */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] lg:w-[420px] lg:h-[420px] flex items-center justify-center">
              {/* Outer Blue Halo Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/60 shadow-[0_0_50px_rgba(37,99,235,0.35)] animate-pulse"></div>
              <div className="absolute inset-4 rounded-full border border-blue-400/40 shadow-[inset_0_0_30px_rgba(37,99,235,0.2)]"></div>

              {/* Portrait Container */}
              <div className="relative w-[88%] h-[88%] rounded-full overflow-hidden border-4 border-blue-600 shadow-2xl shadow-blue-500/30">
                <Image
                  src={avatarUrl}
                  alt={fullName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-cover object-top hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Status Badge */}
              <div className="absolute -bottom-2 -left-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-xs font-bold text-slate-800">REST API Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
