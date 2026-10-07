'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, Code2, Database, Sparkles, Check } from 'lucide-react';
import { servicesApi } from '@/lib/api';

const defaultServices = [
  {
    id: 1,
    title: 'Custom CMS & Engine Development',
    description:
      'Custom-built headless CMS backends tailored with granular access control, high throughput, and zero vendor lock-in.',
    iconName: 'Cpu',
    features: 'Custom Schemas, REST/GraphQL APIs, Admin Controls, High Speed',
  },
  {
    id: 2,
    title: 'Full-Stack Web Development',
    description:
      'End-to-end web apps crafted with Next.js, React, and Java Spring Boot for unmatched speed and security.',
    iconName: 'Code2',
    features: 'SEO Optimization, Glassmorphic UI, Mobile-first Responsive, Micro-interactions',
  },
  {
    id: 3,
    title: 'Database Engineering & Cloud Infrastructure',
    description:
      'Architecting high-availability PostgreSQL/Supabase databases with automated migrations and Cloudinary CDN storage.',
    iconName: 'Database',
    features: 'Relational Modeling, Indexing, Cloud Integration, Zero Downtime',
  },
];

export default function ServicesSection() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    servicesApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) setServices(data);
        else setServices(defaultServices);
      })
      .catch((_) => setServices(defaultServices));
  }, []);

  return (
    <section id="services" className="py-20 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> What I Offer
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Services & <span className="blue-text-gradient">Solutions</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const featureList = service.features ? service.features.split(',') : [];
            return (
              <div
                key={service.id}
                className="white-card p-8 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group"
              >
                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                    {service.iconName === 'Database' ? (
                      <Database className="w-7 h-7" />
                    ) : service.iconName === 'Code2' ? (
                      <Code2 className="w-7 h-7" />
                    ) : (
                      <Cpu className="w-7 h-7" />
                    )}
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2 relative z-10">
                  {featureList.map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{feat.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
