"use client";

import { useEffect, useState } from "react";
import { Banknote, CreditCard, Download, ReceiptText, Clock3 } from "lucide-react";
import { toast } from "sonner";
import RoleGate from "@/components/dashboard/RoleGate";
import PageHeader from "@/components/dashboard/PageHeader";
import { TableSkeleton, StatsSkeletonGrid } from "@/components/ui/Skeletons";
import StatsCard from "@/components/ui/StatsCard";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { formatDate, formatDateTime, formatPrice } from "@/lib/utils";


export default function CustomerPaymentsPage() {
  return (
    <RoleGate role="customer">
      <Inner />
    </RoleGate>
  );
}

function Inner() {
  const [payments, setPayments] = useState([]);
  const [due, setDue] = useState([]); // completed jobs waiting to be paid
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    (async () => {
      const [paymentsRes, bookingsRes] = await Promise.all([
        api("/api/payments/my"),
        api("/api/bookings/my"),
      ]);
      if (paymentsRes.ok) setPayments(paymentsRes.data || []);
      else toast.error(paymentsRes.message);
      if (bookingsRes.ok) {
        setDue(
          (bookingsRes.data || []).filter(
            (b) => b.status === "completed" && b.paymentStatus !== "paid"
          )
        );
      }
      setLoading(false);
    })();
  }, []);

  const totalSpent = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  async function payNow(booking) {
    setPayingId(booking._id);
    const res = await api("/api/payments/create-checkout-session", {
      method: "POST",
      body: { bookingId: booking._id },
    });
    setPayingId(null);
    if (res.ok && res.data?.url) {
      window.location.assign(res.data.url); // → Stripe Checkout, then back to /payment/success
    } else {
      toast.error(res.message || "Could not start checkout");
    }
  }

  async function downloadInvoice(p) {
    const { default: jsPDF } = await import("jspdf"); // lazy-load (keeps the bundle lean)
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const left = 56;
    let y = 72;

    doc.setFillColor(59, 108, 246);
    doc.rect(0, 0, 595, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("FixMate", left, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text("Smart device & home appliance repair", left, (y += 16));
    doc.text("support@fixmate.com · Dhaka, Bangladesh", left, (y += 14));

    y += 26;
    doc.setTextColor(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("PAYMENT INVOICE", left, y);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(110);
    doc.text(`Invoice date: ${formatDateTime(p.paidAt)}`, left, (y += 16));

    // Bill-to block
    y += 24;
    doc.setTextColor(20);
    doc.setFont("helvetica", "bold");
    doc.text("Billed to", left, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${p.customerName} (${p.customerEmail})`, left, (y += 15));

    // Details table
    y += 22;
    doc.setFillColor(240, 243, 250);
    doc.rect(left, y - 12, 483, 24, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Description", left + 8, y + 4);
    doc.text("Transaction", left + 300, y + 4);
    doc.text("Amount", left + 410, y + 4);

    doc.setFont("helvetica", "normal");
    doc.text(`Repair service: ${p.serviceTitle}`, left + 8, (y += 30));
    doc.text(`Technician: ${p.technicianName}`, left + 8, (y += 14));
    doc.setFontSize(9);
    doc.text(String(p.transactionId || "—").slice(0, 40), left + 300, (y += -14));
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 130, 76);
    doc.text(formatPrice(p.amount), left + 410, y + 14);

    // Total
    y += 48;
    doc.setTextColor(20);
    doc.setFontSize(12);
    doc.text("Total paid:", left + 300, y);
    doc.text(formatPrice(p.amount), left + 410, y);

    y += 40;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(130);
    doc.text(
      "Thank you for choosing FixMate. This invoice was generated from your FixMate account.",
      left,
      y
    );

    doc.save(`fixmate-invoice-${String(p.transactionId || p._id).slice(-8)}.pdf`);
    toast.success("Invoice PDF downloaded");
  }

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Pay for finished jobs, then track every Stripe payment and download invoices."
      />

      {loading ? (
        <>
          <StatsSkeletonGrid count={3} />
          <div className="mt-6">
            <TableSkeleton rows={4} cols={5} />
          </div>
        </>
      ) : (
        <>
          {/* --- Pay for a completed job --- */}
          {due.length > 0 && (
            <div className="card bg-base-100 border border-primary/30 shadow-sm mb-6">
              <div className="card-body p-5 gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
                    <CreditCard className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="font-bold leading-tight">Awaiting payment</h2>
                    <p className="text-xs text-base-content/55">
                      The technician closed these jobs — pay to release the receipt.
                    </p>
                  </div>
                </div>

                <ul className="divide-y divide-base-300">
                  {due.map((b) => (
                    <li key={b._id} className="flex flex-wrap items-center gap-3 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate">{b.serviceTitle}</p>
                        <p className="text-xs text-base-content/50">
                          {b.technicianName} · completed {formatDate(b.updatedAt || b.preferredDate)}
                        </p>
                      </div>
                      <p className="text-xl font-extrabold text-primary shrink-0">
                        {formatPrice(b.finalAmount)}
                      </p>
                      <button
                        onClick={() => payNow(b)}
                        disabled={payingId === b._id}
                        className="btn btn-primary btn-sm rounded-lg font-semibold shrink-0"
                      >
                        {payingId === b._id ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <CreditCard className="w-4 h-4" />
                        )}
                        Pay now
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-base-content/45">
                  You&apos;ll be redirected to Stripe Checkout (card, Apple Pay, Google Pay). No money
                  moves until the payment succeeds.
                </p>
              </div>
            </div>
          )}

          {payments.length === 0 ? (
            <EmptyState
              icon={ReceiptText}
              title="No payments yet"
              description={
                due.length > 0
                  ? "Pay the completed job above and your receipt will appear here."
                  : "When a technician completes a job, a Pay now button appears here and your receipt follows."
              }
              actionLabel="My bookings"
              actionHref="/dashboard/customer/bookings"
            />
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <StatsCard icon={Banknote} label="Total paid" value={formatPrice(totalSpent)} tone="success" />
                <StatsCard icon={ReceiptText} label="Transactions" value={payments.length} tone="primary" />
                <StatsCard
                  icon={Clock3}
                  label="Last payment"
                  value={formatDateTime(payments[0]?.paidAt)}
                  tone="secondary"
                />
              </div>

              <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body p-0">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr className="text-xs uppercase tracking-wider text-base-content/50">
                          <th>Service</th>
                          <th>Technician</th>
                          <th>Paid at</th>
                          <th>Transaction</th>
                          <th className="text-right">Amount</th>
                          <th className="text-right">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => (
                          <tr key={p._id} className="hover:bg-base-200/60">
                            <td className="font-semibold">{p.serviceTitle}</td>
                            <td>{p.technicianName}</td>
                            <td className="whitespace-nowrap">{formatDateTime(p.paidAt)}</td>
                            <td className="font-mono text-xs" title={p.transactionId}>
                              {String(p.transactionId || "—").slice(0, 18)}…
                            </td>
                            <td className="text-right font-bold text-success">{formatPrice(p.amount)}</td>
                            <td className="text-right">
                              <button
                                className="btn btn-ghost btn-xs rounded-lg text-primary font-semibold"
                                onClick={() => downloadInvoice(p)}
                              >
                                <Download className="w-3.5 h-3.5" /> PDF
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <p className="text-xs text-base-content/45 mt-3">
                Invoices are generated in your browser (jsPDF) from the server-verified payment records.
              </p>
            </>
          )}
        </>
      )}
    </>
  );
}
