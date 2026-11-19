import { ServiceCardSkeletonGrid } from "@/components/ui/Skeletons";


export default function ServicesLoading() {
  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Browse repair services</h1>
        <p className="mt-2 text-base-content/60 w-72 h-4 rounded bg-base-300/60 animate-pulse" />
      </div>
      <div className="card bg-base-100 border border-base-300 shadow-sm p-4 mb-6 h-20 animate-pulse bg-base-100" />
      <ServiceCardSkeletonGrid count={6} />
    </div>
  );
}
