import { useState } from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  showFullName?: boolean;
  className?: string;
}

/**
 * Renders /logo.jpg if present (drop the Archiunite logo file into the public/ folder),
 * falling back to a simple icon mark so the app never shows a broken image.
 */
export function Logo({ size = 36, showWordmark = true, showFullName = true, className }: LogoProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      {!imgFailed ? (
        <img
          src="/logo.jpg"
          alt="Archiunite Design & Construction"
          width={size}
          height={size}
          onError={() => setImgFailed(true)}
          className="rounded-xl object-contain"
          style={{ width: size, height: size }}
        />
      ) : (
        <span
          className="flex items-center justify-center rounded-xl bg-olive-600 text-white dark:bg-olive-500"
          style={{ width: size, height: size }}
        >
          <Building2 size={size * 0.5} />
        </span>
      )}
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-ink-900 dark:text-white">
          Archiunite
          {showFullName && <span className="hidden font-normal text-ink-500 sm:inline dark:text-ink-400"> Design &amp; Construction</span>}
        </span>
      )}
    </span>
  );
}
