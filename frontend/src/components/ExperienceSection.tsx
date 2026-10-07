'use client';

import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { experienceApi } from '@/lib/api';

const defaultExperiences = [
  {
    id: 1,
    role: 'Principal Software Architect',
    company: 'Apex Tech Solutions',
    location: 'San Francisco, CA',
    startDate: '2023',
    endDate: 'Present',
    isCurrent: true,
    description:
      'Architecting Java Spring Boot backends and modern React micro-frontends serving over 1M active users.',
    achievements: 'Engineered modular CMS backend reducing content delivery latency by 45%.',
  },
  {
    id: 2,
    role: 'Senior Full-Stack Engineer',
    company: 'Nexus Global Innovations',
    location: 'Remote',
    startDate: '2021',
    endDate: '2023',
    isCurrent: false,
    description:
      'Designed distributed REST services and PostgreSQL schemas for enterprise SaaS products.',
    achievements: 'Led team of 6 engineers; delivered zero-downtime DB migrations.',
  },
];

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    experienceApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) setExperiences(data);
        else setExperiences(defaultExperiences);
      })
      .catch((_) => setExperiences(defaultExperiences));
  }, []);

  return (
    <section id="experience" className="py-20 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Career Journey
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Work Experience & <span className="blue-text-gradient">Timeline</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative before:absolute before:inset-0 before:left-8 md:before:left-1/2 before:-ml-px before:w-0.5 before:bg-gradient-to-b before:from-blue-600 before:via-blue-300 before:to-transparent">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-12 last:mb-0"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 border-4 border-white text-white shadow-md shadow-blue-500/30 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 left-3 md:left-auto absolute md:relative z-10">
                <Briefcase className="w-4 h-4" />
              </div>

              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] white-card p-6 sm:p-8 rounded-2xl space-y-4 ml-14 md:ml-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.startDate} - {exp.endDate}
                  </span>
                  <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {exp.location}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">{exp.role}</h3>
                  <h4 className="text-sm font-bold text-blue-600">{exp.company}</h4>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>

                {exp.achievements && (
                  <div className="pt-3 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{exp.achievements}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
