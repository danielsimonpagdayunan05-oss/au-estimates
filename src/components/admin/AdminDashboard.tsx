import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calculator, FileText, Images, Users } from "lucide-react";
import { useAdminAuth } from "@/lib/adminAuth";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ContentTab } from "@/components/admin/tabs/ContentTab";
import { EstimatorTab } from "@/components/admin/tabs/EstimatorTab";
import { PortfolioTab } from "@/components/admin/tabs/PortfolioTab";
import { LeadsTab } from "@/components/admin/tabs/LeadsTab";

const TABS = [
  { key: "content", label: "Content", icon: FileText },
  { key: "estimator", label: "Estimator Rates", icon: Calculator },
  { key: "portfolio", label: "Portfolio", icon: Images },
  { key: "leads", label: "Leads", icon: Users },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function AdminDashboard() {
  const { user, logout } = useAdminAuth();
  const [tab, setTab] = useState<TabKey>("content");

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-white">
            <ArrowLeft size={15} /> Back to site
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-ink-950 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-ink-400">Signed in as {user?.email}</p>
        </div>
        <Button variant="secondary" onClick={() => logout()}>
          Sign out
        </Button>
      </div>

      <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto border-b border-ink-100 pb-px dark:border-white/10">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-t-lg border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              tab === t.key
                ? "border-olive-500 text-olive-700 dark:text-olive-400"
                : "border-transparent text-ink-400 hover:text-ink-700 dark:hover:text-ink-200",
            )}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "content" && <ContentTab />}
        {tab === "estimator" && <EstimatorTab />}
        {tab === "portfolio" && <PortfolioTab />}
        {tab === "leads" && <LeadsTab />}
      </div>
    </div>
  );
}
