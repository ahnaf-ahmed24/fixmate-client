"use client";

import { useEffect, useState } from "react";
import { CircleAlert, Save, UserRoundCog } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/PageHeader";
import ImageUpload from "@/components/ui/ImageUpload";
import { RoleBadge } from "@/components/ui/Badges";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatDate } from "@/lib/utils";
import Image from "next/image";


export default function ProfilePage() {
  const { user, loading, applyUserUpdate } = useAuth();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        area: user.area || "",
        bio: user.bio || "",
        image: user.image || "",
      });
    }
  }, [user]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setNameError("Name is required");
      return;
    }
    setNameError("");
    setBusy(true);
    const res = await api("/api/users/profile", { method: "PATCH", body: form });
    setBusy(false);
    if (res.ok) {
      toast.success(res.message || "Profile updated");
      // Live-update navbar + cached user.
      applyUserUpdate({
        name: res.data.name,
        phone: res.data.phone,
        area: res.data.area,
        bio: res.data.bio,
        image: res.data.image,
      });
    } else {
      toast.error(res.message || "Update failed");
    }
  }

  if (loading || !form) {
    return (
      <div className="grid place-items-center py-24">
        <span className="loading loading-dots loading-md text-primary" />
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Update Profile" subtitle="Keep your details current so technicians and customers can reach you." />

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <form onSubmit={submit} className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-5 md:p-7 gap-4">
            <ImageUpload
              label="Profile photo (hosted on ImgBB)"
              value={form.image}
              onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pf-name" className="label text-sm font-medium">Full name *</label>
                <input
                  id="pf-name"
                  className={`input input-bordered w-full rounded-lg ${nameError ? "input-error" : ""}`}
                  required
                  value={form.name}
                  onChange={set("name")}
                />
                {nameError && (
                  <p className="text-xs text-error mt-1 flex items-center gap-1">
                    <CircleAlert className="w-3 h-3" /> {nameError}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="pf-email" className="label text-sm font-medium">Email (read-only)</label>
                <input
                  id="pf-email"
                  className="input input-bordered w-full rounded-lg bg-base-200/70 text-base-content/50"
                  value={user.email}
                  disabled
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pf-phone" className="label text-sm font-medium">Phone</label>
                <input
                  id="pf-phone"
                  className="input input-bordered w-full rounded-lg"
                  placeholder="+8801XXXXXXXXX"
                  value={form.phone}
                  onChange={set("phone")}
                />
              </div>
              <div>
                <label htmlFor="pf-area" className="label text-sm font-medium">Area / Location</label>
                <input
                  id="pf-area"
                  className="input input-bordered w-full rounded-lg"
                  placeholder="e.g. Dhanmondi, Dhaka"
                  value={form.area}
                  onChange={set("area")}
                />
              </div>
            </div>

            <div>
              <label htmlFor="pf-bio" className="label text-sm font-medium">
                Bio <span className="text-xs font-normal text-base-content/50">{(form.bio || "").length}/600</span>
              </label>
              <textarea
                id="pf-bio"
                className="textarea textarea-bordered w-full rounded-lg min-h-24"
                maxLength={600}
                placeholder={
                  user.role === "technician"
                    ? "Your experience, specialties and certifications — shown on your service pages."
                    : "A little about you (optional)."
                }
                value={form.bio}
                onChange={set("bio")}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="btn btn-primary rounded-lg px-6 font-semibold" disabled={busy}>
                {busy ? <span className="loading loading-spinner loading-xs" /> : <Save className="w-4 h-4" />}
                Save changes
              </button>
            </div>
          </div>
        </form>


        <aside className="card bg-base-100 border border-base-300 lg:sticky lg:top-24">
          <div className="card-body p-5">
            <h2 className="font-bold flex items-center gap-2 mb-2">
              <UserRoundCog className="w-4.5 h-4.5 text-primary" /> Account
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-14 h-14 rounded-2xl overflow-hidden bg-primary/10 text-primary grid place-items-center text-xl font-extrabold shrink-0">
                {form.image ? (
                  <Image src={form.image} alt="" width={56} height={56} className="w-full h-full object-cover" />
                ) : (
                  (user.name || "?")[0].toUpperCase()
                )}
              </span>
              <div className="min-w-0">
                <p className="font-bold truncate">{user.name}</p>
                <div className="mt-1">
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>
            <dl className="text-sm space-y-2.5">
              <div className="flex justify-between gap-3">
                <dt className="text-base-content/50">Role</dt>
                <dd className="font-semibold capitalize">{user.role}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-base-content/50">Member since</dt>
                <dd className="font-semibold">{formatDate(user.createdAt || new Date())}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-base-content/50">Sign-in</dt>
                <dd className="font-semibold">Email &amp; password</dd>
              </div>
            </dl>
            <p className="text-[11px] text-base-content/45 mt-4 leading-relaxed">
              Email addresses and roles can only be changed by an admin (Manage Users).
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
