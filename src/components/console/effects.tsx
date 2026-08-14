import { useEffect, useRef, useState } from "react";
import type { EffectId, Era, Phosphor, Speed } from "./catalog";
import { TRIGLYPHS } from "./catalog";

const PHOS_VAR: Record<Phosphor, string> = {
  cyan: "--color-cyan",
  amber: "--color-amber",
  alert: "--color-alert",
  ok: "--color-ok",
};

function usePhosphorColor(phosphor: Phosphor) {
  const [color, setColor] = useState("#3ad4e6");
  useEffect(() => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(PHOS_VAR[phosphor]);
    if (raw.trim()) setColor(raw.trim());
  }, [phosphor]);
  return color;
}

function useCanvasLoop(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void,
  deps: unknown[],
) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let t = 0;
    let alive = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = () => {
      if (!alive) return;
      const w = canvas.width;
      const h = canvas.height;
      draw(ctx, w, h, t);
      t += 0.028;
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

export function Lissajous({
  phosphor,
  speed,
  a,
  b,
  slab = false,
}: {
  phosphor: Phosphor;
  speed: Speed;
  a: number;
  b: number;
  slab?: boolean;
}) {
  const color = usePhosphorColor(phosphor);
  const stroke = slab ? "rgba(244,239,228,0.72)" : color;
  const rate = (speed === "fast" ? 1.6 : speed === "slow" ? 0.55 : 1) * (slab ? 0.38 : 1);
  const ref = useCanvasLoop(
    (ctx, w, h, t) => {
      ctx.fillStyle = slab ? "rgba(7,8,9,0.18)" : "rgba(5,6,7,0.16)";
      ctx.fillRect(0, 0, w, h);
      const figures = slab ? [0, 0.85] : [0];
      for (const phase of figures) {
        ctx.beginPath();
        const steps = slab ? 260 : 320;
        for (let i = 0; i < steps; i++) {
          const u = t * rate + i * 0.018 + phase;
          const x = w / 2 + Math.sin(a * u) * w * (0.34 + phase * 0.04);
          const y = h / 2 + Math.sin(b * u + Math.PI / 5 + phase) * h * (0.34 + phase * 0.03);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = phase === 0 ? stroke : "rgba(244,239,228,0.32)";
        ctx.lineWidth = Math.max(1, w / (slab ? 160 : 110));
        ctx.shadowBlur = slab ? 0 : 8;
        ctx.shadowColor = stroke;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    },
    [color, stroke, a, b, rate, slab],
  );
  if (!slab) return <canvas ref={ref} className="absolute inset-0 size-full" aria-hidden />;
  return (
    <div className="fx-slab-field absolute inset-0">
      <canvas ref={ref} className="absolute inset-0 size-full" aria-hidden />
    </div>
  );
}

export function Oscilloscope({
  phosphor,
  speed,
  slab = false,
}: {
  phosphor: Phosphor;
  speed: Speed;
  slab?: boolean;
}) {
  const color = usePhosphorColor(phosphor);
  const stroke = slab ? "rgba(244,239,228,0.7)" : color;
  const rate = (speed === "fast" ? 2.1 : speed === "slow" ? 0.7 : 1.2) * (slab ? 0.36 : 1);
  const ref = useCanvasLoop(
    (ctx, w, h, t) => {
      ctx.fillStyle = slab ? "rgba(7,8,9,0.2)" : "rgba(5,6,7,0.22)";
      ctx.fillRect(0, 0, w, h);
      const traces = slab ? [0.34, 0.62] : [0.5];
      traces.forEach((slot, n) => {
        ctx.beginPath();
        const mid = h * slot;
        for (let x = 0; x <= w; x += 2) {
          const nx = x / w;
          const y =
            mid +
            Math.sin(nx * Math.PI * (5 + n) + t * rate * 3) * h * 0.08 +
            Math.sin(nx * Math.PI * (13 + n * 3) + t * rate * 1.6) * h * 0.035;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = n === 0 ? stroke : "rgba(244,239,228,0.35)";
        ctx.lineWidth = Math.max(1, w / 140);
        ctx.shadowBlur = slab ? 0 : 7;
        ctx.shadowColor = stroke;
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
    },
    [color, stroke, rate, slab],
  );
  if (!slab) return <canvas ref={ref} className="absolute inset-0 size-full" aria-hidden />;
  return (
    <div className="fx-slab-field absolute inset-0">
      <canvas ref={ref} className="absolute inset-0 size-full" aria-hidden />
    </div>
  );
}

function MoireSweep() {
  return (
    <div className="fx-moire absolute inset-0 overflow-hidden">
      <div className="fx-moire__a" />
      <div className="fx-moire__b" />
    </div>
  );
}

function RadarSweep() {
  const blips = [
    { t: "18%", l: "62%" },
    { t: "38%", l: "28%" },
    { t: "64%", l: "70%" },
    { t: "52%", l: "46%" },
  ];
  return (
    <div className="fx-radar absolute inset-0 overflow-hidden">
      <div className="fx-radar__arm" />
      {blips.map((b) => (
        <span key={`${b.t}${b.l}`} className="fx-radar__blip" style={{ top: b.t, left: b.l }} />
      ))}
    </div>
  );
}

function BlinkGrid() {
  return (
    <div className="fx-blink absolute inset-0">
      {Array.from({ length: 36 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

function LevelMeters() {
  return (
    <div className="fx-meters absolute inset-0">
      {Array.from({ length: 8 }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}

function RingWheel() {
  return (
    <div className="fx-rings absolute inset-0">
      <b />
      <b />
      <b />
      <b />
    </div>
  );
}

function SectorDial() {
  return (
    <div className="fx-dial absolute inset-0">
      <div className="fx-dial__disc" />
      <div className="fx-dial__needle" />
    </div>
  );
}

function DataCascade() {
  const lines = [
    "0x3A  STATUS  OK",
    "NAV   184.2   LOCK",
    "CORE  0.97    STABLE",
    "DONOR QUEUE   12",
    "TEL   44-B    LIVE",
    "HEAT  0.41    NOM",
    "BANK  ALPHA   SET",
    "SCOPE CH-2    ARM",
    "PPI   SWEEP   3.1",
    "CREW  430     AFT",
    "RAIL  +12V    OK",
    "LOG   APPEND  YES",
  ];
  const block = [...lines, ...lines].join("\n");
  return (
    <div className="fx-cascade absolute inset-0">
      <div className="fx-cascade__track">{block}</div>
    </div>
  );
}

function TraceSpiral() {
  return (
    <div className="fx-spiral absolute inset-0 p-2">
      <svg viewBox="0 0 100 100" aria-hidden>
        <path d="M50 12 C 78 12, 88 32, 88 50 C 88 78, 68 88, 50 88 C 22 88, 12 68, 12 50 C 12 28, 28 18, 46 18 C 70 18, 78 36, 76 52 C 74 70, 58 78, 46 76 C 32 74, 26 60, 28 50 C 30 38, 42 34, 50 36 C 62 38, 66 48, 64 56 C 62 64, 54 66, 50 64" />
      </svg>
    </div>
  );
}

function AlignSlab({ glyph }: { glyph: string }) {
  return (
    <div className="fx-align absolute inset-0">
      <div className="fx-align__ring" />
      <div className="fx-align__cross" />
      <div className="fx-align__mark">{glyph}</div>
    </div>
  );
}

function TriglyphPlaque({ cells }: { cells: string[] }) {
  return (
    <div className="fx-plaque absolute inset-0">
      {cells.map((code, i) => (
        <div key={`${code}-${i}`} className="fx-plaque__cell">
          {code}
        </div>
      ))}
    </div>
  );
}

function HibBars({ rows }: { rows: { tag: string }[] }) {
  return (
    <div className="fx-hib absolute inset-0">
      {rows.map((row, i) => (
        <div key={`${row.tag}-${i}`} className="fx-hib__row">
          <span className="fx-hib__tag">{row.tag}</span>
          <div className="fx-hib__bar">
            <div className="fx-hib__fill" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FilmGraphic({ bands }: { bands: { tag: string; num: string }[] }) {
  return (
    <div className="fx-film absolute inset-0">
      {bands.map((band, i) => (
        <div key={`${band.tag}-${i}`} className="fx-film__band">
          <span>{band.tag}</span>
          <span className="fx-film__num">{band.num}</span>
        </div>
      ))}
    </div>
  );
}

function SlabMoire() {
  return (
    <div className="fx-slab-field fx-slab-moire absolute inset-0 overflow-hidden">
      <div className="fx-slab-moire__a" />
      <div className="fx-slab-moire__b" />
    </div>
  );
}

function SlabRadar({ glyph }: { glyph: string }) {
  const start = Math.max(0, TRIGLYPHS.indexOf(glyph));
  const ticks = [
    { top: "6%", left: "44%" },
    { top: "22%", left: "78%" },
    { top: "72%", left: "78%" },
    { top: "86%", left: "44%" },
    { top: "72%", left: "8%" },
    { top: "22%", left: "8%" },
  ];
  const blips = [
    { t: "22%", l: "60%" },
    { t: "40%", l: "30%" },
    { t: "58%", l: "68%" },
    { t: "48%", l: "48%" },
    { t: "70%", l: "36%" },
    { t: "32%", l: "74%" },
  ];
  return (
    <div className="fx-slab-field fx-slab-radar absolute inset-0">
      <div className="fx-slab-radar__ring" />
      <div className="fx-slab-radar__arm" />
      {ticks.map((pos, i) => (
        <span key={i} className="fx-slab-radar__tick" style={pos}>
          {TRIGLYPHS[(start + i) % TRIGLYPHS.length]}
        </span>
      ))}
      {blips.map((b) => (
        <span key={`${b.t}${b.l}`} className="fx-slab-radar__blip" style={{ top: b.t, left: b.l }} />
      ))}
    </div>
  );
}

function SlabBank({ glyph }: { glyph: string }) {
  const start = Math.max(0, TRIGLYPHS.indexOf(glyph));
  const cells = Array.from({ length: 9 }, (_, i) => TRIGLYPHS[(start + i * 2) % TRIGLYPHS.length]);
  return (
    <div className="fx-slab-blink absolute inset-0">
      {cells.map((code, i) => (
        <div key={`${code}-${i}`} className="fx-slab-blink__cell">
          {code}
        </div>
      ))}
    </div>
  );
}

function SlabMeters({ glyph }: { glyph: string }) {
  const start = Math.max(0, TRIGLYPHS.indexOf(glyph));
  const tags = Array.from({ length: 6 }, (_, i) => TRIGLYPHS[(start + i) % TRIGLYPHS.length]);
  return (
    <div className="fx-slab-field fx-slab-meters absolute inset-0">
      {tags.map((tag, i) => (
        <div key={`${tag}-${i}`} className="fx-slab-meters__col">
          <span className="fx-slab-meters__tag">{tag}</span>
          <div className="fx-slab-meters__bar">
            <div className="fx-slab-meters__fill" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SlabRings() {
  return (
    <div className="fx-slab-field fx-slab-rings absolute inset-0">
      <b />
      <b />
      <b />
      <b />
      <span className="fx-slab-rings__pip" />
    </div>
  );
}

function SlabSpiral() {
  return (
    <div className="fx-slab-field fx-slab-spiral absolute inset-0 p-2">
      <svg viewBox="0 0 100 100" aria-hidden>
        <path d="M50 12 C 78 12, 88 32, 88 50 C 88 78, 68 88, 50 88 C 22 88, 12 68, 12 50 C 12 28, 28 18, 46 18 C 70 18, 78 36, 76 52 C 74 70, 58 78, 46 76 C 32 74, 26 60, 28 50 C 30 38, 42 34, 50 36 C 62 38, 66 48, 64 56 C 62 64, 54 66, 50 64" />
        <path d="M50 22 C 70 22, 78 36, 78 50 C 78 70, 64 78, 50 78 C 30 78, 22 64, 22 50 C 22 34, 34 26, 48 26 C 64 26, 70 40, 68 52" />
      </svg>
    </div>
  );
}

function SlabCascade({ glyph }: { glyph: string }) {
  const start = Math.max(0, TRIGLYPHS.indexOf(glyph));
  const cols = [0, 1, 2].map((c) => {
    const list = Array.from({ length: 10 }, (_, i) => TRIGLYPHS[(start + c * 3 + i) % TRIGLYPHS.length]);
    return [...list, ...list].join("\n");
  });
  return (
    <div className="fx-slab-cascade absolute inset-0">
      {cols.map((block, i) => (
        <div key={i} className="fx-slab-cascade__col">
          <div className="fx-slab-cascade__track">{block}</div>
        </div>
      ))}
    </div>
  );
}

function SlabDial({ glyph }: { glyph: string }) {
  return (
    <div className="fx-slab-field fx-slab-dial absolute inset-0">
      <div className="fx-slab-dial__disc" />
      <div className="fx-slab-dial__inner" />
      <div className="fx-slab-dial__needle" />
      <div className="fx-slab-dial__mark">{glyph}</div>
    </div>
  );
}

export function EffectView({
  effect,
  phosphor,
  speed,
  glyph,
  era = "bridge",
}: {
  effect: EffectId;
  phosphor: Phosphor;
  speed: Speed;
  glyph: string;
  era?: Era;
}) {
  const slab = era === "slab";

  switch (effect) {
    case "moire":
      return slab ? <SlabMoire /> : <MoireSweep />;
    case "lissajous":
      return (
        <Lissajous
          phosphor={phosphor}
          speed={speed}
          a={speed === "fast" ? 5 : 3}
          b={speed === "slow" ? 2 : 4}
          slab={slab}
        />
      );
    case "scope":
      return <Oscilloscope phosphor={phosphor} speed={speed} slab={slab} />;
    case "radar":
      return slab ? <SlabRadar glyph={glyph} /> : <RadarSweep />;
    case "blink":
      return slab ? <SlabBank glyph={glyph} /> : <BlinkGrid />;
    case "meters":
      return slab ? <SlabMeters glyph={glyph} /> : <LevelMeters />;
    case "rings":
      return slab ? <SlabRings /> : <RingWheel />;
    case "spiral":
      return slab ? <SlabSpiral /> : <TraceSpiral />;
    case "cascade":
      return slab ? <SlabCascade glyph={glyph} /> : <DataCascade />;
    case "dial":
      return slab ? <SlabDial glyph={glyph} /> : <SectorDial />;
    case "plaque": {
      const extras = TRIGLYPHS.filter((c) => c !== glyph).slice(0, 3);
      return <TriglyphPlaque cells={[glyph, ...extras]} />;
    }
    case "hibbars":
      return (
        <HibBars
          rows={[
            { tag: glyph },
            { tag: glyph === "ATM" ? "ENV" : "ATM" },
            { tag: glyph === "CRY" ? "HIB" : "CRY" },
            { tag: glyph === "PWR" ? "SOL" : "PWR" },
          ]}
        />
      );
    case "filmstrip": {
      const unused = TRIGLYPHS.filter((c) => c !== glyph && !["ENV", "FLT", "BAY"].includes(c));
      const tags = [glyph, unused[0] ?? "ENV", unused[1] ?? "FLT", unused[2] ?? "SYS"];
      return (
        <FilmGraphic
          bands={tags.map((tag, i) => ({ tag, num: String(i + 1).padStart(2, "0") }))}
        />
      );
    }
    case "alignslab":
      return <AlignSlab glyph={glyph} />;
    default:
      return null;
  }
}
