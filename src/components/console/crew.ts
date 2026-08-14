export type Duty = "watch" | "cryo" | "ready" | "aft";

export type Donor = {
  id: string;
  call: string;
  given: string;
  role: string;
  berth: string;
  duty: Duty;
  glyph: string;
};

export const DUTY_LABEL: Record<Duty, string> = {
  watch: "On watch",
  cryo: "Cryo",
  ready: "Ready",
  aft: "Aft duty",
};

export const CREW: Donor[] = [
  { id: "nrt", call: "NORTON A.", given: "Avery Norton", role: "Sensor officer", berth: "Fwd 3", duty: "watch", glyph: "NAV" },
  { id: "kls", call: "KELSO P.", given: "Priya Kelso", role: "Helmsman", berth: "Deck 1", duty: "watch", glyph: "FLT" },
  { id: "vnc", call: "VANCE R.", given: "Rook Vance", role: "Scope tech", berth: "Lab 2", duty: "ready", glyph: "TEL" },
  { id: "ibr", call: "IBRAHIM S.", given: "Samira Ibrahim", role: "Cryo lead", berth: "Bay 4", duty: "cryo", glyph: "HIB" },
  { id: "chn", call: "CHEN L.", given: "Lin Chen", role: "Librarian", berth: "Core A", duty: "watch", glyph: "LOG" },
  { id: "okd", call: "OKADA T.", given: "Toma Okada", role: "Docking", berth: "Aft lock", duty: "ready", glyph: "DOK" },
  { id: "brg", call: "BRIGGS H.", given: "Helen Briggs", role: "Rail chief", berth: "Plant 1", duty: "watch", glyph: "PWR" },
  { id: "mro", call: "MOREAU C.", given: "Camille Moreau", role: "Life support", berth: "Env 2", duty: "aft", glyph: "ATM" },
  { id: "hrl", call: "HARLAN D.", given: "Dane Harlan", role: "Navigator", berth: "Deck 1", duty: "watch", glyph: "ORB" },
  { id: "vga", call: "VEGA M.", given: "Mira Vega", role: "Gyro mate", berth: "Spin 1", duty: "ready", glyph: "GYR" },
  { id: "sls", call: "SOLIS J.", given: "Jules Solis", role: "Donor 47-A", berth: "Cryo 12", duty: "cryo", glyph: "CRY" },
  { id: "qnn", call: "QUINN K.", given: "Keir Quinn", role: "Donor 12-C", berth: "Cryo 7", duty: "cryo", glyph: "BAY" },
];

export function crewAt(tick: number, offset = 0) {
  return CREW[(tick + offset) % CREW.length];
}

export function crewByDuty(duty: Duty) {
  return CREW.filter((d) => d.duty === duty);
}
