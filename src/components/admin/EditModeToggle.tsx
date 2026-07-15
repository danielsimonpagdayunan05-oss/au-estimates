import { Link } from "react-router-dom";
import { LayoutDashboard, Pencil, X } from "lucide-react";
import { useAdminAuth } from "@/lib/adminAuth";
import { cn } from "@/lib/cn";

export function EditModeToggle() {
  const { isAdmin, editMode, setEditMode } = useAdminAuth();
  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      <Link
        to="/admin"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-white shadow-[var(--shadow-soft-lg)] transition-transform hover:scale-105 dark:bg-white dark:text-ink-950"
        title="Admin dashboard"
      >
        <LayoutDashboard size={18} />
      </Link>
      <button
        onClick={() => setEditMode(!editMode)}
        className={cn(
          "flex h-14 items-center gap-2 rounded-full px-5 text-sm font-semibold shadow-[var(--shadow-soft-lg)] transition-all",
          editMode ? "bg-olive-600 text-white" : "bg-white text-ink-800 dark:bg-ink-900 dark:text-white",
        )}
      >
        {editMode ? <X size={18} /> : <Pencil size={16} />}
        {editMode ? "Exit Edit Mode" : "Edit Page"}
      </button>
    </div>
  );
}
