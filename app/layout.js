import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FixMate — Smart Device & Home Appliance Repair Service",
  description:
    "FixMate connects customers with verified technicians for smartphone, laptop, AC, refrigerator, TV, washing machine and electrical repairs. Track every job step by step and pay only after the work is done.",
  keywords: ["repair service", "technician", "FixMate", "device repair", "home appliance"],
};


const themeInitScript = `
try {
  var saved = localStorage.getItem('fixmate-theme');
  var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'fixmate-dark' || (!saved && dark)) {
    document.documentElement.setAttribute('data-theme', 'fixmate-dark');
  }
} catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* App icon comes from the `app/icon.svg` file convention — Next.js
            injects its <link rel="icon"> tag automatically. */}
      </head>
      <body className="min-h-full flex flex-col font-sans bg-base-200 text-base-content"cz-shortcut-listen="true">
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
