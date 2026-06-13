import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import { SidebarWithContent } from "../components/SidebarWithContent";

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
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="bg-background text-foreground antialiased h-full overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="h-full">
            <SidebarWithContent>
              {children}
            </SidebarWithContent>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
