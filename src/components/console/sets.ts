import { CATALOG, type DoodadSpec, type Era } from "./catalog";

export type InstrumentSet = {
  id: string;
  title: string;
  hint: string;
  era: Era;
  ids: string[];
};

export const SETS: InstrumentSet[] = [
  { id: "crt-sensor", title: "Sensor deck", hint: "Moire + PPI", era: "bridge", ids: ["scn-01", "scn-02", "scn-07", "scn-08"] },
  { id: "crt-trace", title: "Trace deck", hint: "Lissajous + scope", era: "bridge", ids: ["scn-03", "scn-05", "scn-06", "scn-24"] },
  { id: "crt-bank", title: "Bank deck", hint: "Status + meters", era: "bridge", ids: ["scn-09", "scn-10", "scn-12", "scn-13"] },
  { id: "crt-gyro", title: "Gyro deck", hint: "Rings + dials", era: "bridge", ids: ["scn-14", "scn-16", "scn-20", "scn-21"] },
  { id: "crt-lib", title: "Library deck", hint: "Cascade + extras", era: "bridge", ids: ["scn-18", "scn-19", "scn-11", "scn-28"] },
  { id: "crt-aux", title: "Auxiliary CRT", hint: "Spare figures", era: "bridge", ids: ["scn-04", "scn-22", "scn-23", "scn-25"] },
  { id: "crt-lock", title: "Lock deck", hint: "Phase + heat", era: "bridge", ids: ["scn-15", "scn-17", "scn-26", "scn-27"] },
  { id: "slab-plaque", title: "Plaque bay", hint: "Triglyph fields", era: "slab", ids: ["slb-01", "slb-02", "slb-03", "slb-07"] },
  { id: "slab-life", title: "Life bay", hint: "Bars + film", era: "slab", ids: ["slb-04", "slb-05", "slb-06", "slb-08"] },
  { id: "slab-align", title: "Align bay", hint: "Lock slabs", era: "slab", ids: ["slb-10", "slb-11", "slb-12", "slb-09"] },
  { id: "slab-sensor", title: "Slab sensors", hint: "Sweep + PPI", era: "slab", ids: ["slb-13", "slb-16", "slb-23", "slb-25"] },
  { id: "slab-trace", title: "Slab traces", hint: "Figure + wave", era: "slab", ids: ["slb-14", "slb-15", "slb-24", "slb-26"] },
  { id: "slab-bank", title: "Slab banks", hint: "Bank + rails", era: "slab", ids: ["slb-17", "slb-18", "slb-27", "slb-28"] },
  { id: "slab-gyro", title: "Slab gyros", hint: "Gyro + log + heading", era: "slab", ids: ["slb-19", "slb-20", "slb-21", "slb-22"] },
];

const BY_ID = new Map(CATALOG.map((d) => [d.id, d]));

export type LivePage = {
  set: InstrumentSet;
  items: DoodadSpec[];
};

export function pagesFor(
  items: DoodadSpec[],
  era: Era | "all",
): LivePage[] {
  const allowed = new Set(items.map((d) => d.id));
  const pages: LivePage[] = [];
  const used = new Set<string>();

  for (const set of SETS) {
    if (era !== "all" && set.era !== era) continue;
    const next = set.ids.map((id) => BY_ID.get(id)).filter((d): d is DoodadSpec => !!d && allowed.has(d.id));
    if (next.length === 0) continue;
    pages.push({ set, items: next });
    next.forEach((d) => used.add(d.id));
  }

  const leftovers = items.filter((d) => !used.has(d.id));
  for (let i = 0; i < leftovers.length; i += 4) {
    const chunk = leftovers.slice(i, i + 4);
    pages.push({
      set: {
        id: `rest-${i / 4}`,
        title: "Overflow rack",
        hint: "Filtered remainder",
        era: chunk[0]?.era ?? "bridge",
        ids: chunk.map((d) => d.id),
      },
      items: chunk,
    });
  }

  return pages;
}
