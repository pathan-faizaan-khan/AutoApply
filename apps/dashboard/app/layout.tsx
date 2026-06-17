import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import { CacheProvider } from "../components/providers/CacheProvider";
import { SidebarWithContent } from "../components/SidebarWithContent";
import { TopLoadingBar } from "../components/TopLoadingBar";

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
        <CacheProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <TopLoadingBar />
            <div className="h-full">
              <SidebarWithContent>
                {children}
              </SidebarWithContent>
            </div>
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
