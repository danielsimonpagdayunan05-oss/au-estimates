import { useEffect, useRef, useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { useAdminAuth } from "@/lib/adminAuth";
import { describeApiError } from "@/lib/api";
import { cn } from "@/lib/cn";

interface EditableNumberProps {
  value: number;
  onSave: (newValue: number) => Promise<void>;
  format?: (value: number) => string;
  className?: string;
  step?: number;
}

export function EditableNumber({ value, onSave, format, className, step }: EditableNumberProps) {
  const { editMode } = useAdminAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setDraft(String(value)), [value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  if (!editMode) {
    return <span className={className}>{format ? format(value) : value}</span>;
  }

  const commit = async () => {
    const parsed = Number(draft);
    if (Number.isNaN(parsed) || parsed === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(parsed);
      setSaving(false);
      setEditing(false);
    } catch (err) {
      setSaving(false);
      setError(describeApiError(err));
    }
  };

  if (!editing) {
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={() => setEditing(true)}
        onKeyDown={(e) => e.key === "Enter" && setEditing(true)}
        className={cn(
          className,
          "cursor-pointer rounded-md outline outline-dashed outline-1 outline-offset-2 outline-olive-400/50 transition-colors hover:bg-olive-50/60 dark:hover:bg-olive-500/10",
        )}
      >
        {format ? format(value) : value}
        <Pencil size={11} className="ml-1 inline-block align-middle text-olive-500 opacity-70" />
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <span className="inline-flex items-center gap-1.5">
        <input
          ref={inputRef}
          type="number"
          step={step ?? "any"}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(String(value));
              setError(null);
              setEditing(false);
            }
          }}
          onBlur={(e) => {
            if (e.relatedTarget?.hasAttribute?.("data-editable-control")) return;
            commit();
          }}
          disabled={saving}
          className={cn(className, "w-24 rounded-md border-2 border-olive-500 bg-white px-1.5 py-0.5 outline-none dark:bg-ink-900")}
        />
        {saving && <Loader2 size={14} className="animate-spin text-olive-500" />}
      </span>
      {error && (
        <span className="flex items-center gap-2 text-xs font-medium text-red-500">
          {error}
          <button type="button" data-editable-control onClick={commit} className="underline">
            Retry
          </button>
          <button
            type="button"
            data-editable-control
            onClick={() => {
              setDraft(String(value));
              setError(null);
              setEditing(false);
            }}
            className="underline"
          >
            Cancel
          </button>
        </span>
      )}
    </span>
  );
}
