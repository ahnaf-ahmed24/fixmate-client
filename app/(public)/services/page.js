import { Suspense } from "react";
import ServicesBrowser from "./ServicesBrowser";
import { ServiceCardSkeletonGrid } from "@/components/ui/Skeletons";

export const metadata = { title: "Browse Services — FixMate" };


export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-10">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Browse repair services</h1>
          </div>
          <ServiceCardSkeletonGrid count={6} />
        </div>
      }
    >
      <ServicesBrowser />
    </Suspense>
  );
}
