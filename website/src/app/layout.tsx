import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'React Native KLine Chart',
  description: 'A high-performance candlestick chart component for React Native, powered by Skia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
