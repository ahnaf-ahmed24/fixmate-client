import SectionHeading from "@/components/ui/SectionHeading";
import { CalendarCheck, ClipboardCheck, SearchCheck, Wallet } from "lucide-react";

const STEPS = [
  {
    icon: SearchCheck,
    title: "Find a service",
    text: "Search and filter our catalog by category, price or service mode — every listing is admin-approved.",
  },
  {
    icon: CalendarCheck,
    title: "Send a repair request",
    text: "Pick a date, describe the problem and share your address. The technician is notified instantly.",
  },
  {
    icon: ClipboardCheck,
    title: "Track the job live",
    text: "Follow the request move from Accepted to In Progress with a transparent status timeline.",
  },
  {
    icon: Wallet,
    title: "Pay when it's done",
    text: "The technician closes the job with the final amount, then you pay securely via Stripe.",
  },
];


export default function HowItWorks() {
  return (
    <section className="bg-base-200/60 border-y border-base-300">
      <div className="container-page py-16">
        <SectionHeading
          eyebrow="How it works"
          title="From broken to fixed in four steps"
          subtitle="No phone tag, no surprise invoices — one platform runs the whole repair journey."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="relative card bg-base-100 border border-base-300 p-6 hover:shadow-md transition-shadow"
            >
              <span className="absolute top-4 right-5 text-5xl font-extrabold text-primary/10 select-none">
                {i + 1}
              </span>
              <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <s.icon className="w-5.5 h-5.5" />
              </span>
              <h3 className="font-bold mt-4">{s.title}</h3>
              <p className="text-sm text-base-content/60 mt-1.5 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
