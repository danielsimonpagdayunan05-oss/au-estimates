import { motion } from "framer-motion";
import { CountUp } from "@/components/ui/CountUp";

const stats = [
  { value: 2400, suffix: "+", label: "Projects Estimated" },
  { value: 18, prefix: "₱", suffix: "B+", label: "Project Value Estimated" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 2, suffix: " min", label: "Average Estimate Time" },
];

export function StatsSection() {
  return (
    <section className="border-y border-ink-100 bg-ink-50/60 py-14 dark:border-white/[0.06] dark:bg-white/[0.02]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 sm:px-8 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <p className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl dark:text-white">
              <CountUp to={s.value} prefix={s.prefix} suffix={s.suffix} />
            </p>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
