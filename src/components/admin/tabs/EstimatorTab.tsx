import { useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useSiteData } from "@/lib/useSiteData";
import type { FeeTier, ProvinceRow, ServiceRow } from "@/types/content";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField, NumberField } from "@/components/admin/AdminField";

function RecordMapEditor({
  title,
  description,
  settingsKey,
  values,
  onSaved,
}: {
  title: string;
  description: string;
  settingsKey: string;
  values: Record<string, number>;
  onSaved: () => Promise<unknown>;
}) {
  const [draft, setDraft] = useState(values);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(values), [values]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/api/admin/settings", { key: settingsKey, value: draft });
      await onSaved();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-base font-semibold text-ink-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{description}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Object.entries(draft).map(([key, value]) => (
          <NumberField key={key} label={key} value={value} onChange={(v) => setDraft((d) => ({ ...d, [key]: v }))} />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button size="sm" onClick={save} disabled={saving} icon={saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}>
          Save
        </Button>
        {saved && <span className="text-sm text-emerald-600">Saved</span>}
      </div>
    </Card>
  );
}

function FeeTiersEditor({ tiers, onSaved }: { tiers: FeeTier[]; onSaved: () => Promise<unknown> }) {
  const [draft, setDraft] = useState(tiers);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(tiers), [tiers]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/api/admin/settings", { key: "estimator.architecturalFeeTiers", value: draft });
      await onSaved();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-base font-semibold text-ink-900 dark:text-white">Architectural Fee Tiers</h3>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Fee percentage applied based on project value bracket. Leave "Up To" blank for the top (unlimited) tier.</p>
      <div className="mt-4 space-y-2">
        {draft.map((tier, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <NumberField
              label="Up To (PHP)"
              value={tier.upTo ?? 0}
              onChange={(v) => setDraft((d) => d.map((t, idx) => (idx === i ? { ...t, upTo: v || null } : t)))}
            />
            <NumberField
              label="Rate"
              step={0.001}
              value={tier.rate}
              onChange={(v) => setDraft((d) => d.map((t, idx) => (idx === i ? { ...t, rate: v } : t)))}
            />
            <Button size="sm" variant="outline" className="self-end" onClick={() => setDraft((d) => d.filter((_, idx) => idx !== i))} icon={<Trash2 size={14} />}>
              Remove
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button size="sm" variant="secondary" onClick={() => setDraft((d) => [...d, { upTo: null, rate: 0.05 }])} icon={<Plus size={14} />}>
          Add Tier
        </Button>
        <Button size="sm" onClick={save} disabled={saving} icon={saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}>
          Save
        </Button>
        {saved && <span className="text-sm text-emerald-600">Saved</span>}
      </div>
    </Card>
  );
}

function ProvincesEditor({ provinces, onSaved }: { provinces: ProvinceRow[]; onSaved: () => Promise<unknown> }) {
  const [rows, setRows] = useState(provinces);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => setRows(provinces), [provinces]);

  const update = (id: number, patch: Partial<ProvinceRow>) => setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const save = async (row: ProvinceRow) => {
    setSavingId(row.id);
    try {
      if (row.id < 0) {
        await api.post("/api/admin/provinces", { name: row.name, region: row.region, multiplier: row.multiplier, cities: row.cities, sortOrder: row.sortOrder });
      } else {
        await api.put("/api/admin/provinces", row);
      }
      await onSaved();
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (id: number) => {
    if (id < 0) return setRows((r) => r.filter((row) => row.id !== id));
    setSavingId(id);
    try {
      await api.delete("/api/admin/provinces", { id });
      await onSaved();
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-base font-semibold text-ink-900 dark:text-white">Provinces & Regional Cost Index</h3>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Multiplier of 1.0 = same as Metro Manila baseline. Cities are comma-separated.</p>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-2 gap-3 rounded-xl border border-ink-100 p-4 sm:grid-cols-6 sm:items-end dark:border-white/[0.06]">
            <TextField label="Province" value={row.name} onChange={(v) => update(row.id, { name: v })} />
            <TextField label="Region" value={row.region} onChange={(v) => update(row.id, { region: v })} />
            <NumberField label="Multiplier" step={0.01} value={row.multiplier} onChange={(v) => update(row.id, { multiplier: v })} />
            <TextField
              label="Cities"
              className="sm:col-span-2"
              value={row.cities.join(", ")}
              onChange={(v) => update(row.id, { cities: v.split(",").map((c) => c.trim()).filter(Boolean) })}
            />
            <div className="col-span-2 flex gap-2 sm:col-span-1">
              <Button size="sm" variant="secondary" onClick={() => save(row)} disabled={savingId === row.id} icon={savingId === row.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} />
              <Button size="sm" variant="outline" onClick={() => remove(row.id)} disabled={savingId === row.id} icon={<Trash2 size={14} />} />
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="mt-4"
        onClick={() => setRows((r) => [...r, { id: -Date.now(), name: "New Province", region: "", multiplier: 1, cities: [], sortOrder: r.length }])}
        icon={<Plus size={14} />}
      >
        Add Province
      </Button>
    </Card>
  );
}

const SERVICE_CATEGORIES = ["design", "engineering", "construction", "documentation", "survey"] as const;
const FEE_TYPES = ["per_sqm", "flat", "percent"] as const;

function ServicesEditor({ services, onSaved }: { services: ServiceRow[]; onSaved: () => Promise<unknown> }) {
  const [rows, setRows] = useState(services);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => setRows(services), [services]);

  const update = (id: string, patch: Partial<ServiceRow>) => setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const save = async (row: ServiceRow, isNew: boolean) => {
    setSavingId(row.id);
    try {
      if (isNew) await api.post("/api/admin/services", row);
      else await api.put("/api/admin/services", row);
      await onSaved();
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (id: string, isNew: boolean) => {
    if (isNew) return setRows((r) => r.filter((row) => row.id !== id));
    setSavingId(id);
    try {
      await api.delete("/api/admin/services", { id });
      await onSaved();
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-base font-semibold text-ink-900 dark:text-white">Additional Services Pricing</h3>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">The optional line items offered in the wizard's Services step.</p>
      <div className="mt-4 space-y-3">
        {rows.map((row) => {
          const isNew = row.id.startsWith("new-");
          return (
            <div key={row.id} className="grid grid-cols-2 gap-3 rounded-xl border border-ink-100 p-4 sm:grid-cols-6 sm:items-end dark:border-white/[0.06]">
              <TextField label="Label" className="sm:col-span-2" value={row.label} onChange={(v) => update(row.id, { label: v })} />
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">Category</span>
                <select
                  value={row.category}
                  onChange={(e) => update(row.id, { category: e.target.value as ServiceRow["category"] })}
                  className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-900 outline-none dark:border-white/10 dark:bg-ink-900 dark:text-white"
                >
                  {SERVICE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">Fee Type</span>
                <select
                  value={row.feeType}
                  onChange={(e) => update(row.id, { feeType: e.target.value as ServiceRow["feeType"] })}
                  className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-900 outline-none dark:border-white/10 dark:bg-ink-900 dark:text-white"
                >
                  {FEE_TYPES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </label>
              <NumberField label="Value" step={0.001} value={row.value} onChange={(v) => update(row.id, { value: v })} />
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => save(row, isNew)} disabled={savingId === row.id} icon={savingId === row.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} />
                <Button size="sm" variant="outline" onClick={() => remove(row.id, isNew)} disabled={savingId === row.id} icon={<Trash2 size={14} />} />
              </div>
            </div>
          );
        })}
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="mt-4"
        onClick={() =>
          setRows((r) => [
            ...r,
            { id: `new-${Date.now()}`, label: "New Service", category: "design", feeType: "flat", value: 0, sortOrder: r.length },
          ])
        }
        icon={<Plus size={14} />}
      >
        Add Service
      </Button>
    </Card>
  );
}

export function EstimatorTab() {
  const { data, isLoading, refetch } = useSiteData();
  const s = data.settings;

  if (isLoading) return <Loader2 size={20} className="animate-spin text-olive-500" />;

  return (
    <div className="space-y-6">
      <RecordMapEditor
        title="Category Base Rate (PHP / sqm)"
        description="Base construction cost per square meter for each project category, before quality/location adjustments."
        settingsKey="estimator.categoryRates"
        values={(s["estimator.categoryRates"] as Record<string, number>) ?? {}}
        onSaved={refetch}
      />
      <RecordMapEditor
        title="Quality Standard Multiplier"
        description="Multiplies the base rate depending on the selected finish quality."
        settingsKey="estimator.qualityMultipliers"
        values={(s["estimator.qualityMultipliers"] as Record<string, number>) ?? {}}
        onSaved={refetch}
      />
      <RecordMapEditor
        title="Project Type Multiplier"
        description="Adjusts cost for renovation, fit-out, design-only, etc. relative to new construction."
        settingsKey="estimator.projectTypeMultipliers"
        values={(s["estimator.projectTypeMultipliers"] as Record<string, number>) ?? {}}
        onSaved={refetch}
      />
      <RecordMapEditor
        title="MEP Complexity Multiplier"
        description="Adjusts cost for mechanical/electrical/plumbing system complexity."
        settingsKey="estimator.mepMultipliers"
        values={(s["estimator.mepMultipliers"] as Record<string, number>) ?? {}}
        onSaved={refetch}
      />
      <FeeTiersEditor tiers={(s["estimator.architecturalFeeTiers"] as FeeTier[]) ?? []} onSaved={refetch} />
      <Card className="p-6 sm:p-8">
        <h3 className="text-base font-semibold text-ink-900 dark:text-white">Fee & Cost Rates</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <SingleRateField settingsKey="estimator.engineeringFeeRate" label="Engineering Fee Rate" value={(s["estimator.engineeringFeeRate"] as number) ?? 0} onSaved={refetch} />
          <SingleRateField settingsKey="estimator.interiorFeeRate" label="Interior Fee Rate" value={(s["estimator.interiorFeeRate"] as number) ?? 0} onSaved={refetch} />
          <SingleRateField settingsKey="estimator.floorsCostAdderPerLevel" label="Cost Adder per Extra Floor" value={(s["estimator.floorsCostAdderPerLevel"] as number) ?? 0} onSaved={refetch} />
        </div>
      </Card>
      <RecordMapEditor
        title="Timeline Factor by Quality"
        description="Multiplies the base project timeline depending on the quality tier."
        settingsKey="estimator.qualityTimelineFactors"
        values={(s["estimator.qualityTimelineFactors"] as Record<string, number>) ?? {}}
        onSaved={refetch}
      />
      <RecordMapEditor
        title="Timeline Factor by Project Type"
        description="Multiplies the base project timeline depending on project type."
        settingsKey="estimator.projectTypeTimelineFactors"
        values={(s["estimator.projectTypeTimelineFactors"] as Record<string, number>) ?? {}}
        onSaved={refetch}
      />
      <ProvincesEditor provinces={data.provinces} onSaved={refetch} />
      <ServicesEditor services={data.services} onSaved={refetch} />
    </div>
  );
}

function SingleRateField({ settingsKey, label, value, onSaved }: { settingsKey: string; label: string; value: number; onSaved: () => Promise<unknown> }) {
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(value), [value]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/api/admin/settings", { key: settingsKey, value: draft });
      await onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-end gap-2">
      <NumberField label={label} step={0.001} value={draft} onChange={setDraft} />
      <Button size="sm" variant="secondary" onClick={save} disabled={saving} icon={saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} />
    </div>
  );
}
