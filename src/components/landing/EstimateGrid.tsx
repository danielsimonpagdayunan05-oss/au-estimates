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
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const items = [
  { icon: Compass, title: "Architectural Design Fee", desc: "Tiered professional fee based on project value and scope." },
  { icon: HardHat, title: "Engineering Design Fee", desc: "Structural, electrical, mechanical & plumbing design." },
  { icon: Sofa, title: "Interior Design Fee", desc: "Space planning, finishes, and furniture specification." },
  { icon: Building2, title: "Construction Cost", desc: "Province-adjusted cost per sqm by quality standard." },
  { icon: Hammer, title: "Renovation Cost", desc: "Scoped pricing for upgrades and structural rework." },
  { icon: Ruler, title: "Fit-out Cost", desc: "Turnkey interior fit-out for commercial & retail spaces." },
  { icon: Clock3, title: "Project Duration", desc: "AI-modeled timeline from design to turnover." },
  { icon: FileSpreadsheet, title: "Professional Fees", desc: "Full breakdown across every service you select." },
];

export function EstimateGrid() {
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
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 4) * 0.06, duration: 0.5 }}
          >
            <Card className="h-full p-6 transition-shadow hover:shadow-[var(--shadow-soft-lg)]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-olive-50 text-olive-600 dark:bg-olive-500/15 dark:text-olive-400">
                <item.icon size={20} />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-ink-900 dark:text-white">{item.title}</h3>
              <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">{item.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
