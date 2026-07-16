import { motion } from "framer-motion";
import {
  Building2,
  Compass,
  Sofa,
  HardHat,
  Hammer,
  Ruler,
  Clock3,
  FileSpreadsheet,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EditableText } from "@/components/admin/EditableText";
import { useSiteData } from "@/lib/useSiteData";
import { api } from "@/lib/api";
import { DEFAULT_SITE_DATA } from "@/lib/defaultSiteData";

const ICON_MAP: Record<string, LucideIcon> = {
  "architectural-fee": Compass,
  "engineering-fee": HardHat,
  "interior-fee": Sofa,
  "construction-cost": Building2,
  "renovation-cost": Hammer,
  "fitout-cost": Ruler,
  "project-duration": Clock3,
  "professional-fees": FileSpreadsheet,
};

export function EstimateGrid() {
  const { data, refetch } = useSiteData();
  const items = data.settings["landing.estimateGrid"] ?? DEFAULT_SITE_DATA.settings["landing.estimateGrid"]!;

  const saveItem = async (index: number, field: "title" | "desc", value: string) => {
    const next = items.map((it, i) => (i === index ? { ...it, [field]: value } : it));
    await api.put("/api/admin/settings", { key: "landing.estimateGrid", value: next });
    await refetch();
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-ink-950 sm:text-4xl dark:text-white">
          Everything you need to plan, in one estimate
        </h2>
        <p className="mt-4 text-ink-500 dark:text-ink-400">
          One guided flow produces a complete financial picture of your project.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = ICON_MAP[item.key] ?? FileSpreadsheet;
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.5 }}
            >
              <Card className="h-full p-6 transition-shadow hover:shadow-[var(--shadow-soft-lg)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-olive-50 text-olive-600 dark:bg-olive-500/15 dark:text-olive-400">
                  <Icon size={20} />
                </span>
                <EditableText
                  as="h3"
                  className="mt-4 block text-[15px] font-semibold text-ink-900 dark:text-white"
                  value={item.title}
                  onSave={(v) => saveItem(i, "title", v)}
                />
                <EditableText
                  as="p"
                  className="mt-1.5 block text-sm text-ink-500 dark:text-ink-400"
                  value={item.desc}
                  onSave={(v) => saveItem(i, "desc", v)}
                />
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
