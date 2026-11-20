import Link from "next/link";
import {
  ArrowRight,
  Globe,
  HeartHandshake,
  Layers,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import StatsCard from "@/components/ui/StatsCard";
import SmartImage from "@/components/ui/SmartImage";

export const metadata = { title: "About Us — FixMate" };

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust first",
    text: "Every technician listing passes a manual admin review before customers can ever see it.",
  },
  {
    icon: HeartHandshake,
    title: "Fair & transparent",
    text: "Prices are published upfront. The final bill is agreed with you when the job closes — never after.",
  },
  {
    icon: Target,
    title: "Craftsmanship",
    text: "We track first-visit fix rates and customer ratings, and technicians are rated on both.",
  },
  {
    icon: Layers,
    title: "One platform",
    text: "Booking, live job timeline, payment and invoice history — all in one dashboard, no phone tag.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-12">
      {/* Intro */}
      <div className="grid lg:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            About FixMate
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-balance">
            The repair service we wished existed
          </h1>
          <p className="mt-5 text-lg text-base-content/65 leading-relaxed">
            FixMate started with a simple frustration: getting a phone, laptop or air conditioner
            fixed meant chasing strangers through classifieds, with no idea who was coming, what it
            would cost, or whether the job was actually done.
          </p>
          <p className="mt-4 text-base-content/70 leading-relaxed">
            We built the alternative — a marketplace where every technician is verified, every
            price is published, every job is tracked in a live timeline, and payment only happens
            after completion. Today FixMate covers seven device categories and keeps growing.
          </p>
          <Link href="/services" className="btn btn-primary rounded-lg px-6 font-semibold mt-7">
            Explore our services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-tr from-secondary/15 via-transparent to-primary/15 rounded-[2.5rem] blur-2xl" aria-hidden="true" />
          <div className="relative rounded-[2rem] border border-base-300 shadow-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20">
            <SmartImage
              src="https://images.pexels.com/photos/31718639/pexels-photo-31718639.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="FixMate technician at work"
              width={1200}
              height={800}
              loading="eager"
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mission numbers */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        <StatsCard icon={UsersRound} label="Users onboard" value="3,200+" tone="primary" />
        <StatsCard icon={Globe} label="Areas covered" value="Dhaka + 6 cities" tone="secondary" />
        <StatsCard icon={Layers} label="Device categories" value="7" tone="accent" />
        <StatsCard icon={Target} label="First-visit fix rate" value="98%" tone="success" />
      </div>

      {/* Values */}
      <div className="mb-16">
        <SectionHeading
          eyebrow="Our values"
          title="What we hold ourselves to"
          align="left"
        />
        <div className="grid sm:grid-cols-2 gap-5">
          {VALUES.map((v) => (
            <div key={v.title} className="card bg-base-100 border border-base-300 p-6 hover:shadow-md transition-shadow">
              <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <v.icon className="w-5.5 h-5.5" />
              </span>
              <h3 className="font-bold mt-4">{v.title}</h3>
              <p className="text-sm text-base-content/60 mt-1.5 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Project note */}
      <div className="rounded-2xl border border-base-300 bg-base-200/60 p-6 md:p-8">
        <h2 className="font-bold text-lg">Built for learning, engineered like production</h2>
        <p className="text-sm text-base-content/65 mt-2 max-w-3xl leading-relaxed">
          FixMate is a full-stack capstone project: a Next.js App Router client and an Express REST
          API backed by MongoDB, with BetterAuth-issued JWTs, role-based access control, a
          server-enforced job status pipeline and an idempotent Stripe payment flow.
        </p>
      </div>
    </div>
  );
}
