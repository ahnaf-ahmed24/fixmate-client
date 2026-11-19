import Link from "next/link";


export default function StatsCard({ icon: Icon, label, value, hint, href, tone = "primary" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    info: "bg-info/10 text-info",
    error: "bg-error/10 text-error",
    accent: "bg-accent/15 text-neutral dark:text-accent",
  };

  const body = (
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="card-body p-5 flex-row items-center gap-4">
        <span className={`w-12 h-12 rounded-xl grid place-items-center shrink-0 ${tones[tone] || tones.primary}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">{label}</p>
          <p className="text-2xl font-extrabold leading-tight mt-0.5">{value}</p>
          {hint && <p className="text-xs text-base-content/50 mt-0.5 truncate">{hint}</p>}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:opacity-90 transition-opacity">
        {body}
      </Link>
    );
  }
  return body;
}
