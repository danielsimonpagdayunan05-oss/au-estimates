import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, CalendarClock, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import { EditableText } from "@/components/admin/EditableText";
import { EditableNumber } from "@/components/admin/EditableNumber";
import { useSiteData } from "@/lib/useSiteData";
import { api } from "@/lib/api";
import { formatPHP, formatNumber } from "@/lib/formatters";

const HeroModelViewer = lazy(() => import("./HeroModelViewer").then((m) => ({ default: m.HeroModelViewer })));

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Hero() {
  const { data, refetch } = useSiteData();
  const tagline = (data.settings["hero.tagline"] as string) ?? "";
  const headline = (data.settings["hero.headline"] as string) ?? "";
  const subtitle = (data.settings["hero.subtitle"] as string) ?? "";
  const sample = data.settings["hero.sampleEstimate"] ?? { investment: 12480000, timelineMonths: 14, riskLabel: "Low", riskPct: 28 };
  const modelKey = data.settings["hero.modelKey"];

  const saveSetting = async (key: string, value: unknown) => {
    await api.put("/api/admin/settings", { key, value });
    await refetch();
  };

  const saveSampleField = (field: keyof typeof sample) => async (value: string | number) => {
    await saveSetting("hero.sampleEstimate", { ...sample, [field]: value });
  };

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 10%, rgba(122,138,73,0.14), transparent 60%), radial-gradient(50% 40% at 90% 20%, rgba(199,169,79,0.16), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.4] dark:opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-ink-100) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ink-100) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 75%)",
        }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-2 lg:pt-28">
        <div>
          <motion.div variants={fadeUp} custom={-1} initial="hidden" animate="show">
            <EditableText
              as="p"
              className="text-sm italic text-olive-600 dark:text-olive-400"
              value={tagline}
              onSave={(v) => saveSetting("hero.tagline", v)}
            />
          </motion.div>

          <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show" className="mt-6">
            <EditableText
              as="h1"
              className="text-[40px] leading-[1.05] font-semibold text-ink-950 sm:text-[52px] lg:text-[60px] dark:text-white"
              value={headline}
              onSave={(v) => saveSetting("hero.headline", v)}
            />
          </motion.div>

          <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show" className="mt-6 max-w-lg">
            <EditableText
              as="p"
              multiline
              className="text-lg leading-relaxed text-ink-500 dark:text-ink-400"
              value={subtitle}
              onSave={(v) => saveSetting("hero.subtitle", v)}
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link to="/estimate">
              <Button size="lg" icon={<ArrowRight size={18} />} className="w-full sm:w-auto">
                Start Estimation
              </Button>
            </Link>
            <Button variant="secondary" size="lg" icon={<CalendarClock size={18} />} className="w-full sm:w-auto">
              Book Consultation
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            custom={4}
            initial="hidden"
            animate="show"
            className="mt-5 text-sm text-ink-400 dark:text-ink-500"
          >
            No sign-up required &middot; Takes under 2 minutes &middot; Free instant report
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative mx-auto aspect-[4/5] w-full max-w-md"
        >
          {modelKey ? (
            <Suspense
              fallback={<div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-ink-900 via-ink-800 to-olive-900 shadow-[var(--shadow-soft-lg)]" />}
            >
              <div className="absolute inset-0 rounded-[32px] shadow-[var(--shadow-soft-lg)]">
                <HeroModelViewer src={`/api/image?key=${encodeURIComponent(modelKey)}`} />
              </div>
            </Suspense>
          ) : (
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-ink-900 via-ink-800 to-olive-900 shadow-[var(--shadow-soft-lg)]">
              <div
                className="absolute inset-0 rounded-[32px] opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(45deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-2/3 rounded-b-[32px] bg-gradient-to-t from-olive-600/30 to-transparent" />
            </div>
          )}

          <motion.div className="absolute -left-6 top-8 sm:-left-10" animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <GlassCard className="w-52 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">Estimated Investment</p>
              <p className="mt-1 font-display text-xl font-semibold text-ink-900 dark:text-white">
                <EditableNumber value={sample.investment} format={formatPHP} onSave={saveSampleField("investment")} />
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp size={13} /> Mid-Market tier
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            className="absolute -right-4 top-1/2 sm:-right-8"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <GlassCard className="w-48 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">Timeline</p>
              <p className="mt-1 font-display text-xl font-semibold text-ink-900 dark:text-white">
                <EditableNumber value={sample.timelineMonths} format={(v) => `${v} months`} onSave={saveSampleField("timelineMonths")} />
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-olive-600">
                <CalendarClock size={13} /> Design to turnover
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <GlassCard className="w-56 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">Risk Score</p>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-ink-100 dark:bg-white/10">
                  <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(0, sample.riskPct))}%` }} />
                </div>
                <span className="flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-emerald-600">
                  <ShieldCheck size={13} /> <EditableText as="span" value={sample.riskLabel} onSave={saveSampleField("riskLabel")} />
                </span>
              </div>
              <div className="mt-1.5 flex justify-end">
                <span className="text-[10px] text-ink-400">
                  (<EditableNumber value={sample.riskPct} format={formatNumber} onSave={saveSampleField("riskPct")} className="text-[10px]" />%)
                </span>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
