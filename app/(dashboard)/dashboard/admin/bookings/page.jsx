"use client";

import { useEffect, useState } from "react";
import { CalendarDays, ClipboardList, MapPin } from "lucide-react";
import { toast } from "sonner";
import RoleGate from "@/components/dashboard/RoleGate";
import PageHeader from "@/components/dashboard/PageHeader";
import Timeline from "@/components/ui/Timeline";
import { PaymentBadge, StatusBadge } from "@/components/ui/Badges";
import { TableSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";

const TABS = ["all", "requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];


export default function AdminBookingsPage() {
  return (
    <RoleGate role="admin">
      <Inner />
    </RoleGate>
  );
}

function Inner() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [openId, setOpenId] = useState(null);

  async function load(status = "all") {
    const res = await api(`/api/admin/bookings?status=${status}`);
    if (res.ok) setBookings(res.data || []);
    else toast.error(res.message);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    load(tab);
  }, [tab]);

  return (
    <>
      <PageHeader title="All Bookings" subtitle="Every repair job across the platform (read-only)." />

      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn btn-xs rounded-full px-3.5 font-semibold capitalize ${
              tab === t ? "btn-primary" : "btn-ghost border border-base-300"
            }`}
          >
            {t === "all" ? "All" : t.replace("-", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : bookings.length === 0 ? (
        <EmptyState icon={ClipboardList} title={`No ${tab === "all" ? "" : tab.replace("-", " ")} bookings`} />
      ) : (
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-base-content/50">
                    <th>Service</th>
                    <th>Customer → Technician</th>
                    <th>Visit</th>
                    <th className="text-right">Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th className="text-right">Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-base-200/60 align-top">
                      <td className="max-w-52">
                        <p className="font-semibold truncate">{b.serviceTitle}</p>
                        <p className="text-xs text-base-content/50 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" /> {b.address}
                        </p>
                      </td>
                      <td className="text-sm">
                        <p>{b.customerName}</p>
                        <p className="text-xs text-base-content/50">→ {b.technicianName}</p>
                      </td>
                      <td className="whitespace-nowrap text-sm">
                        <CalendarDays className="w-3.5 h-3.5 inline mr-1 text-base-content/40" />
                        {formatDate(b.preferredDate)}
                      </td>
                      <td className="text-right font-bold text-primary whitespace-nowrap">{formatPrice(b.finalAmount)}</td>
                      <td><StatusBadge status={b.status} /></td>
                      <td><PaymentBadge status={b.paymentStatus} /></td>
                      <td className="text-right">
                        <button
                          className="btn btn-ghost btn-xs rounded-lg font-semibold"
                          onClick={() => setOpenId(openId === b._id ? null : b._id)}
                        >
                          {openId === b._id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {openId && (
              <div className="p-4 border-t border-base-300 overflow-x-auto">
                <Timeline
                  history={bookings.find((b) => b._id === openId)?.statusHistory || []}
                  status={bookings.find((b) => b._id === openId)?.status}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
