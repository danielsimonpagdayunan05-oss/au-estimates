import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { formatPHP } from "@/lib/formatters";
import type { LeadStatus } from "@/types/estimate";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface LeadRow {
  id: number;
  status: LeadStatus;
  name: string;
  email: string;
  phone: string;
  projectLocation: string | null;
  budget: string | null;
  createdAt: string;
  estimate: { totalInvestment?: number };
}

const STATUSES: LeadStatus[] = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

const STATUS_TONE: Record<LeadStatus, "olive" | "cream" | "success" | "warning" | "danger" | "neutral"> = {
  New: "olive",
  Contacted: "neutral",
  Qualified: "cream",
  Proposal: "cream",
  Negotiation: "warning",
  Won: "success",
  Lost: "danger",
};

export function LeadsTab() {
  const [leads, setLeads] = useState<LeadRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = async () => {
    setError(null);
    try {
      const rows = await api.get<LeadRow[]>("/api/leads");
      setLeads(rows);
    } catch {
      setError("Could not load leads.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: number, status: LeadStatus) => {
    setUpdatingId(id);
    try {
      await api.patch("/api/leads", { id, status });
      setLeads((rows) => rows?.map((r) => (r.id === id ? { ...r, status } : r)) ?? null);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Leads</h2>
        <Button size="sm" variant="secondary" onClick={load} icon={<RefreshCw size={14} />}>
          Refresh
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {!leads ? (
        <Loader2 size={20} className="mt-4 animate-spin text-olive-500" />
      ) : leads.length === 0 ? (
        <Card className="mt-4 p-8 text-center text-sm text-ink-400">No leads submitted yet.</Card>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs font-semibold uppercase tracking-wide text-ink-400 dark:border-white/10">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Contact</th>
                <th className="py-2 pr-4">Location</th>
                <th className="py-2 pr-4">Est. Total</th>
                <th className="py-2 pr-4">Submitted</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-ink-50 dark:border-white/[0.04]">
                  <td className="py-3 pr-4 font-medium text-ink-900 dark:text-white">{lead.name}</td>
                  <td className="py-3 pr-4 text-ink-500 dark:text-ink-400">
                    <div>{lead.email}</div>
                    <div className="text-xs">{lead.phone}</div>
                  </td>
                  <td className="py-3 pr-4 text-ink-500 dark:text-ink-400">{lead.projectLocation ?? "—"}</td>
                  <td className="py-3 pr-4 font-medium text-ink-900 dark:text-white">
                    {lead.estimate?.totalInvestment ? formatPHP(lead.estimate.totalInvestment, { compact: true }) : "—"}
                  </td>
                  <td className="py-3 pr-4 text-ink-500 dark:text-ink-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Badge tone={STATUS_TONE[lead.status] ?? "neutral"}>{lead.status}</Badge>
                      {updatingId === lead.id ? (
                        <Loader2 size={14} className="animate-spin text-olive-500" />
                      ) : (
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                          className="rounded-md border border-ink-200 bg-white px-1.5 py-0.5 text-xs dark:border-white/10 dark:bg-ink-900 dark:text-white"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
