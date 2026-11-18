import SectionHeading from "@/components/ui/SectionHeading";
import {
  BadgeDollarSign,
  Handshake,
  LineChart,
  ShieldCheck,
  Star,
  ThumbsUp,
} from "lucide-react";

const PERKS = [
  {
    icon: ShieldCheck,
    title: "Verified technicians",
    text: "Every service is reviewed and approved by our admin team before it goes live.",
  },
  {
    icon: BadgeDollarSign,
    title: "Upfront pricing",
    text: "See the base price before you book — the final amount is agreed when the job closes.",
  },
  {
    icon: LineChart,
    title: "Live job timeline",
    text: "Watch your request move from Requested to Completed, with every step timestamped.",
  },
  {
    icon: Handshake,
    title: "Pay after completion",
    text: "Money only moves once the work is done and you're happy, secured by Stripe.",
  },
];

const STATS = [
  { value: "2,400+", label: "Devices repaired" },
  { value: "98%", label: "Fixed on first visit" },
  { value: "30 min", label: "Average response" },
  { value: "4.9/5", label: "Customer rating" },
];

const TESTIMONIALS = [
  {
    name: "Farhana Rahman",
    role: "Customer",
    text: "My AC died in the middle of summer. Booked at 9am, fixed by 2pm — and I could see every status update on my dashboard. Never calling a random repairman again.",
  },
  {
    name: "Imran Hossain",
    role: "Customer",
    text: "The timeline tracker is brilliant. I always knew exactly where my laptop repair stood, and paying online after completion felt completely safe.",
  },
  {
    name: "Shirin Akter",
    role: "Customer",
    text: "Transparent pricing was the winner for me. The base price I saw while browsing was exactly what I expected to pay. Highly recommended.",
  },
];


export default function WhyChooseUs() {
  return (
    <section className="bg-base-200/60 border-y border-base-300">
      <div className="container-page py-16">
        <SectionHeading
          eyebrow="Why FixMate"
          title="Repair day, minus the stress"
          subtitle="We built FixMate around the three things customers care about: trust, transparency and speed."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {PERKS.map((p) => (
            <div key={p.title} className="card bg-base-100 border border-base-300 p-6 hover:shadow-md transition-shadow">
              <span className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary grid place-items-center">
                <p.icon className="w-5.5 h-5.5" />
              </span>
              <h3 className="font-bold mt-4">{p.title}</h3>
              <p className="text-sm text-base-content/60 mt-1.5 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14 rounded-2xl border border-base-300 bg-base-100 p-6 md:p-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-primary">{s.value}</p>
              <p className="text-sm text-base-content/55 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card bg-base-100 border border-base-300 p-6">
              <div className="flex text-warning dark:text-accent gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-sm text-base-content/75 leading-relaxed mt-3">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-primary/10 text-primary grid place-items-center font-bold text-sm">
                  {t.name[0]}
                </span>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-base-content/50">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
