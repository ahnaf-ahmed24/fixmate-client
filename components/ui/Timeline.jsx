"use client";

import { CheckCircle2, CircleDashed, XCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";


const PIPELINE = ["requested", "accepted", "in-progress", "completed", "paid"];

const DOT = {
  requested: "bg-blue-500",
  accepted: "bg-indigo-500",
  "in-progress": "bg-amber-500",
  completed: "bg-emerald-500",
  paid: "bg-cyan-500",
  rejected: "bg-rose-500",
  cancelled: "bg-slate-400",
};

export default function Timeline({ history = [], status }) {
  const entries = [...history].sort(
    (a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
  );
  const reached = new Set(entries.map((e) => e.status));
  const isFailed = status === "rejected" || status === "cancelled";

  const steps = isFailed
    ? [...PIPELINE.map((s) => ({ status: s, done: reached.has(s), at: entries.find((e) => e.status === s)?.changedAt })), { status, done: true, at: entries.find((e) => e.status === status)?.changedAt }]
    : PIPELINE.map((s) => ({ status: s, done: reached.has(s), at: entries.find((e) => e.status === s)?.changedAt }));

  return (
    <ul className="steps steps-vertical lg:steps-horizontal w-full">
      {steps.map((step) => {
        const done = step.done;
        const live = done && step.status === status;
        return (
          <li key={step.status} className={`step ${done ? "step-primary" : ""} flex-1`}>
            <div className="flex flex-col items-start gap-0.5">
              <span className={`text-sm font-semibold ${live ? "" : done ? "text-base-content/80" : "text-base-content/40"}`}>
                {label(step.status)}
              </span>
              <span className="text-[11px] text-base-content/50">
                {step.at ? formatDateTime(step.at) : done ? "—" : "Pending"}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function label(s) {
  return (
    {
      requested: "Requested",
      accepted: "Accepted",
      "in-progress": "In Progress",
      completed: "Completed",
      paid: "Paid",
      rejected: "Rejected",
      cancelled: "Cancelled",
    }[s] || s
  );
}
