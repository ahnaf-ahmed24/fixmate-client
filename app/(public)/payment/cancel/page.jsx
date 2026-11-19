"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Home, RotateCcw, XCircle } from "lucide-react";

function CancelContent() {
  const bookingId = useSearchParams().get("bookingId");

  return (
    <div className="max-w-lg mx-auto card bg-base-100 border border-base-300 shadow-xl">
      <div className="card-body items-center text-center p-8 gap-4">
        <span className="w-16 h-16 rounded-full bg-warning/10 text-warning grid place-items-center">
          <XCircle className="w-9 h-9" />
        </span>
        <h1 className="text-2xl font-extrabold">Payment cancelled</h1>
        <p className="text-sm text-base-content/60">
          No money has moved. You can pay anytime from your bookings page once the job is completed.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {bookingId && (
            <Link
              href="/dashboard/customer/bookings"
              className="btn btn-primary btn-sm rounded-lg font-semibold"
            >
              <RotateCcw className="w-4 h-4" /> Back to my bookings
            </Link>
          )}
          <Link href="/" className="btn btn-outline btn-sm rounded-lg font-semibold">
            <Home className="w-4 h-4" /> Back home
          </Link>
        </div>
      </div>
    </div>
  );
}


export default function PaymentCancelPage() {
  return (
    <div className="container-page py-16">
      <Suspense fallback={null}>
        <CancelContent />
      </Suspense>
    </div>
  );
}
