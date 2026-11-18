"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ShieldCheck, Timer, Wrench } from "lucide-react";


export default function Hero() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/services?search=${encodeURIComponent(term)}` : "/services");
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
      <div className="container-page grid lg:grid-cols-2 gap-10 items-center py-14 md:py-20">
        <div>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-base-100 border border-base-300 shadow-sm text-xs font-bold uppercase tracking-wider text-primary mb-5">
            <ShieldCheck className="w-3.5 h-3.5" /> Certified technicians near you
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance">
            Broken gadget?{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FixMate
            </span>{" "}
            fixes it today.
          </h1>
          <p className="mt-5 text-lg text-base-content/65 max-w-xl leading-relaxed">
            Book trusted repair pros for smartphones, laptops, ACs, refrigerators, TVs and more.
            Transparent pricing, live job tracking and a full service history on every repair.
          </p>

          <form onSubmit={submit} className="mt-7 flex max-w-lg bg-base-100 border border-base-300 rounded-xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/40">
            <label htmlFor="hero-search" className="sr-only">
              Search repair services
            </label>
            <span className="grid place-items-center pl-4 text-base-content/40">
              <Search className="w-4.5 h-4.5" />
            </span>
            <input
              id="hero-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try “iPhone screen repair” or “AC servicing”…"
              className="input input-ghost w-full focus:outline-none"
            />
            <button type="submit" className="btn btn-primary rounded-none rounded-l-none m-1 rounded-lg px-5">
              Search
            </button>
          </form>

          <div className="mt-7 flex flex-wrap items-center gap-6 text-sm text-base-content/60">
            <span className="flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-secondary" /> 12+ approved services
            </span>
            <span className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-secondary" /> Same-day booking
            </span>
          </div>
        </div>

      
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-tr from-primary/15 via-transparent to-secondary/15 rounded-[2.5rem] blur-2xl" aria-hidden="true" />
          <div className="relative rounded-[2rem] border border-base-300 shadow-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20">
            <img
              src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80"
              alt="Technician repairing a device"
              className="w-full h-[300px] md:h-[420px] object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
  
          <div className="absolute -bottom-4 left-6 md:left-10 card bg-base-100 border border-base-300 shadow-xl px-4 py-3">
            <p className="text-[11px] uppercase font-bold tracking-wide text-base-content/50">Repairs from</p>
            <p className="text-xl font-extrabold text-primary">
              $15 <span className="text-xs font-semibold text-base-content/50">· no hidden fees</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
