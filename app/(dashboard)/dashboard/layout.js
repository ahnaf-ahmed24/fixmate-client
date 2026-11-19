import DashboardShell from "@/components/dashboard/DashboardShell";


export const instant = false;

/** All /dashboard/* pages live inside the role-aware shell. */
export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
