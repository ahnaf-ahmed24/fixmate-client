"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  CalendarClock,
  CircleAlert,
  MapPin,
  Tag,
  UserRound,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { DetailsSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import RequestRepairModal from "./RequestRepairModal";
import Image from "next/image";


export default function ServiceDetails({ id }) {
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await api(`/api/services/${id}`);
      if (res.ok) setService(res.data);
      else {
        toast.error(res.message);
        setNotFound(true);
      }
    })();
  }, [id]);

  if (notFound) {
    return (
      <EmptyState
        icon={CircleAlert}
        title="Service not found"
        description="It may have been removed or is awaiting approval."
        actionLabel="Back to all services"
        actionHref="/services"
      />
    );
  }

  if (!service) return <DetailsSkeleton />;

  return (
    <div className="container-page py-10">
      <Link href="/services" className="btn btn-ghost btn-sm rounded-lg mb-5 -ml-2">
        <ArrowLeft className="w-4 h-4" /> All services
      </Link>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Main column */}
        <div className="space-y-6">
          <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
            <figure className="relative h-64 md:h-96 bg-base-200">
              <Image
                src={service.image}
                alt={service.title}
                fill
                loading="eager"
                sizes="(max-width: 1024px) 100vw, calc(100vw - 440px)"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.classList.add(
                    "bg-gradient-to-br", "from-primary/20", "via-secondary/10", "to-accent/20"
                  );
                }}
              />
            </figure>
            <div className="card-body p-5 md:p-7 gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge bg-primary/10 text-primary border border-primary/20 font-semibold">
                  <Tag className="w-3 h-3 mr-1" /> {service.category}
                </span>
                <span className="badge bg-secondary/10 text-secondary border border-secondary/20 font-semibold">
                  {service.serviceMode}
                </span>
                <span className="badge badge-outline border-base-300 text-base-content/60 font-semibold">
                  {service.approvalStatus === "approved" && <BadgeCheck className="w-3.5 h-3.5 mr-1 text-success" />}
                  Admin approved
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{service.title}</h1>

              <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
                <span className="flex items-center gap-1.5">
                  <UserRound className="w-4 h-4" /> {service.technicianName}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {service.serviceArea}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="w-4 h-4" /> {service.estimatedDuration}
                </span>
              </div>

              <hr className="border-base-300" />

              <h2 className="font-bold text-lg">About this service</h2>
              <p className="text-base-content/70 leading-relaxed whitespace-pre-line">{service.description}</p>
            </div>
          </div>

          {/* Technician summary card */}
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-5 md:p-7">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Wrench className="w-5 h-5 text-secondary" /> Meet your technician
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-base-200 grid place-items-center shrink-0 relative">
                  <span className="absolute inset-0 grid place-items-center text-xl font-extrabold text-primary">
                    {(service.technician?.name || "?")[0]}
                  </span>
                  {service.technician?.image && (
                    <Image
                      src={service.technician.image}
                      alt={service.technician.name}
                      fill
                      sizes="64px"
                      className="relative w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                </div>
                <div>
                  <p className="font-bold">{service.technician?.name}</p>
                  {service.technician?.area && (
                    <p className="text-sm text-base-content/60 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {service.technician.area}
                    </p>
                  )}
                  <p className="text-sm text-base-content/70 mt-2 leading-relaxed">
                    {service.technician?.bio || "This technician hasn't added a bio yet."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <aside className="lg:sticky lg:top-24 space-y-4">
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-6">
              <p className="text-xs uppercase font-bold tracking-wide text-base-content/50">Base price</p>
              <p className="text-4xl font-extrabold text-primary">{formatPrice(service.basePrice)}</p>
              <p className="text-xs text-base-content/50 mt-1">
                Final amount is confirmed by the technician when the job completes.
              </p>

              <button
                onClick={() => setModalOpen(true)}
                className="btn btn-primary w-full rounded-lg font-semibold mt-4"
                disabled={Boolean(user && user.role !== "customer")}
              >
                {user && user.role === "technician"
                  ? "Technicians can't book"
                  : user && user.role === "admin"
                    ? "Admins can't book"
                    : "Book Now"}
              </button>

              {user && user.role !== "customer" && (
                <p className="text-xs text-base-content/55 mt-2 flex items-start gap-1.5 bg-accent/10 border border-accent/25 rounded-lg p-2.5">
                  <CircleAlert className="w-3.5 h-3.5 mt-0.5 shrink-0 text-warning dark:text-accent" />
                  <span>
                    Repair requests can only be sent from a <span className="font-semibold">customer</span> account.
                  </span>
                </p>
              )}

              <ul className="mt-4 space-y-2 text-xs text-base-content/60">
                <li>✓ Verified technician, admin-approved listing</li>
                <li>✓ Live status timeline for your booking</li>
                <li>✓ Secure Stripe payment after completion</li>
              </ul>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-6 flex-row items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-accent/15 text-neutral dark:text-accent grid place-items-center shrink-0">
                <Banknote className="w-5 h-5" />
              </span>
              <p className="text-sm text-base-content/70">
                <span className="font-bold">Pay after completion.</span> No card needed to book.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <RequestRepairModal open={modalOpen} onClose={() => setModalOpen(false)} service={service} />
    </div>
  );
}
