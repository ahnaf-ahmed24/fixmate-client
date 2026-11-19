"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Banknote,
  ClipboardList,
  UsersRound,
  Wrench,
  UserRoundCog,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import RoleGate from "@/components/dashboard/RoleGate";
import PageHeader from "@/components/dashboard/PageHeader";
import StatsCard from "@/components/ui/StatsCard";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { STATUS_LABELS } from "@/lib/constants";

const STATUS_COLORS = {
  requested: "#3b82f6",
  accepted: "#6366f1",
  "in-progress": "#f59e0b",
  completed: "#10b981",
  rejected: "#f43f5e",
  cancelled: "#94a3b8",
};

const CATEGORY_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#14b8a6", "#f43f5e", "#64748b"];

function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await api("/api/admin/stats");
      if (res.ok) setStats(res.data);
      else toast.error(res.message);
      setLoading(false);
    })();
  }, []);

  const statusData = (stats?.statusCounts || []).map((s) => ({
    status: STATUS_LABELS[s.status] || s.status,
    count: s.count,
  }));
  const categoryData = (stats?.categoryCounts || []).map((c) => ({ category: c.category, count: c.count }));

  return (
    <RoleGate role="admin">
      <PageHeader title="Admin Overview" subtitle="Platform-wide health: users, services, jobs and revenue." />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <StatsCard icon={UsersRound} label="Total users" value={loading ? "—" : stats?.totalUsers ?? 0} hint={`${stats?.customers ?? 0} customers · ${stats?.technicians ?? 0} technicians`} tone="primary" href="/dashboard/admin/users" />
        <StatsCard icon={ClipboardList} label="Total bookings" value={loading ? "—" : stats?.totalBookings ?? 0} hint="All time" tone="accent" href="/dashboard/admin/bookings" />
        <StatsCard icon={Banknote} label="Total revenue" value={loading ? "—" : formatPrice(stats?.totalRevenue || 0)} hint="Verified Stripe payments" tone="success" href="/dashboard/admin/transactions" />
        <StatsCard icon={UserRoundCog} label="Technicians" value={loading ? "—" : stats?.technicians ?? 0} tone="secondary" />
        <StatsCard
          icon={Wrench}
          label="Services listed"
          value={loading ? "—" : (stats?.categoryCounts || []).reduce((sum, c) => sum + c.count, 0)}
          hint="Approved catalog size"
          tone="info"
          href="/dashboard/admin/services"
        />
        <StatsCard icon={BadgeCheck} label="Pending approvals" value={loading ? "—" : stats?.pendingServices ?? 0} hint="Waiting for your review" tone="error" href="/dashboard/admin/services" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Bookings by status */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-5">
            <h2 className="font-bold mb-3">Bookings by status</h2>
            {statusData.length === 0 ? (
              <p className="text-sm text-base-content/50 py-10 text-center">No bookings yet.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" vertical={false} />
                    <XAxis dataKey="status" tick={{ fontSize: 10, fill: "var(--color-base-content)" }} interval={0} angle={-18} dy={10} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--color-base-content)" }} />
                    <Tooltip
                      cursor={{ fill: "color-mix(in oklab, var(--color-primary) 8%, transparent)" }}
                      contentStyle={{ background: "var(--color-base-100)", border: "1px solid var(--color-base-300)", borderRadius: 12, fontSize: 12 }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {statusData.map((d) => (
                        <Cell
                          key={d.status}
                          fill={STATUS_COLORS[Object.keys(STATUS_LABELS).find((k) => STATUS_LABELS[k] === d.status)]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-5">
            <h2 className="font-bold mb-3">Approved services by category</h2>
            {categoryData.length === 0 ? (
              <p className="text-sm text-base-content/50 py-10 text-center">No approved services yet.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 9, fill: "var(--color-base-content)" }} interval={0} angle={-18} dy={10} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--color-base-content)" }} />
                    <Tooltip
                      cursor={{ fill: "color-mix(in oklab, var(--color-primary) 8%, transparent)" }}
                      contentStyle={{ background: "var(--color-base-100)", border: "1px solid var(--color-base-300)", borderRadius: 12, fontSize: 12 }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {categoryData.map((d, i) => (
                        <Cell key={d.category} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}

export default function AdminDashboardPage() {
  return <AdminOverview />;
}
