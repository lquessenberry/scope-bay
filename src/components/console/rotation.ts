import { useEffect, useState } from "react";
import { CREW, type Donor, type Duty } from "./crew";

export type StationId = "sensor" | "helm" | "nav" | "rails" | "dock" | "life";

export const STATION_LABEL: Record<StationId, string> = {
  sensor: "Sensor",
  helm: "Helm",
  nav: "Nav",
  rails: "Rails",
  dock: "Dock",
  life: "Life",
};

export const STATION_ORDER: StationId[] = ["sensor", "helm", "nav", "rails", "dock", "life"];

const QUALIFIED: Record<StationId, string[]> = {
  sensor: ["nrt", "vnc", "chn"],
  helm: ["kls", "vga", "hrl"],
  nav: ["hrl", "nrt", "chn"],
  rails: ["brg", "mro", "vnc"],
  dock: ["okd", "hrl", "vga"],
  life: ["mro", "brg", "kls"],
};

const CRYO_LOCK = new Set(["sls", "qnn", "ibr"]);
const BY_ID = new Map(CREW.map((d) => [d.id, d]));

export const WATCH_PERIOD_MS = 12_000;

let bonusWatches = 0;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function relieveWatch() {
  bonusWatches += 1;
  notify();
}

export function watchIndexAt(now = Date.now()) {
  return Math.floor(now / WATCH_PERIOD_MS) + bonusWatches;
}

export function remainingMsAt(now = Date.now()) {
  return WATCH_PERIOD_MS - (now % WATCH_PERIOD_MS);
}

export function assignStations(index: number): Record<StationId, string> {
  const used = new Set<string>();
  const out = {} as Record<StationId, string>;
  for (const station of STATION_ORDER) {
    const pool = QUALIFIED[station];
    for (let step = 0; step < pool.length; step++) {
      const id = pool[(index + step) % pool.length];
      if (used.has(id) || CRYO_LOCK.has(id)) continue;
      used.add(id);
      out[station] = id;
      break;
    }
  }
  return out;
}

export type PostedDonor = Donor & {
  duty: Duty;
  station?: StationId;
  nextStation?: StationId;
};

export type Handoff = {
  station: StationId;
  from: Donor;
  to: Donor;
  watch: number;
};

export type RotationState = {
  watch: number;
  remainingMs: number;
  remainingLabel: string;
  current: Record<StationId, Donor>;
  next: Record<StationId, Donor>;
  roster: PostedDonor[];
  handoffs: Handoff[];
};

function donor(id: string) {
  return BY_ID.get(id) ?? CREW[0];
}

function mapStations(ids: Record<StationId, string>) {
  const out = {} as Record<StationId, Donor>;
  for (const station of STATION_ORDER) {
    if (ids[station]) out[station] = donor(ids[station]);
  }
  return out;
}

export function computeRotation(now = Date.now()): RotationState {
  const watch = watchIndexAt(now);
  const remainingMs = remainingMsAt(now);
  const here = assignStations(watch);
  const coming = assignStations(watch + 1);
  const prior = assignStations(watch - 1);

  const onNow = new Set(Object.values(here));
  const onNext = new Set(Object.values(coming));
  const onPrior = new Set(Object.values(prior));

  const stationOf = new Map<string, StationId>();
  const nextOf = new Map<string, StationId>();
  for (const station of STATION_ORDER) {
    if (here[station]) stationOf.set(here[station], station);
    if (coming[station]) nextOf.set(coming[station], station);
  }

  const roster: PostedDonor[] = CREW.map((person) => {
    if (CRYO_LOCK.has(person.id)) {
      return { ...person, duty: "cryo" as const };
    }
    if (onNow.has(person.id)) {
      return { ...person, duty: "watch" as const, station: stationOf.get(person.id), nextStation: nextOf.get(person.id) };
    }
    if (onNext.has(person.id)) {
      return { ...person, duty: "ready" as const, nextStation: nextOf.get(person.id) };
    }
    if (onPrior.has(person.id)) {
      return { ...person, duty: "aft" as const };
    }
    return { ...person, duty: "ready" as const };
  });

  const handoffs: Handoff[] = [];
  for (let back = 1; back <= 3; back++) {
    const fromIds = assignStations(watch - back);
    const toIds = assignStations(watch - back + 1);
    const station: StationId = "sensor";
    if (fromIds[station] && toIds[station] && fromIds[station] !== toIds[station]) {
      handoffs.push({
        station,
        from: donor(fromIds[station]),
        to: donor(toIds[station]),
        watch: watch - back + 1,
      });
    }
  }

  const sec = Math.max(0, Math.ceil(remainingMs / 1000));
  return {
    watch,
    remainingMs,
    remainingLabel: `0:${String(sec).padStart(2, "0")}`,
    current: mapStations(here),
    next: mapStations(coming),
    roster,
    handoffs,
  };
}

export function useWatchRotation(live: boolean) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const bump = () => setNow(Date.now());
    listeners.add(bump);
    bump();
    return () => {
      listeners.delete(bump);
    };
  }, []);

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [live]);

  return { ...computeRotation(now), relieve: relieveWatch };
}
