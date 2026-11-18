import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import Logo from "./Logo";
import FooterYear from "./FooterYear";
import { CATEGORIES, CONTACT } from "@/lib/constants";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/about", label: "About Us" },
  { href: "/sign-up", label: "Become a Customer" },
];

const SOCIALS = [
  { icon: FaXTwitter, href: "https://x.com", label: "X" },
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-base-200/60 border-t border-base-300 mt-auto">
      <div className="container-page py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Logo />
          <p className="mt-3 text-sm text-base-content/60 leading-relaxed max-w-xs">
            Smart device &amp; home appliance repair, done right. Certified technicians,
            transparent pricing, and live job tracking from request to completion.
          </p>
          <div className="flex gap-2 mt-4">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-base-100 border border-base-300 grid place-items-center hover:border-primary hover:text-primary transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links">
          <h3 className="footer-title text-base-content font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-base-content/60 hover:text-primary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

   
        <nav aria-label="Categories">
          <h3 className="text-base-content font-bold mb-3">Categories</h3>
          <ul className="space-y-2">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  href={`/services?category=${encodeURIComponent(c)}`}
                  className="text-sm text-base-content/60 hover:text-primary transition-colors"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

   
        <div>
          <h3 className="text-base-content font-bold mb-3">Contact</h3>
          <ul className="space-y-2.5 text-sm text-base-content/60">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <span>{CONTACT.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 shrink-0 text-primary" />
              <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`} className="hover:text-primary">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 shrink-0 text-primary" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-primary">
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-base-300">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-base-content/50">
          <FooterYear />
          <p>Built with Next.js, Express &amp; MongoDB · Assignment 9 · Category 006</p>
        </div>
      </div>
    </footer>
  );
}
