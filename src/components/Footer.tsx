import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">NB</span>
            </div>
            <span className="font-semibold text-gray-900">NextBlog</span>
          </div>

          <p className="text-gray-500 text-sm">
            © {currentYear} NextBlog. Built with Next.js 14, TypeORM &amp; Tailwind CSS.
          </p>

          <nav className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
