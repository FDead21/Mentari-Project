'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md relative z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <Link href="/" className="text-xl font-bold text-gray-800">
            Mentari Project
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/packages" className="text-gray-600 hover:text-blue-500">Paket Layanan</Link>
          <Link href="/activities" className="text-gray-600 hover:text-blue-500">Aktivitas</Link> {/* New Link */}
          <Link href="/locations" className="text-gray-600 hover:text-blue-500">Lokasi</Link>
          <Link href="/gallery" className="text-gray-600 hover:text-blue-500">Galeri & Testimoni</Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-500">Tentang Kami</Link>
          <Link href="/contact" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full hover:bg-orange-600">
            Minta Penawaran
          </Link>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 text-2xl">
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link href="/packages" className="text-gray-600" onClick={() => setIsMenuOpen(false)}>Paket Layanan</Link>
            <Link href="/activities" className="text-gray-600" onClick={() => setIsMenuOpen(false)}>Aktivitas</Link> {/* New Link */}
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