import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, PhoneCall } from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/estimate", label: "Estimate", icon: Sparkles },
  { to: "/#contact", label: "Consult", icon: PhoneCall },
];

export function MobileNav() {
  const location = useLocation();
  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-ink-100 px-2 pb-[env(safe-area-inset-bottom)] pt-2 sm:hidden dark:border-white/10">
      {items.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
        return (
          <Link
            key={label}
            to={to}
            className={cn(
              "flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors",
              active ? "text-olive-600 dark:text-olive-400" : "text-ink-400 dark:text-ink-500",
            )}
          >
            <Icon size={20} strokeWidth={active ? 2.4 : 2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
