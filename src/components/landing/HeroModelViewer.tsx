import "@google/model-viewer";
import type { CSSProperties } from "react";

export function HeroModelViewer({ src }: { src: string }) {
  return (
    <model-viewer
      src={src}
      alt="Interactive 3D preview of a sample project"
      camera-controls
      auto-rotate
      auto-rotate-delay={1200}
      shadow-intensity="1"
      shadow-softness="0.8"
      exposure="1.05"
      interaction-prompt="none"
      loading="eager"
      className="absolute inset-0 h-full w-full rounded-[32px] bg-gradient-to-br from-ink-900 via-ink-800 to-olive-900"
      style={{ "--poster-color": "transparent" } as CSSProperties}
    />
  );
}
