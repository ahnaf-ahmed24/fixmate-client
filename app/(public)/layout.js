import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function NavbarFallback() {
  return (
    <div className="sticky top-0 z-50 h-16 bg-base-100 border-b border-base-300/70">
      <div className="container-page h-full flex items-center justify-between opacity-60">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-base-300 animate-pulse" />
          <div className="w-20 h-4 rounded bg-base-300 animate-pulse" />
        </div>
        <div className="hidden lg:flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-16 h-8 rounded-lg bg-base-300 animate-pulse" />
          ))}
        </div>
        <div className="w-9 h-9 rounded-full bg-base-300 animate-pulse" />
      </div>
    </div>
  );
}

/** Public pages share the navbar + footer shell. */
export default function PublicLayout({ children }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
