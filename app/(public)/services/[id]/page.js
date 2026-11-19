import { Suspense } from "react";
import ServiceDetails from "./Details";
import { DetailsSkeleton } from "@/components/ui/Skeletons";

export const metadata = { title: "Service Details — FixMate" };


export default function ServiceDetailsPage({ params }) {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <IdReader params={params} />
    </Suspense>
  );
}

async function IdReader({ params }) {
  const { id } = await params;
  return <ServiceDetails id={id} />;
}
