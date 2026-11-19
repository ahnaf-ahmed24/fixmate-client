"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Banknote,
  ClipboardList,
  Clock3,
  CircleCheck,
  Wallet,
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
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { STATUS_LABELS } from "@/lib/constants";
import Image from "next/image";


const STATUS_COLORS = {
  requested: "#3b82f6",
  accepted: "#6366f1",
  "in-progress": "#f59e0b",
  completed: "#10b981",
  paid: "#06b6d4",
  rejected: "#f43f5e",
  cancelled: "#94a3b8",
};

function CustomerOverview() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [statsRes, bookingsRes] = await Promise.all([
        api("/api/users/stats/customer"),
        api("/api/bookings/my"),
      ]);
      if (statsRes.ok) setStats(statsRes.data);
      else toast.error(statsRes.message);
      if (bookingsRes.ok) setBookings(bookingsRes.data || []);
      setLoading(false);
    })();
  }, []);

  const chartData = Object.keys(STATUS_LABELS)
    .map((status) => ({ status: STATUS_LABELS[status], count: bookings.filter((b) => b.status === status).length }))
    .filter((d) => d.count > 0);

  const duePayment = bookings.filter((b) => b.status === "completed" && b.paymentStatus !== "paid");

  return (
    <RoleGate role="customer">
      <PageHeader
        title="My Overview"
        subtitle="A snapshot of your repair activity and spending."
        action={
          <Link href="/services" className="btn btn-primary btn-sm rounded-lg font-semibold">
            Book a repair
          </Link>
        }
      />


      {!loading && duePayment.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 mb-6">
          <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
            <Wallet className="w-5 h-5" />
          </span>
          <p className="text-sm flex-1 min-w-48">
            <span className="font-semibold">
              {duePayment.length} completed {duePayment.length === 1 ? "job is" : "jobs are"} waiting
              for payment.
            </span>{" "}
            <span className="text-base-content/60">Pay securely with Stripe to get your receipt.</span>
          </p>
          <Link href="/dashboard/customer/payments" className="btn btn-primary btn-sm rounded-lg font-semibold">
            Pay now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={ClipboardList} label="Total requests" value={loading ? "—" : stats?.totalRequests ?? 0} tone="primary" href="/dashboard/customer/bookings" />
        <StatsCard icon={Clock3} label="Active jobs" value={loading ? "—" : stats?.activeJobs ?? 0} tone="accent" hint="Requested · Accepted · In progress" />
        <StatsCard icon={CircleCheck} label="Completed jobs" value={loading ? "—" : stats?.completedJobs ?? 0} tone="success" />
        <StatsCard icon={Wallet} label="Total spent" value={loading ? "—" : formatPrice(stats?.totalSpent || 0)} tone="secondary" href="/dashboard/customer/payments" />
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Recent bookings */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold">Recent requests</h2>
              <Link href="/dashboard/customer/bookings" className="link link-primary text-sm font-semibold">
                View all
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 py-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 bg-base-300/60 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <EmptyState
                title="No repair requests yet"
                description="Browse the catalog and send your first repair request."
                icon={ClipboardList}
                actionLabel="Find a service"
                actionHref="/services"
              />
            ) : (
              <ul className="divide-y divide-base-300">
                {bookings.slice(0, 5).map((b) => (
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
                      <p className="text-xs text-base-content/50">
                        {b.technicianName} · {formatDate(b.preferredDate)}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Status chart */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-5">
            <h2 className="font-bold mb-3">Requests by status</h2>
            {chartData.length === 0 ? (
              <p className="text-sm text-base-content/50 py-10 text-center">Data appears after your first booking.</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" vertical={false} />
                    <XAxis dataKey="status" tick={{ fontSize: 10, fill: "var(--color-base-content)" }} interval={0} angle={-18} dy={8} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--color-base-content)" }} />
                    <Tooltip
                      cursor={{ fill: "color-mix(in oklab, var(--color-primary) 8%, transparent)" }}
                      contentStyle={{ background: "var(--color-base-100)", border: "1px solid var(--color-base-300)", borderRadius: 12, fontSize: 12 }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {chartData.map((d) => (
                        <Cell key={d.status} fill={STATUS_COLORS[Object.keys(STATUS_LABELS).find((k) => STATUS_LABELS[k] === d.status)]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <p className="text-[11px] text-base-content/45 mt-2 flex items-center gap-1.5">
              <Banknote className="w-3.5 h-3.5" /> Payments are only taken after a job completes.
            </p>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}

export default function CustomerDashboardPage() {
  return <CustomerOverview />;
}
