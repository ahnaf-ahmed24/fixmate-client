import Link from "next/link";
import { ArrowRight } from "lucide-react";


export default function CtaBanner() {
  return (
    <section className="container-page py-16">
      <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary text-primary-content p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight max-w-xl text-balance">
            Need a technician right now? Get matched in minutes.
          </h2>
          <p className="mt-2 text-primary-content/85 max-w-lg">
            Create a free account and book from {">"}12 approved services across seven categories.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link href="/services" className="btn btn-neutral rounded-lg px-6 font-semibold">
            Browse services <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/sign-up"
            className="btn btn-outline rounded-lg px-6 font-semibold border-primary-content/40 text-primary-content hover:bg-primary-content/10 hover:border-primary-content"
          >
            Join free
          </Link>
        </div>
      </div>
    </section>
  );
}
