"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarClock } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import { todayISO } from "@/lib/utils";
import Image from "next/image";

const MIN_DESC = 20;


export default function RequestRepairModal({ open, onClose, service }) {
  const { user, loading, dashboardHome } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ customerPhone: "", address: "", preferredDate: "", problemDescription: "" });
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const descLen = form.problemDescription.trim().length;

  function guard() {
    if (loading) {
      toast.info("Checking your session…");
      return false;
    }
    if (!user) {
   
      toast.info("Please sign in as a customer to book this service");
      router.push(`/sign-in?redirect=${encodeURIComponent(`/services/${service._id}`)}&reason=book`);
      return false;
    }
    if (user.role === "technician") {
      toast.error("Technicians cannot send repair requests. Switch to a customer account.");
      router.push(dashboardHome(user));
      return false;
    }
    if (user.role === "admin") {
      toast.error("Admins cannot send repair requests. Use a customer account to book.");
      return false;
    }
    if (user.email === service.technicianEmail) {
      toast.error("You cannot request your own service");
      return false;
    }
    return true;
  }

  async function submit(e) {
    e.preventDefault();
    if (!guard()) return;

    if (descLen < MIN_DESC) {
      toast.error(`Problem description must be at least ${MIN_DESC} characters`);
      return;
    }

    setBusy(true);
    const res = await api("/api/bookings", {
      method: "POST",
      body: { serviceId: service._id, ...form },
    });
    setBusy(false);

    if (res.ok) {
      toast.success(res.message || "Repair request sent!");
      onClose();
      router.push("/dashboard/customer/bookings");
    } else {
      toast.error(res.message || "Could not send the request");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Request repair — ${service?.title || ""}`} wide>
      <form onSubmit={submit} className="space-y-4">
        {/* Booking summary */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200/70 border border-base-300">
          {service?.image && (
            <Image
              src={service.image}
              alt=""
              className="w-14 h-14 rounded-lg object-cover bg-base-300"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <div className="text-sm">
            <p className="font-bold">{service?.technicianName}</p>
            <p className="text-base-content/60">
              {service?.category} · {service?.serviceMode} · base {`$${service?.basePrice}`}
            </p>
          </div>
        </div>

    
        {user && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <span className="label text-sm font-medium">Your name (read-only)</span>
              <input className="input input-bordered w-full rounded-lg bg-base-200/70 text-base-content/60" value={user.name || ""} disabled readOnly />
            </div>
            <div>
              <span className="label text-sm font-medium">Your email (read-only)</span>
              <input className="input input-bordered w-full rounded-lg bg-base-200/70 text-base-content/60" value={user.email || ""} disabled readOnly />
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="rr-phone" className="label text-sm font-medium">Phone number *</label>
            <input
              id="rr-phone"
              className="input input-bordered w-full rounded-lg"
              required
              value={form.customerPhone}
              onChange={set("customerPhone")}
              placeholder="+8801XXXXXXXXX"
            />
          </div>
          <div>
            <label htmlFor="rr-date" className="label text-sm font-medium flex items-center gap-1.5">
              <CalendarClock className="w-3.5 h-3.5" /> Preferred date *
            </label>
            <input
              id="rr-date"
              type="date"
              min={todayISO()}
              className="input input-bordered w-full rounded-lg"
              required
              value={form.preferredDate}
              onChange={set("preferredDate")}
            />
            <p className="text-[11px] text-base-content/50 mt-1">Today or any future date</p>
          </div>
        </div>

        <div>
          <label htmlFor="rr-address" className="label text-sm font-medium">Service address *</label>
          <input
            id="rr-address"
            className="input input-bordered w-full rounded-lg"
            required
            value={form.address}
            onChange={set("address")}
            placeholder="House / Road / Area, City"
          />
        </div>

        <div>
          <label htmlFor="rr-desc" className="label text-sm font-medium">
            Describe the problem *{" "}
            <span className={`text-xs font-normal ${descLen >= MIN_DESC ? "text-success" : "text-base-content/50"}`}>
              {descLen}/{MIN_DESC} minimum
            </span>
          </label>
          <textarea
            id="rr-desc"
            className="textarea textarea-bordered w-full rounded-lg min-h-24"
            required
            value={form.problemDescription}
            onChange={set("problemDescription")}
            placeholder="What's wrong, since when, and anything the technician should know…"
          />
        </div>

        <p className="text-xs text-base-content/50">
          You&apos;ll pay only after the technician completes the job — the final amount is agreed on completion.
        </p>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn btn-ghost rounded-lg" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary rounded-lg px-6 font-semibold" disabled={busy}>
            {busy && <span className="loading loading-spinner loading-xs" />}
            Send request
          </button>
        </div>
      </form>
    </Modal>
  );
}
