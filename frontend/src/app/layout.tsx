import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DispatchVoice AI — Mission Control Dispatch Console',
  description: 'Ultra-low-latency (<400ms) Voice AI Dispatcher for Field Trades & Emergency Contractors',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B0F17] text-[#F8FAFC] antialiased selection:bg-[#F97316] selection:text-white">
        {children}
      </body>
    </html>
  );
}
