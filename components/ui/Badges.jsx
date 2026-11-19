import { PAYMENT_STYLES, STATUS_LABELS, STATUS_STYLES } from "@/lib/constants";


export function StatusBadge({ status, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        STATUS_STYLES[status] || "bg-base-300 text-base-content/70 border border-base-300"
      } ${className}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function PaymentBadge({ status, className = "" }) {
  const paid = status === "paid";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        PAYMENT_STYLES[status] || "bg-slate-500/10 text-slate-500 border border-slate-500/25"
      } ${className}`}
    >
      {paid ? "Paid" : "Unpaid"}
    </span>
  );
}

export function ApprovalBadge({ status, className = "" }) {
  const map = {
    approved: "bg-success/10 text-success border border-success/25",

    pending: "bg-accent text-accent-content border border-accent",
    rejected: "bg-error/10 text-error border border-error/25",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
        map[status] || ""
      } ${className}`}
    >
      {status}
    </span>
  );
}

export function RoleBadge({ role, className = "" }) {
  const map = {
    customer: "bg-secondary/10 text-secondary border border-secondary/25",
    technician: "bg-primary/10 text-primary border border-primary/25",
    admin: "bg-neutral text-neutral-content border border-neutral",
  };
  const label = { customer: "Customer", technician: "Technician", admin: "Admin" };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${
        map[role] || ""
      } ${className}`}
    >
      {label[role] || role}
    </span>
  );
}
