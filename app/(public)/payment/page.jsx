"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, CreditCard, LogIn, ReceiptText, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

const STEPS = [
  {
    icon: ClipboardList,
    title: "1. Book a repair",
    text: "Send a request from any service page and the technician accepts it.",
  },
  {
    icon: CreditCard,
    title: "2. Pay when the job is done",
    text: "Once the technician closes the job, a Pay now button appears on your bookings and payments pages.",
  },
  {
    icon: ReceiptText,
    title: "3. Get your receipt",
    text: "Stripe Checkout takes the payment, then the invoice lands in your payment history as a PDF.",
  },
];

export default function PaymentLandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="container-page py-14 md:py-20">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-primary/10 text-primary border border-primary/25">
          <ShieldCheck className="w-4 h-4" /> Secured by Stripe
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-4">Payments</h1>
        <p className="text-base-content/60 mt-3 max-w-xl mx-auto">
          You only pay after the repair is finished. Here is exactly where to make a payment and
          where every receipt lives.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-10 max-w-3xl mx-auto">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="card bg-base-100 border border-base-300 shadow-sm text-left">
              <div className="card-body p-5 gap-2">
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                  <Icon className="w-5 h-5" />
                </span>
                <h2 className="font-bold text-sm mt-1">{s.title}</h2>
                <p className="text-xs text-base-content/60">{s.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto mt-8 card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body items-center text-center gap-3 p-6">
          <h2 className="font-extrabold text-lg">Where do I pay?</h2>
          <p className="text-sm text-base-content/60 max-w-md">
            {loading
              ? "Checking your session…"
              : user
                ? `Signed in as ${user.email}. Open your payments page to pay for finished jobs and download invoices.`
                : "Sign in as a customer, then open the payments page from the sidebar."}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {user ? (
              <>
                <Link href="/dashboard/customer/payments" className="btn btn-primary btn-sm rounded-lg font-semibold">
                  <CreditCard className="w-4 h-4" /> Go to my payments <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/dashboard/customer/bookings" className="btn btn-outline btn-sm rounded-lg font-semibold">
                  <ClipboardList className="w-4 h-4" /> My bookings
                </Link>
              </>
            ) : (
              <Link href="/sign-in?redirect=/dashboard/customer/payments" className="btn btn-primary btn-sm rounded-lg font-semibold">
                <LogIn className="w-4 h-4" /> Sign in to pay
              </Link>
            )}
            <Link href="/services" className="btn btn-ghost btn-sm rounded-lg font-semibold">
              Browse services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
