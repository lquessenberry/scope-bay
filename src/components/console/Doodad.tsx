import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { donorAt, glyphAt, SLAB_NATIVE, type DoodadSpec } from "./catalog";
import { EffectView } from "./effects";

export function Doodad({
  spec,
  selected,
  onSelect,
  compact = false,
  wide = false,
  live = true,
  className,
}: {
  spec: DoodadSpec;
  selected: boolean;
  onSelect: (id: string) => void;
  compact?: boolean;
  wide?: boolean;
  live?: boolean;
  className?: string;
}) {
  const [tick, setTick] = useState(0);
  const seed = spec.id.charCodeAt(spec.id.length - 1) + spec.id.length * 3;

  useEffect(() => {
    if (!live) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(
      () => setTick((n) => n + 1),
      (spec.era === "slab" ? 2400 : 1700) + (seed % 500),
    );
    return () => window.clearInterval(id);
  }, [seed, spec.era, live]);

  const native = SLAB_NATIVE.has(spec.effect);
  const liveGlyph = native ? spec.glyph : glyphAt(seed, tick);

  return (
    <article
      data-phosphor={spec.phosphor}
      data-speed={spec.speed}
      data-era={spec.era}
      data-live={live ? "on" : "off"}
      data-grid={wide ? "wide" : compact ? "compact" : "unit"}
      className={cn(
        "doodad group flex flex-col overflow-hidden border bg-panel",
        "border-bezel transition-[border-color,box-shadow] duration-150",
        selected ? "border-[var(--phos)] shadow-[0_0_0_1px_var(--phos)]" : "hover:border-mute/60",
        className,
      )}
    >
      <header
        className={cn(
          "flex items-center justify-between gap-2 border-b border-bezel bg-rail",
          compact ? "px-1.5 py-0.5" : "px-2 py-1",
        )}
      >
        <span className="font-mono text-[0.58rem] tracking-wider text-mute">{spec.code}</span>
        {!compact ? (
          <span className="truncate font-mono text-[0.62rem] uppercase tracking-wide text-faint">
            {spec.label}
          </span>
        ) : null}
      </header>

      <button
        type="button"
        onClick={() => onSelect(spec.id)}
        onMouseEnter={(e) => e.currentTarget.closest(".doodad")?.classList.add("is-hot")}
        onMouseLeave={(e) => e.currentTarget.closest(".doodad")?.classList.remove("is-hot")}
        className={cn("relative w-full bg-chassis", wide ? "aspect-[2/1]" : "aspect-square")}
        aria-pressed={selected}
        aria-label={`${spec.label} ${spec.code}`}
      >
        {live ? (
          <EffectView
            effect={spec.effect}
            phosphor={spec.phosphor}
            speed={spec.speed}
            glyph={liveGlyph}
            era={spec.era}
          />
        ) : (
          <div className="doodad__idle absolute inset-0" />
        )}
        {!native ? (
          <div className={cn("doodad__triglyph", spec.era === "slab" && "doodad__triglyph--slab")}>
            {liveGlyph}
          </div>
        ) : null}
        <div className="doodad__crt absolute inset-0" />
        <div className="doodad__vignette absolute inset-0" />
      </button>

      <footer
        className={cn(
          "flex items-center justify-between gap-2 border-t border-bezel bg-chassis",
          compact ? "px-1.5 py-0.5" : "px-2 py-1",
        )}
      >
        <span className="font-mono text-[0.52rem] tracking-widest text-faint">
          {compact ? spec.glyph : "STATUS"}
        </span>
        <span className="doodad__status-val truncate font-mono text-[0.58rem] tracking-wider text-[var(--phos)]">
          {donorAt(seed, tick)}
        </span>
      </footer>
    </article>
  );
}
