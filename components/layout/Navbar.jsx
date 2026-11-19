"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  UserRound,
  UserRoundPlus,
  X,
} from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { RoleBadge } from "@/components/ui/Badges";
import { useAuth } from "@/components/providers/AuthProvider";
import { DASHBOARD_HOME } from "@/lib/constants";
import Image from "next/image";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];


function Initials({ name }) {
  const initials =
    (name || "?")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?";
  return <span className="font-bold text-xs">{initials}</span>;
}

export default function Navbar() {
  const { user, loading, signOut, dashboardHome } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  const dashboardHref = user ? dashboardHome(user) : "/";

  return (
    <header className="sticky top-0 z-50 bg-base-100/85 backdrop-blur-md border-b border-base-300/70">
      <nav className="container-page h-16 flex items-center justify-between gap-3">
        <Logo />

       
        <ul className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(l.href)
                    ? "text-primary bg-primary/10"
                    : "text-base-content/75 hover:text-base-content hover:bg-base-200"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

       
        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {!loading && !user && (
            <div className="hidden lg:flex items-center gap-1.5">
              <Link href="/sign-in" className="btn btn-ghost btn-sm rounded-lg font-semibold">
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
              <Link href="/sign-up" className="btn btn-primary btn-sm rounded-lg font-semibold shadow-sm shadow-primary/25">
                <UserRoundPlus className="w-4 h-4" /> Sign Up
              </Link>
            </div>
          )}

          {!loading && user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="btn btn-ghost btn-sm btn-circle avatar"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                title={user.name}
              >
                <div className="w-9 rounded-full ring-2 ring-primary/40 overflow-hidden bg-primary text-primary-content grid place-items-center">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Initials name={user.name} />
                  )}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 -ml-1 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <>
                  {/* click-away */}
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-60 z-20 card bg-base-100 border border-base-300 shadow-xl rounded-xl overflow-hidden">
                    <div className="p-3.5 border-b border-base-300">
                      <p className="font-bold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-base-content/55 truncate mt-0.5">{user.email}</p>
                      <div className="mt-2">
                        <RoleBadge role={user.role} />
                      </div>
                    </div>
                    <ul className="p-1.5">
                      <li>
                        <Link
                          href={dashboardHref}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-base-200"
                        >
                          <LayoutDashboard className="w-4 h-4 text-base-content/60" /> Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-base-200"
                        >
                          <UserRound className="w-4 h-4 text-base-content/60" /> Update Profile
                        </Link>
                      </li>
                      <li className="mt-1 pt-1 border-t border-base-300">
                        <button
                          onClick={handleSignOut}
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
          )}

        
          <button
            className="btn btn-ghost btn-sm btn-circle lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden border-t border-base-300/70 bg-base-100">
          <ul className="container-page py-3 space-y-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    isActive(l.href) ? "text-primary bg-primary/10" : "hover:bg-base-200"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {!user && (
              <li className="flex gap-2 pt-2">
                <Link href="/sign-in" className="btn btn-outline btn-sm flex-1 rounded-lg">
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn btn-primary btn-sm flex-1 rounded-lg">
                  Sign Up
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
