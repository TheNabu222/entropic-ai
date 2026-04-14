import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  title: 'Neocities Site Manager | coaiexist.wtf',
  description: 'Comprehensive site management dashboard for coaiexist.wtf on Neocities',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Neocities Site Manager',
    description: 'Manage your Neocities site with style',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&family=Orbitron:wght@400;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1f3a',
              color: '#e0e6ff',
              border: '1px solid #667eea',
            },
          }}
        />
      </body>
    </html>
  );
}
