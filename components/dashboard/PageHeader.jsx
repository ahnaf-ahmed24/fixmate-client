
export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-base-content/60 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
