export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatPrice(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "$0";
  return `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validatePassword(password) {
  const errors = [];
  if (!password || password.length < 6) errors.push("at least 6 characters");
  if (!/[A-Z]/.test(password || "")) errors.push("one uppercase letter");
  if (!/[a-z]/.test(password || "")) errors.push("one lowercase letter");
  return errors;
}


export function debounce(fn, delay = 450) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

export function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
