"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { DASHBOARD_HOME } from "@/lib/constants";

export default function DashboardIndexPage() {
  const { user, loading, dashboardHome } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace(dashboardHome(user));
    if (!loading && !user) router.replace("/sign-in?redirect=/dashboard");
  }, [loading, user, dashboardHome, router]);

  return (
    <div className="grid place-items-center py-24">
      <span className="loading loading-dots loading-md text-primary" />
    </div>
  );
}
