"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CirclePlus, Info } from "lucide-react";
import { toast } from "sonner";
import RoleGate from "@/components/dashboard/RoleGate";
import PageHeader from "@/components/dashboard/PageHeader";
import ImageUpload from "@/components/ui/ImageUpload";
import { api } from "@/lib/api";
import { CATEGORIES, SERVICE_MODES, DASHBOARD_HOME } from "@/lib/constants";
import { useAuth } from "@/components/providers/AuthProvider";


export default function AddServicePage() {
  return (
    <RoleGate role="technician">
      <Inner />
    </RoleGate>
  );
}

function Inner() {
  const { user, dashboardHome } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    basePrice: "",
    estimatedDuration: "",
    serviceMode: "Home Visit",
    serviceArea: "",
  });
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const descLen = form.description.trim().length;

  async function submit(e) {
    e.preventDefault();

    if (descLen < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }
    if (!form.image) {
      toast.error("Please upload a service image (hosted on ImgBB)");
      return;
    }

    setBusy(true);
    const res = await api("/api/services", {
      method: "POST",
      body: {
        ...form,
        basePrice: Number(form.basePrice),
      },
    });
    setBusy(false);

    if (res.ok) {
      toast.success("Service submitted! It goes live once an admin approves it.");
      router.push(DASHBOARD_HOME.technician || dashboardHome(user));
    } else {
      toast.error(res.message || "Could not create the service");
    }
  }

  return (
    <>
      <PageHeader
        title="Add a Service"
        subtitle="List a repair service for customers to book. Admin approval is required before it goes live."
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <form onSubmit={submit} className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-5 md:p-7 gap-4">
            <div>
              <label htmlFor="as-title" className="label text-sm font-medium">Service title *</label>
              <input
                id="as-title"
                className="input input-bordered w-full rounded-lg"
                required
                maxLength={100}
                placeholder="e.g. iPhone screen replacement & battery service"
                value={form.title}
                onChange={set("title")}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="as-category" className="label text-sm font-medium">Category *</label>
                <select
                  id="as-category"
                  className="select select-bordered w-full rounded-lg"
                  required
                  value={form.category}
                  onChange={set("category")}
                >
                  <option value="" disabled>
                    Choose a category…
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="as-price" className="label text-sm font-medium">Base price (USD) *</label>
                <input
                  id="as-price"
                  type="number"
                  min="1"
                  step="0.5"
                  className="input input-bordered w-full rounded-lg"
                  required
                  placeholder="25"
                  value={form.basePrice}
                  onChange={set("basePrice")}
                />
              </div>
            </div>

            <div>
              <label htmlFor="as-desc" className="label text-sm font-medium">
                Description *{" "}
                <span className={`text-xs font-normal ${descLen >= 20 ? "text-success" : "text-base-content/50"}`}>
                  {descLen}/20 minimum
                </span>
              </label>
              <textarea
                id="as-desc"
                className="textarea textarea-bordered w-full rounded-lg min-h-28"
                required
                placeholder="What exactly is included, what devices you cover, warranties, etc."
                value={form.description}
                onChange={set("description")}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="as-duration" className="label text-sm font-medium">Estimated duration *</label>
                <input
                  id="as-duration"
                  className="input input-bordered w-full rounded-lg"
                  required
                  placeholder="e.g. 1–2 hours"
                  value={form.estimatedDuration}
                  onChange={set("estimatedDuration")}
                />
              </div>
              <div>
                <label htmlFor="as-mode" className="label text-sm font-medium">Service mode *</label>
                <select
                  id="as-mode"
                  className="select select-bordered w-full rounded-lg"
                  required
                  value={form.serviceMode}
                  onChange={set("serviceMode")}
                >
                  {SERVICE_MODES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="as-area" className="label text-sm font-medium">Service area *</label>
              <input
                id="as-area"
                className="input input-bordered w-full rounded-lg"
                required
                placeholder="e.g. Dhanmondi, Banani & nearby areas, Dhaka"
                value={form.serviceArea}
                onChange={set("serviceArea")}
              />
            </div>

            <ImageUpload
              label="Service image * (hosted on ImgBB)"
              value={form.image}
              onChange={(url) => setForm((f) => ({ ...f, image: url }))}
              aspect="aspect-video"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-ghost rounded-lg"
                onClick={() => router.back()}
                disabled={busy}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary rounded-lg px-6 font-semibold" disabled={busy}>
                {busy && <span className="loading loading-spinner loading-xs" />}
                <CirclePlus className="w-4 h-4" /> Submit for approval
              </button>
            </div>
          </div>
        </form>

        <aside className="card bg-base-100 border border-base-300 lg:sticky lg:top-24">
          <div className="card-body p-5">
            <h2 className="font-bold flex items-center gap-2">
              <Info className="w-4.5 h-4.5 text-info" /> How approval works
            </h2>
            <ol className="text-sm text-base-content/65 space-y-2.5 mt-2 list-decimal list-inside">
              <li>Submit the service — it starts as <span className="font-semibold">pending</span>.</li>
              <li>An admin reviews the listing for accuracy and safety.</li>
              <li>Once <span className="font-semibold text-success">approved</span>, customers can find it in search.</li>
              <li>You can toggle availability anytime from “My Services”.</li>
            </ol>
            <p className="text-xs text-base-content/50 mt-3 leading-relaxed">
              Tip: clear titles with the device name + specific work perform much better in search.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
