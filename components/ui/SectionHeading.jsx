
export default function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignCls} mb-10`}>
      {eyebrow && (
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-balance">{title}</h2>
      {subtitle && <p className="mt-3 text-base-content/65 leading-relaxed">{subtitle}</p>}
    </div>
  );
}
