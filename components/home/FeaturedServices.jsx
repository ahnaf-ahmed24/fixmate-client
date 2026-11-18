"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ui/ServiceCard";
import { ServiceCardSkeletonGrid } from "@/components/ui/Skeletons";
import { toast } from "sonner";

/** Latest 6 approved services, straight from the server. */
export default function FeaturedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await api("/api/services/featured");
      if (res.ok) setServices(res.data || []);
      else toast.error(res.message);
      setLoading(false);
    })();
  }, []);

  return (
    <section className="container-page py-16">
      <SectionHeading
        eyebrow="Featured"
        title="Recently added repair services"
        subtitle="Hand-picked services from our top-rated, verified technicians — updated as they list new work."
      />
      {loading ? (
        <ServiceCardSkeletonGrid count={6} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </div>
      )}
      <div className="text-center mt-10">
        <Link href="/services" className="btn btn-outline btn-primary rounded-lg px-6 font-semibold">
          Browse all services <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
