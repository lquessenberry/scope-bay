export type Phosphor = "cyan" | "amber" | "alert" | "ok";
export type Speed = "slow" | "mid" | "fast";
export type Era = "bridge" | "slab";
export type EffectId =
  | "moire"
  | "lissajous"
  | "scope"
  | "radar"
  | "blink"
  | "meters"
  | "rings"
  | "spiral"
  | "cascade"
  | "dial"
  | "plaque"
  | "hibbars"
  | "filmstrip"
  | "alignslab";

export type DoodadSpec = {
  id: string;
  effect: EffectId;
  phosphor: Phosphor;
  speed: Speed;
  era: Era;
  label: string;
  code: string;
  glyph: string;
};

export const EFFECT_LABELS: Record<EffectId, string> = {
  moire: "Sensor sweep",
  lissajous: "Lissajous",
  scope: "Oscilloscope",
  radar: "PPI radar",
  blink: "Status bank",
  meters: "Level meters",
  rings: "Ring stack",
  spiral: "Trace wheel",
  cascade: "Data cascade",
  dial: "Sector dial",
  plaque: "Triglyph slab",
  hibbars: "Life bars",
  filmstrip: "Film graphic",
  alignslab: "Align slab",
};

export const SLAB_NATIVE = new Set<EffectId>(["plaque", "hibbars", "filmstrip", "alignslab"]);

export const ERA_LABELS: Record<Era, string> = {
  bridge: "Bridge CRT",
  slab: "1968 slab",
};

export const PHOSPHOR_LABELS: Record<Phosphor, string> = {
  cyan: "Cyan",
  amber: "Amber",
  alert: "Alert",
  ok: "Nominal",
};

export const TRIGLYPHS = [
  "NAV",
  "COM",
  "POD",
  "HIB",
  "ATM",
  "TEL",
  "CRY",
  "VEC",
  "MAG",
  "ION",
  "AFT",
  "BAY",
  "SYS",
  "RAD",
  "FLT",
  "DOK",
  "LCK",
  "ENV",
  "ORB",
  "GYR",
  "PWR",
  "LOG",
  "AIR",
  "SOL",
];

export const CATALOG: DoodadSpec[] = [
  { id: "scn-01", effect: "moire", phosphor: "cyan", speed: "slow", era: "bridge", label: "Sensor sweep", code: "SCN-01", glyph: "NAV" },
  { id: "scn-02", effect: "moire", phosphor: "amber", speed: "mid", era: "bridge", label: "Offset moire", code: "SCN-02", glyph: "RAD" },
  { id: "scn-03", effect: "lissajous", phosphor: "cyan", speed: "mid", era: "bridge", label: "X-Y figure 3:4", code: "OSC-03", glyph: "VEC" },
  { id: "scn-04", effect: "lissajous", phosphor: "ok", speed: "fast", era: "bridge", label: "X-Y figure 5:4", code: "OSC-04", glyph: "GYR" },
  { id: "scn-05", effect: "scope", phosphor: "ok", speed: "mid", era: "bridge", label: "Waveform A", code: "OSC-05", glyph: "TEL" },
  { id: "scn-06", effect: "scope", phosphor: "alert", speed: "fast", era: "bridge", label: "Waveform B", code: "OSC-06", glyph: "ION" },
  { id: "scn-07", effect: "radar", phosphor: "cyan", speed: "slow", era: "bridge", label: "Long-range PPI", code: "RDR-07", glyph: "ORB" },
  { id: "scn-08", effect: "radar", phosphor: "amber", speed: "mid", era: "bridge", label: "Close scan", code: "RDR-08", glyph: "FLT" },
  { id: "scn-09", effect: "blink", phosphor: "amber", speed: "mid", era: "bridge", label: "Bank alpha", code: "BNK-09", glyph: "SYS" },
  { id: "scn-10", effect: "blink", phosphor: "cyan", speed: "fast", era: "bridge", label: "Bank beta", code: "BNK-10", glyph: "LOG" },
  { id: "scn-11", effect: "blink", phosphor: "alert", speed: "slow", era: "bridge", label: "Caution grid", code: "BNK-11", glyph: "LCK" },
  { id: "scn-12", effect: "meters", phosphor: "ok", speed: "mid", era: "bridge", label: "Power rails", code: "PWR-12", glyph: "PWR" },
  { id: "scn-13", effect: "meters", phosphor: "amber", speed: "fast", era: "bridge", label: "Heat stack", code: "PWR-13", glyph: "ENV" },
  { id: "scn-14", effect: "rings", phosphor: "cyan", speed: "slow", era: "bridge", label: "Gyro stack", code: "GYR-14", glyph: "GYR" },
  { id: "scn-15", effect: "rings", phosphor: "alert", speed: "mid", era: "bridge", label: "Lock rings", code: "GYR-15", glyph: "DOK" },
  { id: "scn-16", effect: "spiral", phosphor: "cyan", speed: "mid", era: "bridge", label: "Trace wheel", code: "TRC-16", glyph: "MAG" },
  { id: "scn-17", effect: "spiral", phosphor: "amber", speed: "fast", era: "bridge", label: "Bezier loop", code: "TRC-17", glyph: "SOL" },
  { id: "scn-18", effect: "cascade", phosphor: "ok", speed: "slow", era: "bridge", label: "Library dump", code: "LIB-18", glyph: "COM" },
  { id: "scn-19", effect: "cascade", phosphor: "cyan", speed: "mid", era: "bridge", label: "Telemetry", code: "LIB-19", glyph: "TEL" },
  { id: "scn-20", effect: "dial", phosphor: "amber", speed: "slow", era: "bridge", label: "Heading dial", code: "NAV-20", glyph: "NAV" },
  { id: "scn-21", effect: "dial", phosphor: "cyan", speed: "fast", era: "bridge", label: "Bearing dial", code: "NAV-21", glyph: "AFT" },
  { id: "scn-22", effect: "lissajous", phosphor: "amber", speed: "slow", era: "bridge", label: "X-Y figure 2:3", code: "OSC-22", glyph: "VEC" },
  { id: "scn-23", effect: "radar", phosphor: "ok", speed: "fast", era: "bridge", label: "Contact map", code: "RDR-23", glyph: "RAD" },
  { id: "scn-24", effect: "scope", phosphor: "cyan", speed: "slow", era: "bridge", label: "Carrier wave", code: "OSC-24", glyph: "AIR" },
  { id: "scn-25", effect: "meters", phosphor: "alert", speed: "mid", era: "bridge", label: "Stress bars", code: "PWR-25", glyph: "HIB" },
  { id: "scn-26", effect: "moire", phosphor: "ok", speed: "fast", era: "bridge", label: "Interference", code: "SCN-26", glyph: "ATM" },
  { id: "scn-27", effect: "rings", phosphor: "ok", speed: "fast", era: "bridge", label: "Phase lock", code: "GYR-27", glyph: "LCK" },
  { id: "scn-28", effect: "cascade", phosphor: "amber", speed: "fast", era: "bridge", label: "Donor log", code: "LIB-28", glyph: "BAY" },
  { id: "slb-01", effect: "plaque", phosphor: "amber", speed: "slow", era: "slab", label: "Triglyph slab", code: "SLB-01", glyph: "NAV" },
  { id: "slb-02", effect: "plaque", phosphor: "cyan", speed: "mid", era: "slab", label: "Quad plaque", code: "SLB-02", glyph: "COM" },
  { id: "slb-03", effect: "plaque", phosphor: "alert", speed: "fast", era: "slab", label: "Caution plaque", code: "SLB-03", glyph: "POD" },
  { id: "slb-04", effect: "hibbars", phosphor: "ok", speed: "mid", era: "slab", label: "Life bars", code: "SLB-04", glyph: "HIB" },
  { id: "slb-05", effect: "hibbars", phosphor: "amber", speed: "slow", era: "slab", label: "Cryo stack", code: "SLB-05", glyph: "CRY" },
  { id: "slb-06", effect: "hibbars", phosphor: "cyan", speed: "fast", era: "slab", label: "Atmo stack", code: "SLB-06", glyph: "ATM" },
  { id: "slb-07", effect: "filmstrip", phosphor: "amber", speed: "slow", era: "slab", label: "Film graphic", code: "SLB-07", glyph: "BAY" },
  { id: "slb-08", effect: "filmstrip", phosphor: "alert", speed: "mid", era: "slab", label: "Band readout", code: "SLB-08", glyph: "SYS" },
  { id: "slb-09", effect: "filmstrip", phosphor: "cyan", speed: "fast", era: "slab", label: "Corridor board", code: "SLB-09", glyph: "FLT" },
  { id: "slb-10", effect: "alignslab", phosphor: "cyan", speed: "slow", era: "slab", label: "Align slab", code: "SLB-10", glyph: "ORB" },
  { id: "slb-11", effect: "alignslab", phosphor: "ok", speed: "mid", era: "slab", label: "Dock align", code: "SLB-11", glyph: "DOK" },
  { id: "slb-12", effect: "alignslab", phosphor: "amber", speed: "fast", era: "slab", label: "Vector lock", code: "SLB-12", glyph: "VEC" },
  { id: "slb-13", effect: "moire", phosphor: "amber", speed: "slow", era: "slab", label: "Slab sweep", code: "SLB-13", glyph: "RAD" },
  { id: "slb-14", effect: "lissajous", phosphor: "cyan", speed: "slow", era: "slab", label: "Slab figure", code: "SLB-14", glyph: "VEC" },
  { id: "slb-15", effect: "scope", phosphor: "ok", speed: "slow", era: "slab", label: "Slab wave", code: "SLB-15", glyph: "TEL" },
  { id: "slb-16", effect: "radar", phosphor: "amber", speed: "slow", era: "slab", label: "Slab PPI", code: "SLB-16", glyph: "ORB" },
  { id: "slb-17", effect: "blink", phosphor: "cyan", speed: "slow", era: "slab", label: "Slab bank", code: "SLB-17", glyph: "SYS" },
  { id: "slb-18", effect: "meters", phosphor: "ok", speed: "slow", era: "slab", label: "Slab rails", code: "SLB-18", glyph: "PWR" },
  { id: "slb-19", effect: "rings", phosphor: "amber", speed: "slow", era: "slab", label: "Slab gyro", code: "SLB-19", glyph: "GYR" },
  { id: "slb-20", effect: "spiral", phosphor: "cyan", speed: "slow", era: "slab", label: "Slab trace", code: "SLB-20", glyph: "MAG" },
  { id: "slb-21", effect: "cascade", phosphor: "ok", speed: "slow", era: "slab", label: "Slab log", code: "SLB-21", glyph: "LOG" },
  { id: "slb-22", effect: "dial", phosphor: "amber", speed: "slow", era: "slab", label: "Slab heading", code: "SLB-22", glyph: "NAV" },
  { id: "slb-23", effect: "moire", phosphor: "cyan", speed: "mid", era: "slab", label: "Slab interference", code: "SLB-23", glyph: "ATM" },
  { id: "slb-24", effect: "lissajous", phosphor: "amber", speed: "mid", era: "slab", label: "Slab orbit", code: "SLB-24", glyph: "GYR" },
  { id: "slb-25", effect: "radar", phosphor: "ok", speed: "mid", era: "slab", label: "Slab contact", code: "SLB-25", glyph: "FLT" },
  { id: "slb-26", effect: "scope", phosphor: "alert", speed: "mid", era: "slab", label: "Slab carrier", code: "SLB-26", glyph: "ION" },
  { id: "slb-27", effect: "blink", phosphor: "alert", speed: "mid", era: "slab", label: "Slab caution", code: "SLB-27", glyph: "LCK" },
  { id: "slb-28", effect: "meters", phosphor: "amber", speed: "mid", era: "slab", label: "Slab heat", code: "SLB-28", glyph: "ENV" },
];

export const DONORS = [
  "NORTON A.",
  "KELSO P.",
  "VANCE R.",
  "IBRAHIM S.",
  "CHEN L.",
  "OKADA T.",
  "BRIGGS H.",
  "MOREAU C.",
  "HARLAN D.",
  "VEGA M.",
  "SOLIS J.",
  "QUINN K.",
  "DONOR 47-A",
  "DONOR 12-C",
  "SYS NOMINAL",
  "CORE STABLE",
  "CREW 430",
  "RAIL OK",
  "NAV LOCK",
  "TELEMETRY",
];

export function donorAt(seed: number, tick: number) {
  return DONORS[(seed + tick) % DONORS.length];
}

export function glyphAt(seed: number, tick: number) {
  return TRIGLYPHS[(seed + tick) % TRIGLYPHS.length];
}
