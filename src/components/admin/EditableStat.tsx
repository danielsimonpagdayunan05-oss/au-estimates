import { useEffect, useState } from "react";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { CountUp } from "@/components/ui/CountUp";
import { useAdminAuth } from "@/lib/adminAuth";
import { api, describeApiError } from "@/lib/api";
import type { StatItemRow } from "@/types/content";

export function EditableStat({ stat, index, onSaved }: { stat: StatItemRow; index: number; onSaved: () => Promise<unknown> }) {
  const { editMode } = useAdminAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(stat);
  const [valueText, setValueText] = useState(String(stat.value));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setValueText(String(draft.value)), [draft.value]);

  if (!editMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08, duration: 0.5 }}
        className="text-center lg:text-left"
      >
        <p className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl dark:text-white">
          <CountUp to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
        </p>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{stat.label}</p>
      </motion.div>
    );
  }

  if (!editing) {
    return (
      <button
        onClick={() => {
          setDraft(stat);
          setEditing(true);
        }}
        className="group relative rounded-xl p-2 text-center outline outline-dashed outline-1 outline-olive-400/50 transition-colors hover:bg-olive-50/60 lg:text-left dark:hover:bg-olive-500/10"
      >
        <p className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl dark:text-white">
          {stat.prefix}
          {stat.value}
          {stat.suffix}
        </p>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          {stat.label}
          <Pencil size={11} className="ml-1.5 inline-block text-olive-500 opacity-70" />
        </p>
      </button>
    );
  }

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      if (draft.id < 0) {
        await api.post("/api/admin/stats", { label: draft.label, value: draft.value, prefix: draft.prefix, suffix: draft.suffix, sortOrder: draft.sortOrder });
      } else {
        await api.put("/api/admin/stats", draft);
      }
      await onSaved();
      setSaving(false);
      setEditing(false);
    } catch (err) {
      setSaving(false);
      setError(describeApiError(err));
    }
  };

  const remove = async () => {
    setSaving(true);
    setError(null);
    try {
      if (draft.id >= 0) await api.delete("/api/admin/stats", { id: draft.id });
      await onSaved();
      setSaving(false);
      setEditing(false);
    } catch (err) {
      setSaving(false);
      setError(describeApiError(err));
    }
  };

  const inputClass = "w-full rounded-md border border-olive-300 bg-white px-2 py-1 text-xs outline-none focus:border-olive-500 dark:bg-ink-900 dark:border-olive-700";

  return (
    <div className="rounded-xl border-2 border-olive-500 bg-white p-3 text-left dark:bg-ink-900">
      <div className="grid grid-cols-3 gap-1.5">
        <input className={inputClass} placeholder="Prefix" value={draft.prefix} onChange={(e) => setDraft((d) => ({ ...d, prefix: e.target.value }))} />
        <input
          className={inputClass}
          type="number"
          placeholder="Value"
          value={valueText}
          onChange={(e) => {
            const raw = e.target.value;
            setValueText(raw);
            if (raw.trim() === "") return;
            const parsed = Number(raw);
            if (!Number.isNaN(parsed)) setDraft((d) => ({ ...d, value: parsed }));
          }}
        />
        <input className={inputClass} placeholder="Suffix" value={draft.suffix} onChange={(e) => setDraft((d) => ({ ...d, suffix: e.target.value }))} />
      </div>
      <input
        className={`${inputClass} mt-1.5`}
        placeholder="Label"
        value={draft.label}
        onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
      />
      <div className="mt-2 flex items-center gap-1.5">
        <button onClick={save} disabled={saving} className="flex h-7 w-7 items-center justify-center rounded-md bg-olive-500 text-white disabled:opacity-50">
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
        </button>
        <button onClick={() => setEditing(false)} disabled={saving} className="flex h-7 w-7 items-center justify-center rounded-md bg-ink-100 text-ink-600 dark:bg-white/10 dark:text-ink-300">
          <X size={13} />
        </button>
        <button onClick={remove} disabled={saving} className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-red-500 dark:bg-red-500/15">
          <Trash2 size={13} />
        </button>
      </div>
      {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

export function AddStatButton({ nextOrder, onSaved }: { nextOrder: number; onSaved: () => Promise<unknown> }) {
  const { editMode } = useAdminAuth();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!editMode) return null;

  const add = async () => {
    setAdding(true);
    setError(null);
    try {
      await api.post("/api/admin/stats", { label: "New Stat", value: 0, prefix: "", suffix: "", sortOrder: nextOrder });
      await onSaved();
    } catch (err) {
      setError(describeApiError(err));
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex min-h-[72px] flex-col justify-center gap-1.5">
      <button
        onClick={add}
        disabled={adding}
        className="flex min-h-[72px] items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-olive-300 text-sm font-medium text-olive-600 hover:bg-olive-50/60 dark:border-olive-700 dark:text-olive-400 dark:hover:bg-olive-500/10"
      >
        {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        Add Stat
      </button>
      {error && <p className="text-center text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
