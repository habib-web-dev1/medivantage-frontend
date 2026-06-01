import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import GlobalNavbar from "@/components/shared/GlobalNavbar";

export const metadata: Metadata = {
  title: "MediVantage - Advanced Diagnostic Portal",
  description: "AI-Driven Diagnostics, Human-Centered Care",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent dark mode FOUC — runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('medivantage:theme');
                  if (theme === 'dark' || theme === null) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="transition-colors duration-300">
        <Providers>
          <GlobalNavbar />
          <main className="min-h-screen pt-20">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
