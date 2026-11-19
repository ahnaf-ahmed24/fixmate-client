"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Eye, EyeOff, Info, LogIn } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "@/components/auth/AuthShell";
import SocialButtons from "@/components/auth/SocialButtons";
import { useAuth } from "@/components/providers/AuthProvider";


const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@fixmate.com", password: "Admin@123" },
  { role: "Technician", email: "rakib@fixmate.com", password: "Tech@123" },
  { role: "Customer", email: "nusrat@fixmate.com", password: "Cust@123" },
];

function SignInForm() {
  const { signIn, signInSocial, user, loading, dashboardHome } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect");
  const reason = params.get("reason");
  const oauthError = params.get("error");

  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);


  useEffect(() => {
    if (!oauthError) return;
    const messages = {
      state_not_found: "Sign-in session expired. Please try again.",
      access_denied: "You cancelled the sign-in. Please try again.",
      oauth_error: "Social sign-in failed. Please try again.",
      social: "Social sign-in failed. Please try again.",
    };
    toast.error(messages[oauthError] || `Social sign-in failed (${oauthError})`);
  }, [oauthError]);


  useEffect(() => {
    if (!loading && user) {
      router.replace(redirect || dashboardHome(user));
    }
  }, [loading, user, redirect, dashboardHome, router]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const res = await signIn(form);
    setBusy(false);
    if (res.ok) {
      toast.success(`Welcome back, ${res.user?.name || "friend"}!`);
      router.replace(redirect || dashboardHome(res.user));
    } else {
      toast.error(res.message || "Sign in failed");
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="card bg-base-100 border border-base-300 shadow-xl">
        <div className="card-body p-7 gap-5">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="text-sm text-base-content/60 mt-1">Sign in to manage your repairs</p>
          </div>

          {reason === "book" && (
            <div role="status" className="alert alert-info text-sm py-2.5 px-4">
              <Info className="w-4 h-4 shrink-0" />
              <span>Sign in as a customer to book this service.</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="si-email" className="label text-sm font-medium">Email</label>
              <input
                id="si-email"
                type="email"
                required
                autoComplete="email"
                className="input input-bordered w-full rounded-lg"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="si-password" className="label text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  id="si-password"
                  type={show ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="input input-bordered w-full rounded-lg pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
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

            <button type="submit" className="btn btn-primary w-full rounded-lg font-semibold" disabled={busy}>
              {busy ? <span className="loading loading-spinner loading-xs" /> : <LogIn className="w-4 h-4" />}
              Sign In
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
            New to FixMate?{" "}
            <Link
              href={redirect ? `/sign-up?redirect=${encodeURIComponent(redirect)}` : "/sign-up"}
              className="link link-primary font-semibold"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

    
      <div className="card bg-base-100 border border-base-300 mt-4">
        <div className="card-body p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-base-content/50 mb-2">
            Demo accounts (click to fill)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.role}
                type="button"
                onClick={() => setForm({ email: a.email, password: a.password })}
                className="btn btn-outline btn-xs rounded-lg"
                title={`${a.email} / ${a.password}`}
              >
                {a.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <AuthShell>
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
