'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar({ logoUrl }: { logoUrl: string | null | undefined }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Directly set the state based on scroll position
      setIsScrolled(window.scrollY > 10);
    };
    
    // Add the event listener when the component mounts
    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // The empty dependency array ensures this runs only once on mount

  return (
    <header 
      // The className is now consistently determined by the state
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
        isScrolled ? 'shadow-lg' : 'shadow-md'
      }`}
    >
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div>
          <Link href="/" className="text-xl font-bold text-gray-800 flex items-center gap-3">
            {logoUrl ? (
              <Image src={logoUrl} alt="Mentari Project Logo" width={100} height={100} />
            ) : (
              <span>Mentari Project</span>
            )}
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/packages" className="text-gray-600 hover:text-orange-500 transition-colors">Paket Layanan</Link>
          <Link href="/activities" className="text-gray-600 hover:text-orange-500 transition-colors">Aktivitas</Link>
          <Link href="/locations" className="text-gray-600 hover:text-orange-500 transition-colors">Lokasi</Link>
          <Link href="/gallery" className="text-gray-600 hover:text-orange-500 transition-colors">Galeri & Testimoni</Link>
          <Link href="/about" className="text-gray-600 hover:text-orange-500 transition-colors">Tentang Kami</Link>
          <Link href="/contact" className="bg-orange-500 text-white font-bold py-2 px-5 rounded-full hover:bg-orange-600 transition-transform hover:scale-105">
            Minta Penawaran
          </Link>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 text-3xl">
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link href="/packages" className="text-gray-600" onClick={() => setIsMenuOpen(false)}>Paket Layanan</Link>
            <Link href="/activities" className="text-gray-600" onClick={() => setIsMenuOpen(false)}>Aktivitas</Link>
            <Link href="/locations" className="text-gray-600" onClick={() => setIsMenuOpen(false)}>Lokasi</Link>
            <Link href="/gallery" className="text-gray-600" onClick={() => setIsMenuOpen(false)}>Galeri & Testimoni</Link>
            <Link href="/about" className="text-gray-600" onClick={() => setIsMenuOpen(false)}>Tentang Kami</Link>
            <Link href="/contact" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => setIsMenuOpen(false)}>
              Minta Penawaran
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}