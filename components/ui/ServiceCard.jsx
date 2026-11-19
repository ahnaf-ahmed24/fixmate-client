"use client";

import Link from "next/link";
import { MapPin, UserRound } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";


function handleImgError(e) {
  const el = e.currentTarget;
  el.style.display = "none";
  el.parentElement?.classList?.add("bg-gradient-to-br", "from-primary/20", "via-secondary/10", "to-accent/20");
}


export default function ServiceCard({ service }) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col">
      <figure className="relative h-44 overflow-hidden rounded-t-[1rem] bg-base-200">
        <Image
          src={service.image}
          alt={service.title}
          loading="lazy"
          onError={handleImgError}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge badge-sm bg-base-100/90 backdrop-blur text-base-content border-0 font-semibold">
            {service.category}
          </span>
        </div>
        <span className="badge badge-sm absolute top-3 right-3 bg-accent text-accent-content border-0 font-semibold">
          {service.serviceMode}
        </span>
      </figure>

      <div className="card-body p-4 gap-2 flex-1">
        <h3 className="font-bold text-base leading-snug clamp-2 min-h-[2.75rem]">{service.title}</h3>

        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <UserRound className="w-4 h-4 shrink-0" />
          <span className="truncate">{service.technicianName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{service.serviceArea}</span>
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-base-content/50 font-semibold">Starting at</p>
            <p className="text-lg font-extrabold text-primary">{formatPrice(service.basePrice)}</p>
          </div>
          <Link
            href={`/services/${service._id}`}
            className="btn btn-primary btn-sm rounded-lg px-4"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
