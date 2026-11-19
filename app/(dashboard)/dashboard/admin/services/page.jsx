"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, CircleX, Globe, Lock } from "lucide-react";
import { toast } from "sonner";
import RoleGate from "@/components/dashboard/RoleGate";
import PageHeader from "@/components/dashboard/PageHeader";
import { ApprovalBadge } from "@/components/ui/Badges";
import { TableSkeleton } from "@/components/ui/Skeletons";
import { ConfirmModal } from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

const TABS = ["all", "pending", "approved", "rejected"];

/** Admin: approve or reject technician-submitted services. */
export default function AdminServicesPage() {
  return (
    <RoleGate role="admin">
      <Inner />
    </RoleGate>
  );
}

function Inner() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [target, setTarget] = useState(null); // { service, decision }
  const [busy, setBusy] = useState(false);

  async function load(status = "all") {
    const res = await api(`/api/admin/services?approval=${status}`);
    if (res.ok) setServices(res.data || []);
    else toast.error(res.message);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    load(tab);
  }, [tab]);

  function requestDecision(service, decision) {
    setTarget({ service, decision });
  }

  async function confirmDecision() {
    if (!target) return;
    setBusy(true);
    const res = await api(`/api/admin/services/${target.service._id}/approval`, {
      method: "PATCH",
      body: { approvalStatus: target.decision },
    });
    setBusy(false);
    if (res.ok) {
      toast.success(res.message || `Service ${target.decision}`);
      setTarget(null);
      load(tab);
    } else {
      toast.error(res.message);
    }
  }

  const pendingCount = services.filter((s) => s.approvalStatus === "pending").length;

  return (
    <>
      <PageHeader
        title="Service Approval"
        subtitle="Review technician submissions before they appear publicly."
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn btn-xs rounded-full px-3.5 font-semibold capitalize ${
              tab === t ? "btn-primary" : "btn-ghost border border-base-300"
            }`}
          >
            {t}
          </button>
        ))}
        {pendingCount > 0 && (
          <span className="badge badge-warning badge-sm font-bold">{pendingCount} pending in view</span>
        )}
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : services.length === 0 ? (
        <EmptyState title={`No ${tab === "all" ? "" : tab} services`} description="New submissions will appear here." />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {services.map((s) => (
            <div key={s._id} className="card bg-base-100 border border-base-300 shadow-sm">
              <figure className="relative h-36 overflow-hidden rounded-t-[1rem] bg-base-200">
                <Image
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.classList.add("bg-gradient-to-br", "from-primary/20", "to-secondary/20");
                  }}
                />
                <div className="absolute top-3 left-3">
                  <ApprovalBadge status={s.approvalStatus} className="bg-base-100/90 backdrop-blur border-0" />
                </div>
              </figure>
              <div className="card-body p-4 gap-2">
                <h3 className="font-bold leading-snug clamp-2 min-h-[2.5rem]">{s.title}</h3>
                <p className="text-xs text-base-content/55">
                  by <span className="font-semibold">{s.technicianName}</span> · {s.category} · {formatPrice(s.basePrice)}
                </p>
                <p className="text-xs text-base-content/45 flex items-center gap-1">
                  {s.isAvailable ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  {s.isAvailable ? "Available" : "Unavailable"}
                </p>
                {s.approvalStatus === "pending" ? (
                  <div className="mt-auto pt-2 flex gap-2 border-t border-base-300">
                    <button
                      onClick={() => requestDecision(s, "rejected")}
                      className="btn btn-error btn-outline btn-xs rounded-lg flex-1 font-semibold"
                    >
                      <CircleX className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => requestDecision(s, "approved")}
                      className="btn btn-success btn-xs rounded-lg flex-1 font-semibold"
                    >
                      <BadgeCheck className="w-3.5 h-3.5" /> Approve
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-base-content/45 mt-auto pt-2 border-t border-base-300">
                    {s.approvalStatus === "approved"
                      ? "Live in the public catalog."
                      : "Rejected — hidden from customers."}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!target}
        onClose={() => setTarget(null)}
        onConfirm={confirmDecision}
        busy={busy}
        danger={target?.decision === "rejected"}
        title={target?.decision === "approved" ? "Approve this service?" : "Reject this service?"}
        message={
          target?.decision === "approved"
            ? `“${target?.service?.title}” will become publicly visible and bookable.`
            : `“${target?.service?.title}” will be hidden from customers.`
        }
        confirmLabel={target?.decision === "approved" ? "Approve" : "Reject"}
      />
    </>
  );
}
