"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import IonIcon from "@/components/IonIcon";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Produktet", icon: "cube-outline" },
  { href: "/admin/orders", label: "Porositë", icon: "receipt-outline" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <IonIcon name={link.icon} size={15} />
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
