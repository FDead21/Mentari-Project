'use client';

import { useState, useEffect } from 'react';

type Testimonial = {
  id: string;
  quote: string;
  client_name: string;
  company_name: string | null;
  client_image_url: string | null;
};

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const activeTestimonial = testimonials[currentIndex];

  return (
    <div className="relative h-64">
      {testimonials.map((testimonial, index) => (
        <div
          key={testimonial.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <blockquote className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center h-full">
            {testimonial.client_image_url && (
              <img src={testimonial.client_image_url} alt={testimonial.client_name} className="w-20 h-20 rounded-full object-cover -mt-12 border-4 border-white" />
            )}
            <p className="text-md italic mt-4 flex-grow">&quot;{testimonial.quote}&quot;</p>
            <cite className="block font-semibold mt-4">
              {testimonial.client_name}
              {testimonial.company_name && <span className="block text-sm text-gray-500 font-normal">{testimonial.company_name}</span>}
            </cite>
          </blockquote>
        </div>
      ))}
    </div>
  );
}