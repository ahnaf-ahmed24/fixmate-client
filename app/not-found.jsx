import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";

export const metadata = { title: "404 — Page not found" };


function NotFoundArt() {
  return (
    <svg viewBox="0 0 420 240" fill="none" className="w-72 md:w-96 mx-auto" role="img" aria-label="A confused repair robot with a broken link">
      {/* backdrop blobs */}
      <circle cx="210" cy="120" r="105" fill="var(--color-primary)" opacity="0.08" />
      <circle cx="210" cy="120" r="75" fill="var(--color-secondary)" opacity="0.08" />

    
      <rect x="140" y="60" width="140" height="110" rx="26" fill="var(--color-primary)" />
      <rect x="140" y="60" width="140" height="110" rx="26" fill="black" opacity="0.06" />
    
      <rect x="156" y="78" width="108" height="66" rx="16" fill="var(--color-neutral)" opacity="0.9" />
    
      <circle cx="186" cy="106" r="9" fill="var(--color-accent)" />
      <circle cx="234" cy="106" r="9" fill="var(--color-accent)" />
     
      <path d="M198 128 Q 210 122 222 128" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" />
    
      <line x1="210" y1="60" x2="210" y2="40" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="210" cy="34" r="7" fill="var(--color-accent)" />

     
      <g stroke="var(--color-base-content)" strokeWidth="7" strokeLinecap="round" opacity="0.85">
        <path d="M140 130 C 110 138 96 150 88 164" />
      </g>
    
      <g stroke="var(--color-base-content)" strokeWidth="7" strokeLinecap="round" opacity="0.85">
        <path d="M280 130 C 310 138 322 148 330 160" />
      </g>
      <g transform="translate(318 140) rotate(35)">
        <rect x="-4" y="0" width="8" height="34" rx="4" fill="var(--color-accent)" />
        <path d="M-10 0 a10 10 0 0 1 20 0 v4 h-20 z" fill="var(--color-accent)" />
      </g>

     
      <g transform="translate(60 168) rotate(-18)">
        <rect x="0" y="0" width="46" height="20" rx="10" stroke="var(--color-base-content)" strokeWidth="5" opacity="0.8" fill="none" />
        <rect x="56" y="0" width="46" height="20" rx="10" stroke="var(--color-base-content)" strokeWidth="5" opacity="0.35" fill="none" />
        <path d="M46 10 l10 -0" stroke="var(--color-error)" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 5" />
      </g>

      <text x="96" y="64" fontSize="34" fontWeight="800" fill="var(--color-accent)" opacity="0.85">?</text>
      <text x="312" y="84" fontSize="26" fontWeight="800" fill="var(--color-primary)" opacity="0.7">?</text>

    
      <ellipse cx="210" cy="196" rx="120" ry="10" fill="var(--color-base-content)" opacity="0.08" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-[70dvh] grid place-items-center px-4 py-16">
      <div className="text-center max-w-lg">
        <NotFoundArt />
        <p className="mt-8 text-7xl font-extrabold tracking-tight text-primary">404</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">This page went missing</h1>
        <p className="mt-3 text-base-content/60 leading-relaxed">
          Even our best technician couldn&apos;t find it. The page may have been moved, renamed,
          or never existed in the first place.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary rounded-lg px-6 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/services" className="btn btn-outline rounded-lg px-6 font-semibold">
            <Wrench className="w-4 h-4" /> Browse services
          </Link>
        </div>
      </div>
    </div>
  );
}
