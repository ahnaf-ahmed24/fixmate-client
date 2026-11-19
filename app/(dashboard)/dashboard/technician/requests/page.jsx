"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CircleCheck,
  CircleX,
  DollarSign,
  Inbox,
  MapPin,
  Phone,
  PlayCircle,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import RoleGate from "@/components/dashboard/RoleGate";
import PageHeader from "@/components/dashboard/PageHeader";
import Timeline from "@/components/ui/Timeline";
import { PaymentBadge, StatusBadge } from "@/components/ui/Badges";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeletons";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import Image from "next/image";


export default function TechnicianRequestsPage() {
  return (
    <RoleGate role="technician">
      <Inner />
    </RoleGate>
  );
}

function Inner() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await api("/api/bookings/technician");
    if (res.ok) setBookings(res.data || []);
    else toast.error(res.message);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(booking, next, extra = {}) {
    setBusy(true);
    const res = await api(`/api/bookings/${booking._id}/status`, {
      method: "PATCH",
      body: { status: next, ...extra },
    });
    setBusy(false);
    if (res.ok) {
      toast.success(res.message || `Job marked as ${next}`);
      setRejectTarget(null);
      setCompleteTarget(null);
      load();
    } else {
      toast.error(res.message);
    }
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const tabs = ["all", "requested", "accepted", "in-progress", "completed", "paid", "rejected", "cancelled"];

  return (
    <>
      <PageHeader
        title="Manage Requests"
        subtitle="Repair requests for your services — move each job through the pipeline."
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
        <TableSkeleton rows={4} cols={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={filter === "all" ? "No requests yet" : `No ${filter.replace("-", " ")} jobs`}
          description="When customers book your services, the requests land here."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <RequestCard
              key={b._id}
              booking={b}
              busy={busy}
              onAccept={() => setStatus(b, "accepted")}
              onReject={() => setRejectTarget(b)}
              onStart={() => setStatus(b, "in-progress")}
              onComplete={() => setCompleteTarget(b)}
            />
          ))}
        </div>
      )}

      {/* Reject confirm */}
      <ConfirmModal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={() => rejectTarget && setStatus(rejectTarget, "rejected")}
        busy={busy}
        title="Reject this request?"
        message={`The customer will be notified that you can't take “${rejectTarget?.serviceTitle}”.`}
        confirmLabel="Reject request"
      />


      <CompleteModal
        open={!!completeTarget}
        onClose={() => setCompleteTarget(null)}
        onConfirm={(amount) => setStatus(completeTarget, "completed", { finalAmount: amount })}
        booking={completeTarget}
        busy={busy}
      />
    </>
  );
}

function RequestCard({ booking: b, busy, onAccept, onReject, onStart, onComplete }) {
  return (
    <article className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-4 md:p-5 gap-4">
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
            </div>
            <p className="text-sm text-base-content/70 flex items-center gap-1.5">
              <UserRound className="w-3.5 h-3.5" /> {b.customerName} ({b.customerEmail})
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
          <span className="font-semibold text-base-content/50 text-xs uppercase tracking-wide block mb-1">Customer&apos;s problem</span>
          {b.problemDescription}
        </p>

        <div className="border-t border-base-300 pt-4 overflow-x-auto">
          <Timeline history={b.statusHistory || []} status={b.status} />
        </div>

   
        <div className="border-t border-base-300 pt-3 flex flex-wrap justify-end gap-2">
          {b.status === "requested" && (
            <>
              <button onClick={onReject} className="btn btn-error btn-outline btn-sm rounded-lg font-semibold" disabled={busy}>
                <CircleX className="w-4 h-4" /> Reject
              </button>
              <button onClick={onAccept} className="btn btn-success btn-sm rounded-lg font-semibold" disabled={busy}>
                <CircleCheck className="w-4 h-4" /> Accept
              </button>
            </>
          )}
          {b.status === "accepted" && (
            <button onClick={onStart} className="btn btn-warning btn-sm rounded-lg font-semibold" disabled={busy}>
              <PlayCircle className="w-4 h-4" /> Start work
            </button>
          )}
          {b.status === "in-progress" && (
            <button onClick={onComplete} className="btn btn-success btn-sm rounded-lg font-semibold" disabled={busy}>
              <CircleCheck className="w-4 h-4" /> Mark completed
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function CompleteModal({ open, onClose, onConfirm, booking, busy }) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (booking) setAmount(String(booking.finalAmount ?? ""));
  }, [booking]);

  function submit(e) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Final amount must be greater than 0");
      return;
    }
    onConfirm(value);
  }

  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title="Complete the job">
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-base-content/70">
          Closing <span className="font-semibold">{booking?.serviceTitle}</span> for{" "}
          <span className="font-semibold">{booking?.customerName}</span>. Enter the final amount the
          customer will pay — this locks the job as <StatusBadge status="completed" /> and unlocks
          their Stripe payment.
        </p>
        <div>
          <label htmlFor="cm-amount" className="label text-sm font-medium flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" /> Final amount (USD) *
          </label>
          <input
            id="cm-amount"
            type="number"
            min="0.01"
            step="0.01"
            className="input input-bordered w-full rounded-lg"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost rounded-lg" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="btn btn-success rounded-lg font-semibold" disabled={busy}>
            {busy && <span className="loading loading-spinner loading-xs" />}
            Complete job
          </button>
        </div>
      </form>
    </Modal>
  );
}
