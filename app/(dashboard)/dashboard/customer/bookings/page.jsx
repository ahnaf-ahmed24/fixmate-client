"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  CircleAlert,
  CreditCard,
  MapPin,
  Phone,
  ReceiptText,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import RoleGate from "@/components/dashboard/RoleGate";
import PageHeader from "@/components/dashboard/PageHeader";
import Timeline from "@/components/ui/Timeline";
import { PaymentBadge, StatusBadge } from "@/components/ui/Badges";
import { ConfirmModal } from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import Image from "next/image";


export default function CustomerBookingsPage() {
  return (
    <RoleGate role="customer">
      <Inner />
    </RoleGate>
  );
}

function Inner() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [payingId, setPayingId] = useState(null);

  async function load() {
    const res = await api("/api/bookings/my");
    if (res.ok) setBookings(res.data || []);
    else toast.error(res.message);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function confirmCancel() {
    if (!cancelTarget) return;
    setBusy(true);
    const res = await api(`/api/bookings/${cancelTarget._id}/cancel`, { method: "PATCH" });
    setBusy(false);
    if (res.ok) {
      toast.success(res.message || "Booking cancelled");
      setCancelTarget(null);
      load();
    } else {
      toast.error(res.message);
    }
  }


  async function payNow(booking) {
    setPayingId(booking._id);
    const res = await api("/api/payments/create-checkout-session", {
      method: "POST",
      body: { bookingId: booking._id },
    });
    setPayingId(null);
    if (res.ok && res.data?.url) {
      window.location.assign(res.data.url);
    } else {
      toast.error(res.message || "Could not start checkout");
    }
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const tabs = ["all", "requested", "accepted", "in-progress", "completed", "paid", "cancelled"];

  return (
    <>
      <PageHeader
        title="My Bookings"
        subtitle="Every repair request, with its live status timeline."
        action={
          <Link href="/services" className="btn btn-primary btn-sm rounded-lg font-semibold">
            New request
          </Link>
        }
      />


      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`btn btn-xs rounded-full px-3.5 font-semibold capitalize ${
              filter === t ? "btn-primary" : "btn-ghost border border-base-300"
            }`}
          >
            {t === "all" ? "All" : t.replace("-", " ")}
            <span className="opacity-70">
              {t === "all" ? bookings.length : bookings.filter((b) => b.status === t).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-64 bg-base-100 border border-base-300 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={filter === "all" ? CircleAlert : undefined}
          title={filter === "all" ? "No bookings yet" : `No ${filter.replace("-", " ")} bookings`}
          description="Requests you send will appear here with a full timeline."
          actionLabel="Browse services"
          actionHref="/services"
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <BookingCard
              key={b._id}
              booking={b}
              onCancel={() => setCancelTarget(b)}
              onPay={() => payNow(b)}
              paying={payingId === b._id}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
        busy={busy}
        title="Cancel this request?"
        message={`Your request for “${cancelTarget?.serviceTitle}” will be cancelled. The technician will no longer see it as active.`}
        confirmLabel="Yes, cancel it"
      />
    </>
  );
}

function BookingCard({ booking: b, onCancel, onPay, paying }) {
  const canCancel = b.status === "requested";
  const canPay = b.status === "completed" && b.paymentStatus !== "paid";

  return (
    <article className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-4 md:p-5 gap-4">
        {/* Top row */}
        <div className="flex flex-wrap items-start gap-4">
          <Image
            src={b.serviceImage}
            alt={b.serviceTitle}
            width={80}
            height={80}
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover bg-base-200 shrink-0"
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
              e.currentTarget.parentElement.classList.add("bg-gradient-to-br", "from-primary/20", "to-secondary/20");
            }}
          />
          <div className="flex-1 min-w-48">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-bold text-lg">{b.serviceTitle}</h2>
              <StatusBadge status={b.status} />
              <PaymentBadge status={b.paymentStatus} />
              <span className="badge badge-ghost badge-sm border-base-300">{b.category}</span>
            </div>
            <p className="text-sm text-base-content/60 flex items-center gap-1.5">
              <UserRound className="w-3.5 h-3.5" /> {b.technicianName}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-base-content/55">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {b.customerPhone}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {b.address}</span>
              <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Visit: {formatDate(b.preferredDate)}</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-[11px] uppercase tracking-wide text-base-content/45 font-semibold">
              {b.status === "completed" || b.status === "paid" ? "Final amount" : "Base price"}
            </p>
            <p className="text-2xl font-extrabold text-primary">{formatPrice(b.finalAmount)}</p>
          </div>
        </div>


        <p className="text-sm text-base-content/70 bg-base-200/60 rounded-xl p-3 border border-base-300/60">
          <span className="font-semibold text-base-content/50 text-xs uppercase tracking-wide block mb-1">Reported problem</span>
          {b.problemDescription}
        </p>

        <div className="border-t border-base-300 pt-4 overflow-x-auto">
          <Timeline history={b.statusHistory || []} status={b.status} />
        </div>

        {/* Actions */}
        <div className="border-t border-base-300 pt-3 flex flex-wrap justify-end gap-2">
          {canCancel && (
            <button onClick={onCancel} className="btn btn-error btn-outline btn-sm rounded-lg font-semibold">
              <X className="w-4 h-4" /> Cancel request
            </button>
          )}
          {canPay && (
            <button onClick={onPay} className="btn btn-primary btn-sm rounded-lg font-semibold" disabled={paying}>
              {paying ? <span className="loading loading-spinner loading-xs" /> : <CreditCard className="w-4 h-4" />}
              Pay now
            </button>
          )}
          {b.paymentStatus === "paid" && (
            <Link href="/dashboard/customer/payments" className="btn btn-success btn-outline btn-sm rounded-lg font-semibold">
              <ReceiptText className="w-4 h-4" /> Paid — view receipt
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
