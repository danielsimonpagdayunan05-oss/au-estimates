import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-900 to-olive-900 px-8 py-16 text-center sm:px-16 sm:py-20"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(40% 60% at 80% 20%, rgba(199,169,79,0.5), transparent)",
          }}
        />
        <h2 className="relative font-display text-3xl font-semibold text-white sm:text-4xl">
          Ready to see your numbers?
        </h2>
        <p className="relative mx-auto mt-4 max-w-lg text-ink-300">
          Get a complete cost and timeline estimate for your project — free, instant, and tailored to your location.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/estimate">
            <Button size="lg" icon={<ArrowRight size={18} />}>
              Start Estimation
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
            Book Consultation
          </Button>
        </div>
      </motion.div>

      <footer className="mt-10 text-center">
        <p className="font-display text-sm font-semibold text-ink-700 dark:text-ink-300">Archiunite Design &amp; Construction</p>
        <p className="mt-1 text-xs italic text-ink-400 dark:text-ink-500">"Together, let us share and build your story."</p>
      </footer>
    </section>
  );
}
