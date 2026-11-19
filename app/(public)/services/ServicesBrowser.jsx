"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { CATEGORIES, SERVICE_MODES, SORT_OPTIONS } from "@/lib/constants";
import { debounce } from "@/lib/utils";
import ServiceCard from "@/components/ui/ServiceCard";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { ServiceCardSkeletonGrid } from "@/components/ui/Skeletons";

const ALL = "all";


export default function ServicesBrowser() {
  const router = useRouter();
  const params = useSearchParams();

  const search = params.get("search") || "";
  const category = params.get("category") || ALL;
  const serviceMode = params.get("serviceMode") || ALL;
  const sort = params.get("sort") || "newest";
  const page = Math.max(parseInt(params.get("page"), 10) || 1, 1);

  const [searchInput, setSearchInput] = useState(search);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Keep the input in sync when the user arrives via hero/footer links.
  useEffect(() => setSearchInput(search), [search]);

  const pushParams = useCallback(
    (patch, { resetPage = true } = {}) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        const empty = value === "" || value === ALL || value == null;
        if (empty) next.delete(key);
        else next.set(key, value);
      }
      if (resetPage) next.delete("page");
      router.push(`/services${next.toString() ? `?${next}` : ""}`, { scroll: false });
    },
    [params, router]
  );


  const debouncedSearch = useRef(null);
  useEffect(() => {
    debouncedSearch.current = debounce((value) => pushParams({ search: value }), 500);
  }, [pushParams]);

  
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const qs = new URLSearchParams();
      if (search.trim()) qs.set("search", search.trim());
      if (category !== ALL) qs.set("category", category);
      if (serviceMode !== ALL) qs.set("serviceMode", serviceMode);
      if (sort !== "newest") qs.set("sort", sort);
      qs.set("page", String(page));
      qs.set("limit", "9");

      const res = await api(`/api/services?${qs}`);
      if (cancelled) return;
      if (res.ok) setData(res);
      else {
        toast.error(res.message);
        setData({ data: [], total: 0, totalPages: 1 });
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [search, category, serviceMode, sort, page]);

  const services = data?.data || [];
  const meta = data?.raw || {};
  const hasFilters = search.trim() || category !== ALL || serviceMode !== ALL;

  return (
    <div className="container-page py-10">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Browse repair services</h1>
        <p className="mt-2 text-base-content/60">
          Searching, filtering, sorting and paging are done on the server — try it out.
        </p>
      </div>


      <div className="card bg-base-100 border border-base-300 shadow-sm p-4 mb-6 grid gap-3">
        <label className="input input-bordered rounded-lg flex items-center gap-2 w-full bg-base-200/50">
          <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              debouncedSearch.current(e.target.value);
            }}
            placeholder="Search by title or category…"
            className="grow bg-transparent focus:outline-none"
            aria-label="Search services"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <select
            className="select select-bordered rounded-lg bg-base-200/50 font-medium"
            value={category}
            onChange={(e) => pushParams({ category: e.target.value })}
            aria-label="Filter by category"
          >
            <option value={ALL}>All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered rounded-lg bg-base-200/50 font-medium"
            value={serviceMode}
            onChange={(e) => pushParams({ serviceMode: e.target.value })}
            aria-label="Filter by service mode"
          >
            <option value={ALL}>Any mode</option>
            {SERVICE_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered rounded-lg bg-base-200/50 font-medium"
            value={sort}
            onChange={(e) => pushParams({ sort: e.target.value })}
            aria-label="Sort results"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <ServiceCardSkeletonGrid count={6} />
      ) : services.length === 0 ? (
        <EmptyState
          icon={hasFilters ? SearchX : SlidersHorizontal}
          title={hasFilters ? "No services match your filters" : "No services yet"}
          description={
            hasFilters
              ? "Try a different keyword, category or service mode."
              : "Approved services will appear here as technicians list them."
          }
          actionLabel={hasFilters ? "Clear all filters" : undefined}
          actionHref={hasFilters ? "/services" : undefined}
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
          <Pagination
            page={meta.page || page}
            totalPages={meta.totalPages || 1}
            total={meta.total || 0}
            onPage={(p) => pushParams({ page: String(p) }, { resetPage: false })}
          />
        </>
      )}
    </div>
  );
}
