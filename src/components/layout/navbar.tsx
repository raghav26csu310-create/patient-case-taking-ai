"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Stethoscope, User, ShieldAlert, Settings, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeBadge } from "@/components/ui/mode-badge";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Portal", icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: "/patient", label: "Patient Surface", icon: <User className="w-4 h-4" /> },
    { href: "/clinician", label: "Clinician Cockpit", icon: <Stethoscope className="w-4 h-4" /> },
    { href: "/triage", label: "Triage & Queue", icon: <ShieldAlert className="w-4 h-4" /> },
    { href: "/admin", label: "Admin & Audit", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & System Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-white shadow-xs">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <Link
              href="/"
              className="text-sm font-bold tracking-tight text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
            >
              SIH26047 Case-Taking AI
            </Link>
            <span className="text-[10px] text-[var(--muted-foreground)] tracking-wide font-medium">
              First-Mile Clinical Intelligence
            </span>
          </div>
          <div className="hidden md:block ml-2">
            <ModeBadge />
          </div>
        </div>

        {/* Surface Navigation Links */}
        <nav aria-label="Main Surface Navigation" className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus)]",
                  isActive
                    ? "bg-[var(--primary-muted)] text-[var(--primary)] shadow-2xs font-bold"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.icon}
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
