import type { Metadata } from 'next';
import { Inter, Source_Serif_4, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AppLayout } from '@/components/layout/AppLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TERRA — Environmental Intelligence Platform',
  description:
    'Planet-scale precision farming and carbon credit verification using AlphaEarth embeddings and HWSD v2.0 soil data.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} ${ibmPlexMono.variable} h-full`}
    >
      <body className="h-full overflow-hidden bg-[var(--terra-paper)] text-[var(--terra-ink)] font-sans antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
