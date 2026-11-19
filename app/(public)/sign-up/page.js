"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  Building2,
  Check,
  Eye,
  EyeOff,
  Info,
  ShieldCheck,
  UserRoundPlus,
  Wrench,
  X,
} from "lucide-react";
import { toast } from "sonner";
import AuthShell from "@/components/auth/AuthShell";
import SocialButtons from "@/components/auth/SocialButtons";
import { useAuth } from "@/components/providers/AuthProvider";
import { validatePassword } from "@/lib/utils";

const ROLES = [
  {
    value: "customer",
    title: "Customer",
    text: "Book repairs, track jobs live and pay securely online.",
    icon: Building2,
  },
  {
    value: "technician",
    title: "Technician",
    text: "List your services, manage repair requests and grow earnings.",
    icon: Wrench,
  },
];

function SignUpForm() {
  const { signUp, signInSocial, user, loading, dashboardHome } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect");

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "customer" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pwdErrors, setPwdErrors] = useState([]);

  useEffect(() => {
    if (!loading && user) router.replace(redirect || dashboardHome(user));
  }, [loading, user, redirect, dashboardHome, router]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();

    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    const errors = validatePassword(form.password);
    setPwdErrors(errors);
    if (errors.length) {
      toast.error(`Password needs ${errors.join(", ")}`);
      return;
    }

    setBusy(true);
    const res = await signUp({ name: form.name.trim(), email: form.email.trim(), password: form.password, role: form.role });
    setBusy(false);

    if (res.ok) {
      toast.success("Account created — welcome to FixMate!");
      router.replace(redirect || dashboardHome(res.user));
    } else {
      toast.error(res.message || "Sign up failed");
    }
  }

  const rules = [
    { ok: (form.password || "").length >= 6, label: "6+ characters" },
    { ok: /[A-Z]/.test(form.password || ""), label: "1 uppercase" },
    { ok: /[a-z]/.test(form.password || ""), label: "1 lowercase" },
  ];

  return (
    <div className="w-full max-w-md">
      <div className="card bg-base-100 border border-base-300 shadow-xl">
        <div className="card-body p-7 gap-5">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight">Create your account</h1>
            <p className="text-sm text-base-content/60 mt-1">Join as a customer or technician</p>
          </div>

          {redirect && (
            <div role="status" className="alert alert-info text-sm py-2.5 px-4">
              <Info className="w-4 h-4 shrink-0" />
              <span>Create an account to continue booking.</span>
            </div>
          )}

          {/* Role cards */}
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => {
              const active = form.role === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                  className={`card border-2 p-3.5 text-left transition-all ${
                    active ? "border-primary bg-primary/5" : "border-base-300 hover:border-base-content/25"
                  }`}
                  aria-pressed={active}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-lg grid place-items-center ${
                        active ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/60"
                      }`}
                    >
                      <r.icon className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-sm">{r.title}</span>
                    {active && <Check className="w-4 h-4 text-primary ml-auto" />}
                  </div>
                  <p className="text-[11px] text-base-content/55 mt-1.5 leading-snug">{r.text}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="su-name" className="label text-sm font-medium">Full name</label>
              <input
                id="su-name"
                required
                autoComplete="name"
                className="input input-bordered w-full rounded-lg"
                placeholder="e.g. Nusrat Jahan"
                value={form.name}
                onChange={set("name")}
              />
            </div>

            <div>
              <label htmlFor="su-email" className="label text-sm font-medium">Email</label>
              <input
                id="su-email"
                type="email"
                required
                autoComplete="email"
                className="input input-bordered w-full rounded-lg"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="su-password" className="label text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    id="su-password"
                    type={show ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    className="input input-bordered w-full rounded-lg pr-10"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="su-confirm" className="label text-sm font-medium">Confirm password</label>
                <input
                  id="su-confirm"
                  type={show ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="input input-bordered w-full rounded-lg"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={set("confirm")}
                />
              </div>
            </div>

            {/* Live password policy */}
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              {rules.map((r) => (
                <li key={r.label} className={`flex items-center gap-1 ${r.ok ? "text-success" : "text-base-content/45"}`}>
                  {r.ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} {r.label}
                </li>
              ))}
            </ul>

            <button type="submit" className="btn btn-primary w-full rounded-lg font-semibold" disabled={busy}>
              {busy ? <span className="loading loading-spinner loading-xs" /> : <UserRoundPlus className="w-4 h-4" />}
              Create account
            </button>
          </form>

          <SocialButtons
            disabled={busy}
            onSignIn={async (provider) => {
              const res = await signInSocial(provider, redirect || "/");
              if (!res.ok) toast.error(res.message);
            }}
          />

          <p className="text-sm text-center text-base-content/60">
            Already have an account?{" "}
            <Link
              href={redirect ? `/sign-in?redirect=${encodeURIComponent(redirect)}` : "/sign-in"}
              className="link link-primary font-semibold"
            >
              Sign in
            </Link>
          </p>

          <p className="text-[11px] text-center text-base-content/45 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin accounts are provisioned by FixMate only.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <AuthShell>
      <Suspense fallback={null}>
        <SignUpForm />
      </Suspense>
    </AuthShell>
  );
}
