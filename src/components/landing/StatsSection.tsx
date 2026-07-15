import { useSiteData } from "@/lib/useSiteData";
import { EditableStat, AddStatButton } from "@/components/admin/EditableStat";
import { useAdminAuth } from "@/lib/adminAuth";

export function StatsSection() {
  const { data, refetch } = useSiteData();
  const { editMode } = useAdminAuth();

  return (
    <section className="border-y border-ink-100 bg-ink-50/60 py-14 dark:border-white/[0.06] dark:bg-white/[0.02]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 sm:px-8 lg:grid-cols-4">
        {data.stats.map((stat, i) => (
          <EditableStat key={stat.id} stat={stat} index={i} onSaved={refetch} />
        ))}
        {editMode && <AddStatButton nextOrder={data.stats.length} onSaved={refetch} />}
      </div>
    </section>
  );
}
