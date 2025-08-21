import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          {/* You can place your logo here */}
          <Link href="/" className="text-xl font-bold text-gray-800">
            Sun Adventure
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/packages" className="text-gray-600 hover:text-blue-500">Paket Layanan</Link>
          <Link href="/locations" className="text-gray-600 hover:text-blue-500">Lokasi</Link>
          <Link href="/gallery" className="text-gray-600 hover:text-blue-500">Galeri & Testimoni</Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-500">Tentang Kami</Link>
          <Link href="/contact" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full hover:bg-orange-600">
            Minta Penawaran
          </Link>
        </div>
      </nav>
    </header>
  );
}