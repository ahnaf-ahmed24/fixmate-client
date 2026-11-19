"use client";

import { useEffect, useState } from "react";
import { Banknote, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import RoleGate from "@/components/dashboard/RoleGate";
import PageHeader from "@/components/dashboard/PageHeader";
import StatsCard from "@/components/ui/StatsCard";
import { TableSkeleton, StatsSkeletonGrid } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { formatDateTime, formatPrice } from "@/lib/utils";

/** Admin: every Stripe transaction + platform revenue. */
export default function AdminTransactionsPage() {
  return (
    <RoleGate role="admin">
      <Inner />
    </RoleGate>
  );
}

function Inner() {
  const [payments, setPayments] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await api("/api/admin/payments");
      if (res.ok) {
        setPayments(res.data || []);
        setRevenue(res.raw?.totalRevenue || 0);
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    })();
  }, []);

  const techSplit = {};
  for (const p of payments) {
    techSplit[p.technicianEmail] = (techSplit[p.technicianEmail] || 0) + (Number(p.amount) || 0);
  }
  const topTech = Object.entries(techSplit).sort((a, b) => b[1] - a[1])[0];

  return (
    <>
      <PageHeader title="Transactions" subtitle="All Stripe payments recorded on the platform." />

      {loading ? (
        <>
          <StatsSkeletonGrid count={3} />
          <div className="mt-6">
            <TableSkeleton rows={5} cols={6} />
          </div>
        </>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="No transactions yet"
          description="Payments appear here the moment a customer completes checkout."
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <StatsCard icon={Banknote} label="Platform revenue" value={formatPrice(revenue)} tone="success" />
            <StatsCard icon={ReceiptText} label="Transactions" value={payments.length} tone="primary" />
            <StatsCard
              icon={Banknote}
              label="Top technician"
              value={topTech ? formatPrice(topTech[1]) : "—"}
              hint={topTech ? topTech[0] : undefined}
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
                      <th>Customer</th>
                      <th>Technician</th>
                      <th>Paid at</th>
                      <th>Transaction</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p._id} className="hover:bg-base-200/60">
                        <td className="font-semibold">{p.serviceTitle}</td>
                        <td className="text-sm">{p.customerName}</td>
                        <td className="text-sm">{p.technicianName}</td>
                        <td className="whitespace-nowrap text-sm">{formatDateTime(p.paidAt)}</td>
                        <td className="font-mono text-xs" title={p.transactionId}>
                          {String(p.transactionId || "—").slice(0, 18)}…
                        </td>
                        <td className="text-right font-bold text-success">{formatPrice(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
