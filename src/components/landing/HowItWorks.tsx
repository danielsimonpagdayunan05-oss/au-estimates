import { motion } from "framer-motion";
import { ListChecks, Wand2, FileDown, type LucideIcon } from "lucide-react";
import { EditableText } from "@/components/admin/EditableText";
import { useSiteData } from "@/lib/useSiteData";
import { api } from "@/lib/api";
import { DEFAULT_SITE_DATA } from "@/lib/defaultSiteData";

const ICON_MAP: Record<string, LucideIcon> = {
  "step-1": ListChecks,
  "step-2": Wand2,
  "step-3": FileDown,
};

export function HowItWorks() {
  const { data, refetch } = useSiteData();
  const steps = data.settings["landing.howItWorks"] ?? DEFAULT_SITE_DATA.settings["landing.howItWorks"]!;

  const saveStep = async (index: number, field: "title" | "desc", value: string) => {
    const next = steps.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    await api.put("/api/admin/settings", { key: "landing.howItWorks", value: next });
    await refetch();
  };

  return (
    <section className="bg-ink-50/60 py-20 sm:py-28 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-ink-950 sm:text-4xl dark:text-white">From idea to estimate in three steps</h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = ICON_MAP[s.key] ?? ListChecks;
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative rounded-2xl border border-ink-100 bg-white p-7 dark:border-white/[0.06] dark:bg-ink-900"
              >
                <span className="font-display text-5xl font-semibold text-ink-100 dark:text-white/10">
                  0{i + 1}
                </span>
                <span className="absolute right-7 top-7 flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-white dark:bg-white dark:text-ink-950">
                  <Icon size={20} />
                </span>
                <EditableText
                  as="h3"
                  className="mt-4 block text-lg font-semibold text-ink-900 dark:text-white"
                  value={s.title}
                  onSave={(v) => saveStep(i, "title", v)}
                />
                <EditableText
                  as="p"
                  multiline
                  className="mt-2 block text-sm leading-relaxed text-ink-500 dark:text-ink-400"
                  value={s.desc}
                  onSave={(v) => saveStep(i, "desc", v)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
