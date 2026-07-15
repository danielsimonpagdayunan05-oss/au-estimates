import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

export function AnimatedValue({ value, children, className }: { value: string | number; children: ReactNode; className?: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={String(value)}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}
