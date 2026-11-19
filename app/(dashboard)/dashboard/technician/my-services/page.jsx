"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CirclePlus, Globe, Lock, Pencil, Trash2, Wrench } from "lucide-react";
import { toast } from "sonner";
import RoleGate from "@/components/dashboard/RoleGate";
import PageHeader from "@/components/dashboard/PageHeader";
import { ApprovalBadge } from "@/components/ui/Badges";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import ImageUpload from "@/components/ui/ImageUpload";
import { api } from "@/lib/api";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";


export default function MyServicesPage() {
  return (
    <RoleGate role="technician">
      <Inner />
    </RoleGate>
  );
}

function Inner() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await api("/api/services/mine/all");
    if (res.ok) setServices(res.data || []);
    else toast.error(res.message);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleAvailability(s) {
    const res = await api(`/api/services/${s._id}/availability`, { method: "PATCH" });
    if (res.ok) {
      toast.success(res.message);
      load();
    } else {
      toast.error(res.message);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    const res = await api(`/api/services/${deleting._id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      toast.success(res.message || "Service deleted");
      setDeleting(null);
      load();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <>
      <PageHeader
        title="My Services"
        subtitle="Everything you've listed, with approval state and availability."
        action={
          <Link href="/dashboard/technician/add-service" className="btn btn-primary btn-sm rounded-lg font-semibold">
            <CirclePlus className="w-4 h-4" /> Add a service
          </Link>
        }
      />

      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-64 bg-base-100 border border-base-300 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No services listed yet"
          description="Create your first service listing — it goes live after a quick admin review."
          actionLabel="Add a service"
          actionHref="/dashboard/technician/add-service"
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {services.map((s) => (
            <ServiceRow key={s._id} service={s} onEdit={() => setEditing(s)} onDelete={() => setDeleting(s)} onToggle={() => toggleAvailability(s)} />
          ))}
        </div>
      )}

      <EditModal
        service={editing}
        open={!!editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          load();
        }}
      />

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        busy={busy}
        title="Delete this service?"
        message={`“${deleting?.title}” will be removed permanently. Existing bookings are kept for records.`}
        confirmLabel="Delete service"
      />
    </>
  );
}

function ServiceRow({ service: s, onEdit, onDelete, onToggle }) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <figure className="relative h-40 overflow-hidden rounded-t-[1rem] bg-base-200">
        <Image
          src={s.image}
          alt={s.title}
          loading="lazy"
          className={`w-full h-full object-cover ${!s.isAvailable ? "opacity-60" : ""}`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.classList.add("bg-gradient-to-br", "from-primary/20", "to-secondary/20");
          }}
        />
        <div className="absolute top-3 left-3">
          <ApprovalBadge status={s.approvalStatus} className="bg-base-100/90 backdrop-blur border-0" />
        </div>
      </figure>
      <div className="card-body p-4 gap-2.5">
        <h3 className="font-bold leading-snug clamp-2 min-h-[2.5rem]">{s.title}</h3>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="badge badge-ghost badge-sm border-base-300">{s.category}</span>
          <span className="badge badge-ghost badge-sm border-base-300">{s.serviceMode}</span>
        </div>
        <p className="text-xl font-extrabold text-primary">{formatPrice(s.basePrice)}</p>

        <div className="mt-auto pt-2 flex items-center justify-between gap-2 border-t border-base-300">
          <button
            onClick={onToggle}
            className={`btn btn-xs rounded-lg font-semibold ${s.isAvailable ? "btn-success btn-outline" : "btn-warning btn-outline"}`}
            title={s.isAvailable ? "Currently visible to customers" : "Currently hidden from customers"}
          >
            {s.isAvailable ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {s.isAvailable ? "Available" : "Unavailable"}
          </button>
          <div className="flex gap-1">
            <button onClick={onEdit} className="btn btn-ghost btn-sm btn-square rounded-lg" aria-label="Edit service">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="btn btn-ghost btn-sm btn-square rounded-lg text-error" aria-label="Delete service">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function EditModal({ service, open, onClose, onSaved }) {
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (service) {
      setForm({
        title: service.title,
        category: service.category,
        description: service.description,
        image: service.image,
        basePrice: String(service.basePrice),
        estimatedDuration: service.estimatedDuration,
        serviceMode: service.serviceMode,
        serviceArea: service.serviceArea,
      });
    }
  }, [service]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    if (form.description.trim().length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }
    setBusy(true);
    const res = await api(`/api/services/${service._id}`, {
      method: "PATCH",
      body: { ...form, basePrice: Number(form.basePrice) },
    });
    setBusy(false);
    if (res.ok) {
      toast.success(res.message || "Service updated");
      onSaved();
    } else {
      toast.error(res.message);
    }
  }

  if (!form) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit service" wide>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label htmlFor="es-title" className="label text-sm font-medium">Title *</label>
          <input id="es-title" className="input input-bordered w-full rounded-lg" required value={form.title} onChange={set("title")} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="es-category" className="label text-sm font-medium">Category *</label>
            <select id="es-category" className="select select-bordered w-full rounded-lg" required value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="es-price" className="label text-sm font-medium">Base price (USD) *</label>
            <input id="es-price" type="number" min="1" step="0.5" className="input input-bordered w-full rounded-lg" required value={form.basePrice} onChange={set("basePrice")} />
          </div>
        </div>

        <div>
          <label htmlFor="es-desc" className="label text-sm font-medium">Description *</label>
          <textarea id="es-desc" className="textarea textarea-bordered w-full rounded-lg min-h-24" required value={form.description} onChange={set("description")} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="es-duration" className="label text-sm font-medium">Estimated duration *</label>
            <input id="es-duration" className="input input-bordered w-full rounded-lg" required value={form.estimatedDuration} onChange={set("estimatedDuration")} />
          </div>
          <div>
            <label htmlFor="es-mode" className="label text-sm font-medium">Service mode *</label>
            <select id="es-mode" className="select select-bordered w-full rounded-lg" required value={form.serviceMode} onChange={set("serviceMode")}>
              {SERVICE_MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="es-area" className="label text-sm font-medium">Service area *</label>
          <input id="es-area" className="input input-bordered w-full rounded-lg" required value={form.serviceArea} onChange={set("serviceArea")} />
        </div>

        <ImageUpload
          label="Service image"
          value={form.image}
          onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          aspect="aspect-video"
        />

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn btn-ghost rounded-lg" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary rounded-lg px-6 font-semibold" disabled={busy}>
            {busy && <span className="loading loading-spinner loading-xs" />}
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
