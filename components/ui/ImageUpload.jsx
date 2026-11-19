"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { uploadToImgbb } from "@/lib/upload";


export default function ImageUpload({ value, onChange, label = "Photo", aspect = "aspect-square", accept = "image/*" }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const url = await uploadToImgbb(file);
      if (!url) throw new Error("Upload failed — check your ImgBB key");
      onChange(url);
    } catch (e) {
      setError(e?.message || "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <span className="label text-sm font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <div
          className={`${aspect} w-24 rounded-xl border-2 border-dashed border-base-300 bg-base-200 overflow-hidden grid place-items-center shrink-0`}
        >
          {busy ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          ) : value ? (
            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          ) : (
            <ImagePlus className="w-6 h-6 text-base-content/40" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <button
            type="button"
            className="btn btn-outline btn-sm rounded-lg"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="w-4 h-4" /> {value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              className="btn btn-ghost btn-sm text-error rounded-lg"
              onClick={() => onChange("")}
            >
              <Trash2 className="w-4 h-4" /> Remove
            </button>
          )}
          <p className="text-[11px] text-base-content/50">JPG/PNG/WebP · max 5 MB · hosted on ImgBB</p>
          {error && <p className="text-[11px] text-error font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
}
