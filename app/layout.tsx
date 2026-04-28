import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
