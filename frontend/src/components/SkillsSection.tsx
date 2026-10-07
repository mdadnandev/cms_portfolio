'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, Code2, Server, Database, Layers } from 'lucide-react';
import { skillsApi } from '@/lib/api';

const defaultSkills = [
  { id: 1, name: 'Java & Spring Boot 3.x', category: 'Backend', proficiency: 96 },
  { id: 2, name: 'React & Next.js App Router', category: 'Frontend', proficiency: 94 },
  { id: 3, name: 'PostgreSQL & Supabase SQL', category: 'Database', proficiency: 90 },
  { id: 4, name: 'Tailwind CSS Modern Systems', category: 'Frontend', proficiency: 95 },
  { id: 5, name: 'REST APIs & JWT Security', category: 'Backend', proficiency: 98 },
  { id: 6, name: 'Cloudinary Media API & CDN', category: 'DevOps', proficiency: 88 },
];

export default function SkillsSection() {
  const [skills, setSkills] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    skillsApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) setSkills(data);
        else setSkills(defaultSkills);
      })
      .catch((_) => setSkills(defaultSkills));
  }, []);

  const categories = ['All', 'Backend', 'Frontend', 'Database', 'DevOps'];

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="skills" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" /> Technical Competencies
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Skills & <span className="blue-text-gradient">Tech Stack</span>
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSkills.map((skill) => (
            <div key={skill.id} className="white-card p-6 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    {skill.category === 'Backend' ? (
                      <Server className="w-4 h-4" />
                    ) : skill.category === 'Database' ? (
                      <Database className="w-4 h-4" />
                    ) : skill.category === 'Frontend' ? (
                      <Code2 className="w-4 h-4" />
                    ) : (
                      <Layers className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{skill.name}</h3>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      {skill.category}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-blue-600">{skill.proficiency}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-gradient-to-r from-blue-600 to-sky-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${skill.proficiency}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
