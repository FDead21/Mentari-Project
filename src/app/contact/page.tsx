'use client';

import { useRef, useEffect, useState } from 'react';
import { submitContactForm } from './actions';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient'; // Import the client-side supabase

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [contactInfo, setContactInfo] = useState({ address: '', email: '', phone: '' });

  // Fetch contact info on the client
  useEffect(() => {
    const fetchContactInfo = async () => {
      const { data } = await supabase.from('site_content').select('*').in('content_key', ['contact_address', 'contact_email', 'contact_phone']);
      const infoMap = new Map(data?.map(s => [s.content_key, s.content_value]));
      setContactInfo({
        address: infoMap.get('contact_address') || '',
        email: infoMap.get('contact_email') || '',
        phone: infoMap.get('contact_phone') || '',
      });
    };
    fetchContactInfo();
  }, []);

  const handleFormSubmit = async (formData: FormData) => {
    const result = await submitContactForm(formData);
    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Get In Touch</h1>
        <p className="text-lg text-gray-600 mt-2">We&apos;d love to hear from you. Please fill out the form below.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <form ref={formRef} action={handleFormSubmit} className="space-y-6">
                        <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" name="name" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" id="phone" name="phone" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" name="message" rows={5} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"></textarea>
            </div>
            <div>
              <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 transition-colors">
                Send Message
              </button>
            </div>
          </form>
        </div>
        <div className="space-y-8">
          {/* Office Info */}
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Our Office</h3>
              <p className="text-gray-600">{contactInfo.address}</p>
            </div>
          </div>
          {/* Email Info */}
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
           </div>
            <div>
              <h3 className="text-xl font-semibold">Email Us</h3>
              <p className="text-gray-600">{contactInfo.email}</p>
            </div>
          </div>
          {/* Call Info */}
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
           </div>
            <div>
              <h3 className="text-xl font-semibold">Call Us</h3>
              <p className="text-gray-600">{contactInfo.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}