import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "Auto Apply AI — Dashboard",
  description: "AI Powered Job Application Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#060a14] text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="ml-64 flex-1 min-h-screen bg-[#060a14]">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}