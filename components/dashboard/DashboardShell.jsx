"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { ChevronDown, Home, LogOut, Menu, X } from "lucide-react";
import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { RoleBadge } from "@/components/ui/Badges";
import { useAuth } from "@/components/providers/AuthProvider";
import { SIDEBAR_MENUS } from "@/lib/constants";

export default function DashboardShell({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

 
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in?redirect=/dashboard");
    }
  }, [loading, user, router]);


  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) return null; 

  return (
    <Suspense fallback={<LoadingScreen />}>
      <ShellInner user={user} />
    </Suspense>
  );
}


function LoadingScreen() {
  return (
    <div className="min-h-dvh grid place-items-center bg-base-200">
      <div className="flex flex-col items-center gap-4">
        <Logo withText={false} />
        <span className="loading loading-dots loading-md text-primary" />
        <p className="text-sm text-base-content/50">Preparing your dashboard…</p>
      </div>
    </div>
  );
}


function ShellInner({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menus = SIDEBAR_MENUS[user.role] || [];


  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-base-200/60 flex">
    
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-base-300 bg-base-100 sticky top-0 h-dvh">
        <div className="h-16 flex items-center px-5 border-b border-base-300">
          <Logo />
        </div>
        <SidebarNav menus={menus} pathname={pathname} />
        <div className="p-4 border-t border-base-300 mt-auto">
          <p className="text-[11px] text-base-content/40 text-center">FixMate Dashboard v1.0</p>
        </div>
      </aside>

     
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-base-100 border-r border-base-300 flex flex-col">
            <div className="h-16 flex items-center justify-between px-5 border-b border-base-300">
              <Logo />
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarNav menus={menus} pathname={pathname} />
          </aside>
        </div>
      )}

     
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 h-16 bg-base-100/90 backdrop-blur border-b border-base-300 flex items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-sm btn-circle lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <div className="lg:hidden">
              <Logo withText={false} />
            </div>
            <Link href="/" className="btn btn-ghost btn-sm rounded-lg font-semibold" title="Back to site">
              <Home className="w-4 h-4" /> <span className="hidden sm:inline">Home</span>
            </Link>
            <span className="hidden sm:block text-sm font-semibold text-base-content/50 border-l border-base-300 pl-3 ml-1">
              {menus.find((m) => m.href === pathname)?.label || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 btn btn-ghost btn-sm rounded-lg"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="w-8 h-8 rounded-full overflow-hidden bg-primary text-primary-content grid place-items-center text-xs font-bold ring-2 ring-primary/30">
                  {user.image ? (
                    <img src={user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (user.name || "?").slice(0, 2).toUpperCase()
                  )}
                </span>
                <span className="hidden md:block text-sm font-semibold max-w-32 truncate">{user.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 z-20 card bg-base-100 border border-base-300 shadow-xl rounded-xl overflow-hidden">
                    <div className="p-3.5 border-b border-base-300">
                      <p className="font-bold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-base-content/55 truncate mt-0.5">{user.email}</p>
                      <div className="mt-2">
                        <RoleBadge role={user.role} />
                      </div>
                    </div>
                    <ul className="p-1.5">
                      <li>
                        <Link href="/dashboard/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-base-200">
                          <Icons.UserRound className="w-4 h-4 text-base-content/60" /> Update Profile
                        </Link>
                      </li>
                      <li className="mt-1 pt-1 border-t border-base-300">
                        <button
                          onClick={async () => {
                            await signOut();
                            router.push("/");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-error/10"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarNav({ menus, pathname }) {
  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);
  return (
    <nav className="flex-1 p-3.5 overflow-y-auto" aria-label="Dashboard">
      <ul className="space-y-1">
        {menus.map((m) => {
          const Icon = Icons[m.icon] || Icons.Circle;
          const active = isActive(m.href);
          return (
            <li key={m.href}>
              <Link
                href={m.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-content shadow-sm shadow-primary/30"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {m.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
