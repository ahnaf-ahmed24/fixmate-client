"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Banknote,
  BadgeCheck,
  Clock3,
  CircleCheck,
  Inbox,
  Wrench,
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
import { StatusBadge } from "@/components/ui/Badges";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

const STATUS_COLORS = {
  requested: "#3b82f6",
  accepted: "#6366f1",
  "in-progress": "#f59e0b",
  completed: "#10b981",
  rejected: "#f43f5e",
  cancelled: "#94a3b8",
};

function TechnicianOverview() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [statsRes, bookingsRes] = await Promise.all([
        api("/api/users/stats/technician"),
        api("/api/bookings/technician"),
      ]);
      if (statsRes.ok) setStats(statsRes.data);
      else toast.error(statsRes.message);
      if (bookingsRes.ok) setBookings(bookingsRes.data || []);
      setLoading(false);
    })();
  }, []);

  const incoming = bookings.filter((b) => b.status === "requested");
  const active = bookings.filter((b) => ["accepted", "in-progress"].includes(b.status));

  const chartData = ["requested", "accepted", "in-progress", "completed", "paid"].map((status) => ({
    status: status.replace("-", " "),
    count: bookings.filter((b) => b.status === status).length,
  }));

  return (
    <RoleGate role="technician">
      <PageHeader
        title="Technician Overview"
        subtitle="Your services, incoming requests and earnings at a glance."
        action={
          <Link href="/dashboard/technician/add-service" className="btn btn-primary btn-sm rounded-lg font-semibold">
            Add a service
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <StatsCard icon={Wrench} label="My services" value={loading ? "—" : stats?.totalServices ?? 0} hint={`${stats?.approvedServices ?? 0} approved`} tone="primary" href="/dashboard/technician/my-services" />
        <StatsCard icon={Inbox} label="Pending requests" value={loading ? "—" : stats?.pendingRequests ?? 0} hint="Waiting for your response" tone="accent" href="/dashboard/technician/requests" />
        <StatsCard icon={Banknote} label="Total earnings" value={loading ? "—" : formatPrice(stats?.totalEarnings || 0)} hint="From completed + paid jobs" tone="success" />
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Incoming + active work queue */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold">Work queue</h2>
              <Link href="/dashboard/technician/requests" className="link link-primary text-sm font-semibold">
                Manage all
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 py-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 bg-base-300/60 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-sm text-base-content/55 py-10 text-center">
                No repair requests yet. Promote your services to get booked.
              </p>
            ) : (
              <ul className="divide-y divide-base-300">
                {[...incoming, ...active].slice(0, 6).map((b) => (
                  <li key={b._id} className="flex items-center gap-3 py-3">
                    <Image
                      src={b.serviceImage}
                      alt=""
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-lg object-cover bg-base-200"
                      onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{b.serviceTitle}</p>
                      <p className="text-xs text-base-content/50 truncate">
                        {b.customerName} · {formatPrice(b.finalAmount)}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Pipeline chart */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-5">
            <h2 className="font-bold mb-3">Jobs by stage</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" vertical={false} />
                  <XAxis dataKey="status" tick={{ fontSize: 10, fill: "var(--color-base-content)" }} interval={0} angle={-18} dy={8} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--color-base-content)" }} />
                  <Tooltip
                    cursor={{ fill: "color-mix(in oklab, var(--color-primary) 8%, transparent)" }}
                    contentStyle={{ background: "var(--color-base-100)", border: "1px solid var(--color-base-300)", borderRadius: 12, fontSize: 12 }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((d) => (
                      <Cell key={d.status} fill={STATUS_COLORS[d.status.replace(" ", "-")]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-base-content/45 mt-2 flex items-center gap-1.5">
              <Clock3 className="w-3.5 h-3.5" /> {stats?.inProgress ?? 0} in progress ·{" "}
              <CircleCheck className="w-3.5 h-3.5" /> {stats?.completed ?? 0} completed
            </p>
            <p className="text-[11px] text-base-content/45 flex items-center gap-1.5 mt-1">
              <BadgeCheck className="w-3.5 h-3.5" /> Keep services available to appear in searches.
            </p>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}

export default function TechnicianDashboardPage() {
  return <TechnicianOverview />;
}
