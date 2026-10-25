import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/newsreader';
import '@tactile-ui/react/styles.css';
import './globals.css';
export const metadata: Metadata = {
  title: 'Tactile UI — Foundations',
  description:
    'Shared design decisions. Platform-native interfaces. The Phase 1 foundation for Tactile UI.',
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
