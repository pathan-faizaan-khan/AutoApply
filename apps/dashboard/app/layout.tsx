import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Auto Apply AI",
  description: "AI Powered Job Application Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}