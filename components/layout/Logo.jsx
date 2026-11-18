import Link from "next/link";


export default function Logo({ size = "md", withText = true }) {
  const box = size === "sm" ? "w-8 h-8 rounded-lg" : "w-10 h-10 rounded-xl";
  const icon = size === "sm" ? "w-4.5 h-4.5" : "w-5.5 h-5.5";
  const text = size === "sm" ? "text-lg" : "text-xl";

  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <span className={`${box} bg-primary text-primary-content grid place-items-center shadow-sm shadow-primary/30`}>
        <svg viewBox="0 0 24 24" fill="none" className={icon} aria-hidden="true">
          <path
            d="M14.7 6.3a4.2 4.2 0 0 0-5.9 5.16L3.6 16.66a1.9 1.9 0 1 0 2.68 2.69l5.2-5.2a4.2 4.2 0 0 0 5.16-5.9l-2.32 2.32-2.55-.64-.64-2.55L14.7 6.3Z"
            fill="currentColor"
          />
          <circle cx="6" cy="18" r="0.6" fill="#ffffff" opacity="0.6" />
        </svg>
      </span>
      {withText && (
        <span className={`${text} font-extrabold tracking-tight`}>
          Fix<span className="text-primary">Mate</span>
        </span>
      )}
    </Link>
  );
}
