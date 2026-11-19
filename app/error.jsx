"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";


export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("[FixMate] Unhandled UI error:", error);
  }, [error]);

  return (
    <div className="min-h-[70dvh] grid place-items-center px-4 py-16">
      <div className="text-center max-w-md">
        <span className="mx-auto w-16 h-16 rounded-2xl bg-error/10 text-error grid place-items-center mb-5">
          <TriangleAlert className="w-8 h-8" />
        </span>
        <p className="text-6xl font-extrabold tracking-tight text-error">Oops</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Something broke on our side</h1>
        <p className="mt-3 text-sm text-base-content/60">
          {error?.message || "An unexpected error occurred while rendering this page."}
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <button onClick={reset} className="btn btn-primary rounded-lg px-6 font-semibold">
            <RotateCcw className="w-4 h-4" /> Try again
          </button>
          <Link href="/" className="btn btn-outline rounded-lg px-6 font-semibold">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
