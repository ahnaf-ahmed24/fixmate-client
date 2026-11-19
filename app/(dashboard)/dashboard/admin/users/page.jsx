"use client";

import { useEffect, useState } from "react";
import { Search, UsersRound } from "lucide-react";
import { toast } from "sonner";
import RoleGate from "@/components/dashboard/RoleGate";
import PageHeader from "@/components/dashboard/PageHeader";
import { RoleBadge } from "@/components/ui/Badges";
import { TableSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import { ConfirmModal } from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

const ROLES = ["customer", "technician", "admin"];


export default function AdminUsersPage() {
  return (
    <RoleGate role="admin">
      <Inner />
    </RoleGate>
  );
}

function Inner() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleChange, setRoleChange] = useState(null); // { user, nextRole }
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await api("/api/admin/users");
    if (res.ok) setUsers(res.data || []);
    else toast.error(res.message);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function requestRoleChange(u, nextRole) {
    if (nextRole === u.role) return;
    setRoleChange({ user: u, nextRole });
  }

  async function confirmRoleChange() {
    if (!roleChange) return;
    setBusy(true);
    const res = await api(`/api/admin/users/${roleChange.user._id}/role`, {
      method: "PATCH",
      body: { role: roleChange.nextRole },
    });
    setBusy(false);
    if (res.ok) {
      toast.success(res.message || "Role updated");
      setRoleChange(null);
      load();
    } else {
      toast.error(res.message);
    }
  }

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const counts = {
    admin: users.filter((u) => u.role === "admin").length,
    technician: users.filter((u) => u.role === "technician").length,
    customer: users.filter((u) => u.role === "customer").length,
  };

  return (
    <>
      <PageHeader
        title="Manage Users"
        subtitle={`${counts.customer} customers · ${counts.technician} technicians · ${counts.admin} admins`}
      />

      <label className="input input-bordered rounded-lg flex items-center gap-2 max-w-md bg-base-100 mb-5">
        <Search className="w-4 h-4 opacity-50" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="grow bg-transparent focus:outline-none"
          aria-label="Search users"
        />
      </label>

      {loading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={UsersRound} title="No users match your search" />
      ) : (
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-base-content/50">
                    <th>User</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Current role</th>
                    <th>Change role</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => {
                    const isSelf = u._id === me?.id || u.email === me?.email;
                    return (
                      <tr key={u._id} className="hover:bg-base-200/60">
                        <td>
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-full overflow-hidden bg-primary/10 text-primary grid place-items-center font-bold text-sm shrink-0">
                              {u.image ? (
                                <Image src={u.image} alt="" width={36} height={36} className="w-full h-full object-cover" />
                              ) : (
                                (u.name || "?")[0].toUpperCase()
                              )}
                            </span>
                            <div>
                              <p className="font-semibold">{u.name || "Unnamed"}</p>
                              {u.area && <p className="text-xs text-base-content/50">{u.area}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="text-sm">{u.email}</td>
                        <td className="whitespace-nowrap text-sm">{formatDate(u.createdAt)}</td>
                        <td>
                          <RoleBadge role={u.role} />
                        </td>
                        <td>
                          {isSelf ? (
                            <span className="text-xs text-base-content/45 italic">You (locked)</span>
                          ) : (
                            <select
                              className="select select-bordered select-xs rounded-lg font-semibold"
                              value={u.role}
                              onChange={(e) => requestRoleChange(u, e.target.value)}
                              aria-label={`Change role for ${u.name}`}
                            >
                              {ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!roleChange}
        onClose={() => setRoleChange(null)}
        onConfirm={confirmRoleChange}
        busy={busy}
        danger={false}
        title="Change user role?"
        message={`Set ${roleChange?.user?.name} (${roleChange?.user?.email}) to ${roleChange?.nextRole}? They will get the matching dashboard immediately.`}
        confirmLabel={`Make ${roleChange?.nextRole}`}
      />
    </>
  );
}
