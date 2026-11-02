import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const display = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['SOFT', 'opsz'],
});

const body = Instrument_Sans({
  variable: '--font-body',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HomeParadise — Bring Nature Home',
  description:
    'Hand-picked flowers, living plants, and artisan soaps — thoughtfully crafted to turn every room into a moment of calm.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
