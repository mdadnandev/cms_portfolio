'use client';

import React, { useEffect, useState } from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import { testimonialsApi } from '@/lib/api';

const defaultTestimonials = [
  {
    id: 1,
    clientName: 'Elena Rostova',
    clientRole: 'VP of Product',
    company: 'Vanguard Digital',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
    quote:
      'Adnan delivered our custom CMS platform ahead of schedule with flawless architecture. His technical precision is unmatched.',
    rating: 5,
  },
  {
    id: 2,
    clientName: 'Marcus Vance',
    clientRole: 'CTO',
    company: 'Aether Labs',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
    quote:
      'The Spring Boot REST performance paired with the modern React UI exceeded all our expectations.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    testimonialsApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) setTestimonials(data);
        else setTestimonials(defaultTestimonials);
      })
      .catch((_) => setTestimonials(defaultTestimonials));
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5 text-blue-600" /> Executive Endorsements
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Client <span className="blue-text-gradient">Testimonials</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="white-card p-8 rounded-2xl space-y-6 relative">
              <div className="flex items-center gap-1 text-blue-600">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-blue-600" />
                ))}
              </div>

              <p className="text-slate-700 text-base italic leading-relaxed">&ldquo;{item.quote}&rdquo;</p>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-blue-300 relative shadow-sm">
                  <img src={item.avatarUrl} alt={item.clientName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.clientName}</h4>
                  <p className="text-xs text-blue-600 font-bold">
                    {item.clientRole} @ {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
