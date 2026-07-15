import { motion } from "framer-motion";
import { MapPin, Ruler } from "lucide-react";
import { useSiteData } from "@/lib/useSiteData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function PortfolioSection() {
  const { data } = useSiteData();
  if (data.portfolio.length === 0) return null;

  const items = [...data.portfolio].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-ink-950 sm:text-4xl dark:text-white">Recent Projects</h2>
        <p className="mt-4 text-ink-500 dark:text-ink-400">A look at what we've designed and built.</p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
          >
            <Card className="group overflow-hidden transition-shadow hover:shadow-[var(--shadow-soft-lg)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink-100 dark:bg-white/5">
                {item.coverImageKey ? (
                  <img
                    src={`/api/image?key=${encodeURIComponent(item.coverImageKey)}`}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-300 dark:text-ink-700">
                    <Ruler size={28} />
                  </div>
                )}
                {item.featured && (
                  <Badge tone="cream" className="absolute left-3 top-3">
                    Featured
                  </Badge>
                )}
              </div>
              <div className="p-5">
                <p className="font-semibold text-ink-900 dark:text-white">{item.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
                  {item.category && <span>{item.category}</span>}
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {item.location}
                    </span>
                  )}
                  {item.floorAreaSqm ? <span>{item.floorAreaSqm} sqm</span> : null}
                </div>
                {item.description && <p className="mt-2 line-clamp-2 text-sm text-ink-500 dark:text-ink-400">{item.description}</p>}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
