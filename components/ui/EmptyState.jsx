import Link from "next/link";


export default function EmptyState({
  title = "Nothing here yet",
  description,
  icon: Icon,
  actionLabel,
  actionHref,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-14 px-6 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-base-300/70 grid place-items-center text-base-content/50 mb-4">
        {Icon ? <Icon className="w-8 h-8" /> : <span className="text-2xl">🔍</span>}
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
      {description && <p className="text-sm text-base-content/60 mt-1 max-w-sm">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn-primary btn-sm rounded-lg mt-5">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
