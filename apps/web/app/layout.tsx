import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { AuthProvider } from '../components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'Auto Apply AI - Smart Job Application Assistant',
  description: 'Apply to jobs faster with intelligent automation, AI resume optimization, ATS checking, and smart job matching.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
