"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROLE_LABELS } from "@/lib/constants";


export default function RoleGate({ role, children }) {
  const { user, loading, dashboardHome } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="grid place-items-center py-24">
        <span className="loading loading-dots loading-md text-primary" />
      </div>
    );
  }

  if (!user) return null; 

  if (user.role !== role) {
    return (
      <div className="card bg-base-100 border border-base-300 max-w-md mx-auto mt-10">
        <div className="card-body items-center text-center p-8">
          <span className="w-14 h-14 rounded-2xl bg-error/10 text-error grid place-items-center">
            <ShieldAlert className="w-7 h-7" />
          </span>
          <h2 className="font-extrabold text-xl">Access restricted</h2>
          <p className="text-sm text-base-content/60">
            This area is for <span className="font-semibold">{ROLE_LABELS[role]}s</span> only — you
            are signed in as a {ROLE_LABELS[user.role]?.toLowerCase() || user.role}.
          </p>
          <Link href={dashboardHome(user)} className="btn btn-primary btn-sm rounded-lg mt-2 font-semibold">
            Go to my dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
