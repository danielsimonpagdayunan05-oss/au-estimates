import type { ClientInfo, Lead, WizardSelections, EstimateResult } from "@/types/estimate";

const STORAGE_KEY = "archiunite.leads";

function readAll(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Lead[]) : [];
  } catch {
    return [];
  }
}

function writeAll(leads: Lead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export function createLead(client: ClientInfo, selections: WizardSelections, estimate: EstimateResult): Lead {
  const lead: Lead = {
    id: `LEAD-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "New",
    client,
    selections,
    estimate,
  };
  const leads = readAll();
  leads.unshift(lead);
  writeAll(leads);
  return lead;
}

export function getLeads(): Lead[] {
  return readAll();
}

export function updateLeadStatus(id: string, status: Lead["status"]) {
  const leads = readAll().map((l) => (l.id === id ? { ...l, status } : l));
  writeAll(leads);
  return leads;
}
