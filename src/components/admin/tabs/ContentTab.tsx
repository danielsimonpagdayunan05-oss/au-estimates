import { useEffect, useRef, useState } from "react";
import { Box, ImagePlus, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { api, describeApiError } from "@/lib/api";
import { useSiteData } from "@/lib/useSiteData";
import { DEFAULT_SITE_DATA } from "@/lib/defaultSiteData";
import type { StatItemRow } from "@/types/content";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField, NumberField } from "@/components/admin/AdminField";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ContentTab() {
  const { data, isLoading, refetch } = useSiteData();
  const [hero, setHero] = useState({
    "company.name": "",
    "hero.headline": "",
    "hero.subtitle": "",
    "hero.tagline": "",
  });
  const [savingHero, setSavingHero] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);

  useEffect(() => {
    setHero({
      "company.name": (data.settings["company.name"] as string) ?? "",
      "hero.headline": (data.settings["hero.headline"] as string) ?? "",
      "hero.subtitle": (data.settings["hero.subtitle"] as string) ?? "",
      "hero.tagline": (data.settings["hero.tagline"] as string) ?? "",
    });
  }, [data.settings]);

  const saveHero = async () => {
    setSavingHero(true);
    setHeroError(null);
    try {
      await Promise.all(Object.entries(hero).map(([key, value]) => api.put("/api/admin/settings", { key, value })));
      await refetch();
      setHeroSaved(true);
      setTimeout(() => setHeroSaved(false), 2000);
    } catch (err) {
      setHeroError(describeApiError(err));
    } finally {
      setSavingHero(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Hero Section</h2>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          This copy also becomes directly click-to-edit on the live page when you use "Edit Page" mode.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Company Name" value={hero["company.name"]} onChange={(v) => setHero((h) => ({ ...h, "company.name": v }))} />
          <TextField label="Tagline" value={hero["hero.tagline"]} onChange={(v) => setHero((h) => ({ ...h, "hero.tagline": v }))} />
          <TextField
            label="Headline"
            className="sm:col-span-2"
            value={hero["hero.headline"]}
            onChange={(v) => setHero((h) => ({ ...h, "hero.headline": v }))}
          />
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">Subtitle</span>
            <textarea
              value={hero["hero.subtitle"]}
              onChange={(e) => setHero((h) => ({ ...h, "hero.subtitle": e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-900 outline-none transition-colors focus:border-olive-500 dark:border-white/10 dark:bg-ink-900 dark:text-white"
            />
          </label>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Button onClick={saveHero} disabled={savingHero} icon={savingHero ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}>
            {savingHero ? "Saving..." : "Save Hero Content"}
          </Button>
          {heroSaved && <span className="text-sm text-emerald-600">Saved</span>}
          {heroError && <span className="text-sm font-medium text-red-500">{heroError}</span>}
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Hero Sample Figures</h2>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          The three floating example cards next to the headline (Estimated Investment, Timeline, Risk Score) — illustrative numbers, not live data. Also click-to-edit on the page itself.
        </p>
        {isLoading ? (
          <Loader2 size={20} className="mt-4 animate-spin text-olive-500" />
        ) : (
          <HeroSampleEditor sample={data.settings["hero.sampleEstimate"] ?? DEFAULT_SITE_DATA.settings["hero.sampleEstimate"]!} onChanged={refetch} />
        )}
      </Card>

      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Hero 3D Model</h2>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Upload a .glb or .gltf 3D model to replace the hero's background panel with an interactive model visitors can drag to rotate and pinch to zoom.
        </p>
        {isLoading ? (
          <Loader2 size={20} className="mt-4 animate-spin text-olive-500" />
        ) : (
          <HeroModelUploader modelKey={(data.settings["hero.modelKey"] as string | null) ?? null} onChanged={refetch} />
        )}
      </Card>

      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Landing Page Stats</h2>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">The animated numbers shown on the homepage.</p>
        {isLoading ? (
          <Loader2 size={20} className="mt-4 animate-spin text-olive-500" />
        ) : (
          <StatsEditor stats={data.stats} onChanged={refetch} />
        )}
      </Card>
    </div>
  );
}

function HeroSampleEditor({
  sample,
  onChanged,
}: {
  sample: { investment: number; timelineMonths: number; riskLabel: string; riskPct: number };
  onChanged: () => Promise<unknown>;
}) {
  const [draft, setDraft] = useState(sample);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setDraft(sample), [sample]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.put("/api/admin/settings", { key: "hero.sampleEstimate", value: draft });
      await onChanged();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(describeApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NumberField label="Investment (PHP)" value={draft.investment} onChange={(v) => setDraft((d) => ({ ...d, investment: v }))} />
        <NumberField label="Timeline (months)" value={draft.timelineMonths} onChange={(v) => setDraft((d) => ({ ...d, timelineMonths: v }))} />
        <TextField label="Risk Label" value={draft.riskLabel} onChange={(v) => setDraft((d) => ({ ...d, riskLabel: v }))} />
        <NumberField label="Risk %" value={draft.riskPct} onChange={(v) => setDraft((d) => ({ ...d, riskPct: v }))} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button size="sm" onClick={save} disabled={saving} icon={saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}>
          Save
        </Button>
        {saved && <span className="text-sm text-emerald-600">Saved</span>}
        {error && <span className="text-sm font-medium text-red-500">{error}</span>}
      </div>
    </div>
  );
}

function HeroModelUploader({ modelKey, onChanged }: { modelKey: string | null; onChanged: () => Promise<unknown> }) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await api.post<{ key: string }>("/api/admin/upload", { filename: file.name, dataUrl });
      await api.put("/api/admin/settings", { key: "hero.modelKey", value: res.key });
      await onChanged();
    } catch (err) {
      setError(describeApiError(err));
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    setRemoving(true);
    setError(null);
    try {
      await api.put("/api/admin/settings", { key: "hero.modelKey", value: null });
      await onChanged();
    } catch (err) {
      setError(describeApiError(err));
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center gap-4">
        {modelKey ? (
          <div className="flex items-center gap-2 rounded-lg bg-ink-50/70 px-3 py-2 text-sm font-medium text-ink-700 dark:bg-white/[0.04] dark:text-ink-200">
            <Box size={16} className="text-olive-500" />
            Model uploaded
            <button onClick={remove} disabled={removing} className="ml-1 text-ink-400 hover:text-red-500" aria-label="Remove 3D model">
              {removing ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
            </button>
          </div>
        ) : (
          <span className="text-sm text-ink-400">No model uploaded yet — the hero shows its default gradient panel.</span>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          icon={uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
        >
          {uploading ? "Uploading..." : modelKey ? "Replace Model" : "Upload Model"}
        </Button>
      </div>
      {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

function StatsEditor({ stats, onChanged }: { stats: StatItemRow[]; onChanged: () => Promise<unknown> }) {
  const [rows, setRows] = useState(stats);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState<Record<number, string>>({});

  useEffect(() => setRows(stats), [stats]);

  const updateRow = (id: number, patch: Partial<StatItemRow>) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const saveRow = async (row: StatItemRow) => {
    setSavingId(row.id);
    setErrors((e) => ({ ...e, [row.id]: "" }));
    try {
      if (row.id < 0) {
        await api.post("/api/admin/stats", { label: row.label, value: row.value, prefix: row.prefix, suffix: row.suffix, sortOrder: row.sortOrder });
      } else {
        await api.put("/api/admin/stats", row);
      }
      await onChanged();
    } catch (err) {
      setErrors((e) => ({ ...e, [row.id]: describeApiError(err) }));
    } finally {
      setSavingId(null);
    }
  };

  const deleteRow = async (id: number) => {
    if (id < 0) {
      setRows((r) => r.filter((row) => row.id !== id));
      return;
    }
    setSavingId(id);
    setErrors((e) => ({ ...e, [id]: "" }));
    try {
      await api.delete("/api/admin/stats", { id });
      await onChanged();
    } catch (err) {
      setErrors((e) => ({ ...e, [id]: describeApiError(err) }));
    } finally {
      setSavingId(null);
    }
  };

  const addRow = () => {
    setCreating(true);
    setRows((r) => [...r, { id: -Date.now(), label: "New Stat", value: 0, prefix: "", suffix: "", sortOrder: r.length }]);
    setCreating(false);
  };

  return (
    <div className="mt-5 space-y-3">
      {rows.map((row) => (
        <div key={row.id} className="rounded-xl border border-ink-100 p-4 dark:border-white/[0.06]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:items-end">
            <TextField label="Label" value={row.label} onChange={(v) => updateRow(row.id, { label: v })} className="sm:col-span-2" />
            <NumberField label="Value" value={row.value} onChange={(v) => updateRow(row.id, { value: v })} />
            <TextField label="Prefix" value={row.prefix} onChange={(v) => updateRow(row.id, { prefix: v })} />
            <TextField label="Suffix" value={row.suffix} onChange={(v) => updateRow(row.id, { suffix: v })} />
            <div className="col-span-2 flex gap-2 sm:col-span-5 sm:justify-end">
              <Button size="sm" variant="secondary" onClick={() => saveRow(row)} disabled={savingId === row.id} icon={savingId === row.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => deleteRow(row.id)} disabled={savingId === row.id} icon={<Trash2 size={14} />}>
                Delete
              </Button>
            </div>
          </div>
          {errors[row.id] && <p className="mt-2 text-xs font-medium text-red-500">{errors[row.id]}</p>}
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={addRow} disabled={creating} icon={<Plus size={14} />}>
        Add Stat
      </Button>
    </div>
  );
}
