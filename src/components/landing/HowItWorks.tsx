import { motion } from "framer-motion";
import { ListChecks, Wand2, FileDown } from "lucide-react";

const steps = [
  {
    icon: ListChecks,
    title: "Tell us about your project",
    desc: "Category, location, floor area, quality standard, and building details — 7 quick steps.",
  },
  {
    icon: Wand2,
    title: "Watch your estimate build live",
    desc: "Construction cost, design fees, timeline, and risk score update instantly as you choose.",
  },
  {
    icon: FileDown,
    title: "Download your report",
    desc: "A branded, shareable proposal with cost breakdown, timeline, and material recommendations.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-ink-50/60 py-20 sm:py-28 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-ink-950 sm:text-4xl dark:text-white">From idea to estimate in three steps</h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
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
                <s.icon size={20} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink-900 dark:text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
