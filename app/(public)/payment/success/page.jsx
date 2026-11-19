"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle2, CircleAlert, Home, ReceiptText } from "lucide-react";
import { api } from "@/lib/api";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";

// Stripe can still report a just-completed session as "unpaid" for a moment
// after the redirect, so re-check a few times before declaring failure.
const MAX_VERIFY_ATTEMPTS = 6;
const VERIFY_RETRY_DELAY = 1500;

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { user, loading, dashboardHome } = useAuth();
  const [payment, setPayment] = useState(null);
  const [state, setState] = useState("verifying"); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!sessionId) {
      setState("error");
      setMessage("Missing Stripe session id in the URL.");
      return;
    }
    if (!user) {
      setState("error");
      setMessage("You must be signed in as the paying customer to verify this payment.");
      return;
    }

    let cancelled = false;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      for (let attempt = 1; attempt <= MAX_VERIFY_ATTEMPTS; attempt++) {
        const res = await api(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`);
        if (cancelled) return;

        if (res.ok) {
          // api() unwraps body.data as res.data, so read the envelope (paid/status) from res.raw.
          const body = res.raw || {};
          if (body.paid) {
            setPayment(body.data);
            setState("ok");
            return;
          }
          // Stripe hasn't caught up yet — give it a moment and ask again.
          if (attempt < MAX_VERIFY_ATTEMPTS) {
            await wait(VERIFY_RETRY_DELAY);
            if (cancelled) return;
            continue;
          }
          setState("unpaid");
          setMessage(
            `Stripe reports this payment as “${body.status || "pending"}”. Refresh after your bank confirms.`
          );
          return;
        }

        setState("error");
        setMessage(res.message || "Verification failed");
        return;
      }
    })();

    return () => { cancelled = true; };
  }, [loading, user, sessionId]);

  return (
    <div className="max-w-lg mx-auto">
      <div className="card bg-base-100 border border-base-300 shadow-xl">
        <div className="card-body items-center text-center p-8 gap-4">
          {state === "verifying" && (
            <>
              <span className="loading loading-spinner loading-lg text-primary" />
              <h1 className="text-xl font-extrabold">Verifying your payment…</h1>
              <p className="text-sm text-base-content/60">Checking securely with Stripe. Don&apos;t close this page.</p>
            </>
          )}

          {state === "ok" && payment && (
            <>
              <span className="w-16 h-16 rounded-full bg-success/10 text-success grid place-items-center">
                <CheckCircle2 className="w-9 h-9" />
              </span>
              <h1 className="text-2xl font-extrabold">Payment successful!</h1>
              <p className="text-sm text-base-content/60">Your repair is officially paid. A receipt is in your dashboard.</p>

              <div className="w-full rounded-xl border border-base-300 bg-base-200/60 p-4 text-left text-sm space-y-2 mt-2">
                <Row label="Service" value={payment.serviceTitle} />
                <Row label="Technician" value={payment.technicianName} />
                <Row label="Amount paid" value={formatPrice(payment.amount)} strong />
                <Row label="Transaction ID" value={payment.transactionId} mono />
                <Row label="Paid at" value={formatDateTime(payment.paidAt)} />
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Link href="/dashboard/customer/payments" className="btn btn-primary btn-sm rounded-lg font-semibold">
                  <ReceiptText className="w-4 h-4" /> View receipts
                </Link>
                <Link href={dashboardHome(user)} className="btn btn-outline btn-sm rounded-lg font-semibold">
                  <Home className="w-4 h-4" /> Dashboard
                </Link>
              </div>
            </>
          )}

          {(state === "unpaid" || state === "error") && (
            <>
              <span className="w-16 h-16 rounded-full bg-error/10 text-error grid place-items-center">
                <CircleAlert className="w-9 h-9" />
              </span>
              <h1 className="text-2xl font-extrabold">
                {state === "unpaid" ? "Payment not confirmed yet" : "Verification failed"}
              </h1>
              <p className="text-sm text-base-content/60">{message}</p>
              <div className="flex gap-2 mt-2">
                <button className="btn btn-outline btn-sm rounded-lg" onClick={() => window.location.reload()}>
                  Try again
                </button>
                <Link href="/" className="btn btn-primary btn-sm rounded-lg font-semibold">
                  <Home className="w-4 h-4" /> Back home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono = false, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-base-content/55 shrink-0">{label}</span>
      <span
        className={`text-right truncate ${mono ? "font-mono text-xs" : ""} ${strong ? "font-bold text-success" : "font-semibold"}`}
        title={typeof value === "string" ? value : undefined}
      >
        {value}
      </span>
    </div>
  );
}


export default function PaymentSuccessPage() {
  return (
    <div className="container-page py-16">
      <Suspense fallback={null}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
