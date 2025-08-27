'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ href, title }: { href: string, title: string }) {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push(href)}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-8 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5"/>
        <path d="m12 19-7-7 7-7"/>
      </svg>
      <span>Back to {title}</span>
    </button>
  );
}