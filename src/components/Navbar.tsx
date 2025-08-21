// components/Navbar.tsx

'use client'; // 1. This is crucial. It turns the component into a Client Component.

import { useState } from 'react'; // 2. Import useState to manage the open/close state.
import Link from 'next/link';

export default function Navbar() {
  // 3. Set up the state. 'isMenuOpen' will be true or false.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md relative z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <Link href="/" className="text-xl font-bold text-gray-800">
            Mentari Project
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/packages" className="text-gray-600 hover:text-blue-500">Paket Layanan</Link>
          <Link href="/locations" className="text-gray-600 hover:text-blue-500">Lokasi</Link>
          <Link href="/gallery" className="text-gray-600 hover:text-blue-500">Galeri & Testimoni</Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-500">Tentang Kami</Link>
          <Link href="/contact" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full hover:bg-orange-600">
            Minta Penawaran
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          {/* 4. When this button is clicked, it toggles the isMenuOpen state. */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 text-2xl">
            {isMenuOpen ? '✕' : '☰'} {/* Show a close icon '✕' if the menu is open */}
          </button>
        </div>
      </nav>

      {/* 5. The Mobile Menu itself. This div only appears if isMenuOpen is true. */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link href="/packages" className="text-gray-600" onClick={() => setIsMenuOpen(false)}>Paket Layanan</Link>
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