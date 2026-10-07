'use client';

import React from 'react';
import { Code, Globe, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            AH
          </div>
          <div>
            <p className="font-extrabold text-white text-sm tracking-wider">ADNAN</p>
            <p className="text-[11px] text-slate-400">Java Spring Boot, PostgreSQL, Cloudinary & Next.js Architecture</p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-semibold">
          <a href="#about" className="hover:text-blue-400 transition-colors">
            About
          </a>
          <a href="#projects" className="hover:text-blue-400 transition-colors">
            Projects
          </a>
          <a href="#blog" className="hover:text-blue-400 transition-colors">
            Blog
          </a>
          <a href="#contact" className="hover:text-blue-400 transition-colors">
            Contact
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-blue-400">
            <Code className="w-4 h-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-blue-400">
            <Globe className="w-4 h-4" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-blue-400">
            <Share2 className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800 text-center text-slate-500">
        <p className="flex items-center justify-center gap-1">
          © 2026 Adnan. Full-Stack Architecture & Custom Headless Engine.
        </p>
      </div>
    </footer>
  );
}
