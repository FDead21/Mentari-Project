// components/Footer.tsx

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold">Mentari Project</p>
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/packages" className="hover:text-orange-400">Packages</Link>
            <Link href="/locations" className="hover:text-orange-400">Locations</Link>
            <Link href="/contact" className="hover:text-orange-400">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}