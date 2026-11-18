import Link from "next/link";
import {
  AirVent,
  Cpu,
  PlugZap,
  Refrigerator,
  Smartphone,
  Tv,
  WashingMachine,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { CATEGORIES } from "@/lib/constants";


const CATEGORY_ICONS = {
  Smartphone: Smartphone,
  "Laptop & PC": Cpu,
  AC: AirVent,
  Refrigerator: Refrigerator,
  TV: Tv,
  "Washing Machine": WashingMachine,
  Electrical: PlugZap,
};


export default function PopularCategories() {
  return (
    <section className="container-page py-16">
      <SectionHeading
        eyebrow="Categories"
        title="What needs fixing today?"
        subtitle="From pocket-sized phones to full-size refrigerators — pick a category to see available services."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICONS[c] || PlugZap;
          return (
            <Link
              key={c}
              href={`/services?category=${encodeURIComponent(c)}`}
              className="group card bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition-all p-5 items-center text-center"
            >
              <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 grid place-items-center text-primary group-hover:scale-105 transition-transform">
                <Icon className="w-7 h-7" />
              </span>
              <span className="mt-3 text-sm font-semibold leading-tight">{c}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
