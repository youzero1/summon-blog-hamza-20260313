import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | NextBlog',
    default: 'NextBlog - Modern Blogging Platform',
  },
  description: 'A modern blog built with Next.js 14, TypeORM, and Tailwind CSS',
  keywords: ['blog', 'nextjs', 'typescript', 'react'],
  authors: [{ name: 'NextBlog Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'NextBlog',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
