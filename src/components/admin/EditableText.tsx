import { useEffect, useRef, useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { useAdminAuth } from "@/lib/adminAuth";
import { cn } from "@/lib/cn";

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function EditableText({ value, onSave, as: Tag = "span", className, multiline, placeholder }: EditableTextProps) {
  const { editMode } = useAdminAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  if (!editMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  const commit = async () => {
    if (draft.trim() === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onSave(draft.trim());
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  if (!editing) {
    return (
      <Tag
        className={cn(
          className,
          "group/edit relative inline cursor-pointer rounded-md outline outline-dashed outline-1 outline-offset-2 outline-olive-400/50 transition-colors hover:bg-olive-50/60 dark:hover:bg-olive-500/10",
        )}
        onClick={() => setEditing(true)}
      >
        {value || <span className="text-ink-300 dark:text-ink-600">{placeholder ?? "Click to edit"}</span>}
        <Pencil size={12} className="ml-1.5 inline-block shrink-0 align-middle text-olive-500 opacity-70" />
      </Tag>
    );
  }

  const InputTag = multiline ? "textarea" : "input";

  return (
    <span className="relative inline-flex w-full max-w-full items-start gap-2">
      <InputTag
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !multiline) {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        onBlur={commit}
        rows={multiline ? 3 : undefined}
        disabled={saving}
        className={cn(className, "w-full min-w-0 rounded-md border-2 border-olive-500 bg-white px-1.5 py-0.5 outline-none dark:bg-ink-900")}
      />
      {saving && <Loader2 size={16} className="mt-1 shrink-0 animate-spin text-olive-500" />}
    </span>
  );
}
