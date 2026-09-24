import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-xs text-[var(--muted-foreground)]", className)}>
      <ol className="flex items-center gap-1.5 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[var(--foreground)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus)] rounded px-1"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn("font-medium text-[var(--foreground)] px-1", isLast && "text-[var(--foreground)]")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="w-3.5 h-3.5 text-[var(--border)] shrink-0" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
