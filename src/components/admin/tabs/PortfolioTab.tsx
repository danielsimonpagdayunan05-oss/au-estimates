import { useRef, useState } from "react";
import { ImagePlus, Loader2, Plus, Save, Star, Trash2, X } from "lucide-react";
import { api } from "@/lib/api";
import { useSiteData } from "@/lib/useSiteData";
import type { PortfolioItemRow } from "@/types/content";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TextField, NumberField } from "@/components/admin/AdminField";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface DraftItem {
  id: number | null;
  title: string;
  description: string;
  category: string;
  location: string;
  floorAreaSqm: number;
  completionYear: number;
  coverImageKey: string;
  featured: boolean;
}

const EMPTY_DRAFT: DraftItem = {
  id: null,
  title: "",
  description: "",
  category: "Residential",
  location: "",
  floorAreaSqm: 0,
  completionYear: new Date().getUTCFullYear(),
  coverImageKey: "",
  featured: false,
};

export function PortfolioTab() {
  const { data, isLoading, refetch } = useSiteData();
  const [editing, setEditing] = useState<DraftItem | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Portfolio Projects</h2>
        <Button size="sm" onClick={() => setEditing({ ...EMPTY_DRAFT })} icon={<Plus size={14} />}>
          Add Project
        </Button>
      </div>

      {editing && (
        <PortfolioForm
          draft={editing}
          onCancel={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await refetch();
          }}
        />
      )}

      {isLoading ? (
        <Loader2 size={20} className="animate-spin text-olive-500" />
      ) : data.portfolio.length === 0 ? (
        <Card className="p-8 text-center text-sm text-ink-400">No portfolio projects yet. Add your first one above.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.portfolio.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onEdit={() =>
                setEditing({
                  id: item.id,
                  title: item.title,
                  description: item.description ?? "",
                  category: item.category ?? "Residential",
                  location: item.location ?? "",
                  floorAreaSqm: item.floorAreaSqm ?? 0,
                  completionYear: item.completionYear ?? new Date().getUTCFullYear(),
                  coverImageKey: item.coverImageKey ?? "",
                  featured: item.featured,
                })
              }
              onDeleted={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PortfolioCard({ item, onEdit, onDeleted }: { item: PortfolioItemRow; onEdit: () => void; onDeleted: () => Promise<unknown> }) {
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete("/api/admin/portfolio", { id: item.id });
      await onDeleted();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-ink-100 dark:bg-white/5">
        {item.coverImageKey ? (
          <img src={`/api/image?key=${encodeURIComponent(item.coverImageKey)}`} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">
            <ImagePlus size={28} />
          </div>
        )}
        {item.featured && (
          <Badge tone="cream" className="absolute left-2 top-2">
            <Star size={11} /> Featured
          </Badge>
        )}
      </div>
      <div className="p-4">
        <p className="font-semibold text-ink-900 dark:text-white">{item.title}</p>
        <p className="mt-0.5 text-xs text-ink-400">
          {item.category} {item.location ? `· ${item.location}` : ""}
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="secondary" onClick={onEdit}>
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={remove} disabled={deleting} icon={deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

function PortfolioForm({ draft, onCancel, onSaved }: { draft: DraftItem; onCancel: () => void; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState(draft);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await api.post<{ key: string }>("/api/admin/upload", { filename: file.name, dataUrl });
      setForm((f) => ({ ...f, coverImageKey: res.key }));
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
        floorAreaSqm: form.floorAreaSqm,
        completionYear: form.completionYear,
        coverImageKey: form.coverImageKey || null,
        featured: form.featured,
      };
      if (form.id === null) await api.post("/api/admin/portfolio", payload);
      else await api.put("/api/admin/portfolio", { id: form.id, ...payload });
      await onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink-900 dark:text-white">{form.id === null ? "New Project" : "Edit Project"}</h3>
        <button onClick={onCancel} className="text-ink-400 hover:text-ink-700 dark:hover:text-white">
          <X size={18} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
        <TextField label="Category" value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} />
        <TextField label="Location" value={form.location} onChange={(v) => setForm((f) => ({ ...f, location: v }))} />
        <NumberField label="Floor Area (sqm)" value={form.floorAreaSqm} onChange={(v) => setForm((f) => ({ ...f, floorAreaSqm: v }))} />
        <NumberField label="Completion Year" value={form.completionYear} onChange={(v) => setForm((f) => ({ ...f, completionYear: v }))} />
        <label className="flex items-center gap-2 self-end pb-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="h-4 w-4 rounded accent-olive-600" />
          <span className="text-sm font-medium text-ink-700 dark:text-ink-200">Featured on homepage</span>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-900 outline-none dark:border-white/10 dark:bg-ink-900 dark:text-white"
          />
        </label>
      </div>

      <div className="mt-4">
        <span className="mb-2 block text-xs font-medium text-ink-500 dark:text-ink-400">Cover Image</span>
        <div className="flex items-center gap-4">
          {form.coverImageKey && (
            <img src={`/api/image?key=${encodeURIComponent(form.coverImageKey)}`} alt="" className="h-16 w-24 rounded-lg object-cover" />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
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
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={save} disabled={saving || uploading || !form.title} icon={saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}>
          {saving ? "Saving..." : "Save Project"}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}
