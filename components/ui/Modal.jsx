"use client";

import { useEffect } from "react";
import { X } from "lucide-react";


export default function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative bg-base-100 rounded-2xl shadow-2xl w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[90dvh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-4 border-b border-base-300 sticky top-0 bg-base-100 z-10 rounded-t-2xl">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle" aria-label="Close">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}


export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", busy = false, danger = true }) {
  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title={title}>
      <p className="text-base-content/80">{message}</p>
      <div className="flex justify-end gap-2 mt-6">
        <button className="btn btn-ghost rounded-lg" onClick={onClose} disabled={busy}>
          Keep it
        </button>
        <button
          className={`btn rounded-lg ${danger ? "btn-error" : "btn-primary"}`}
          onClick={onConfirm}
          disabled={busy}
        >
          {busy && <span className="loading loading-spinner loading-xs" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
