import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { DoodadSpec } from "./catalog";
import { Doodad } from "./Doodad";
import { DUTY_LABEL, type Duty } from "./crew";
import {
  STATION_LABEL,
  STATION_ORDER,
  useWatchRotation,
  type PostedDonor,
} from "./rotation";

function DutyMark({ duty }: { duty: Duty }) {
  const tone =
    duty === "watch"
      ? "text-ok border-ok/40"
      : duty === "cryo"
        ? "text-amber border-amber/40"
        : duty === "aft"
          ? "text-mute border-bezel"
          : "text-cyan border-cyan/40";
  return (
    <span className={cn("border px-1.5 py-0.5 font-mono text-xs uppercase tracking-wider", tone)}>
      {DUTY_LABEL[duty]}
    </span>
  );
}

function DonorRow({
  donor,
  active,
  onPick,
}: {
  donor: PostedDonor;
  active: boolean;
  onPick: (id: string) => void;
}) {
  const post = donor.station
    ? STATION_LABEL[donor.station]
    : donor.nextStation
      ? `Next ${STATION_LABEL[donor.nextStation]}`
      : donor.role;
  return (
    <button
      type="button"
      onClick={() => onPick(donor.id)}
      className={cn(
        "grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-bezel px-3 py-2.5 text-left transition-colors duration-150",
        active ? "bg-rail" : "hover:bg-rail/60",
      )}
    >
      <span className="font-micro text-xs tracking-widest text-mute">{donor.glyph}</span>
      <span className="min-w-0">
        <span className="block truncate font-display text-lg font-semibold uppercase leading-none tracking-tight">
          {donor.given}
        </span>
        <span className="mt-1 block truncate font-mono text-xs tracking-wider text-mute">
          {post} · {donor.berth}
        </span>
      </span>
      <DutyMark duty={donor.duty} />
    </button>
  );
}

function BoardChrome({
  kicker,
  title,
  aside,
  children,
}: {
  kicker: string;
  title: string;
  aside?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-xs tracking-widest text-faint">{kicker}</p>
          <h2 className="font-display text-3xl font-semibold uppercase leading-none tracking-tight">{title}</h2>
        </div>
        {aside ? <p className="font-mono text-xs tracking-widest text-mute">{aside}</p> : null}
      </header>
      {children}
    </div>
  );
}

export function WatchBoard({
  items,
  live,
  selected,
  onSelect,
}: {
  items: DoodadSpec[];
  live: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const rot = useWatchRotation(live);
  const sensor = rot.current.sensor;
  const incoming = rot.next.sensor;
  const bill = rot.roster.filter((d) => d.station || d.nextStation || d.duty === "aft");
  const primary = items[0];
  const lastHand = rot.handoffs[0];

  return (
    <BoardChrome
      kicker={`Watch ${String(rot.watch % 1000).padStart(3, "0")} · Relief in ${rot.remainingLabel}`}
      title="Who has the dish"
      aside={`${sensor.call} · next ${incoming.call}`}
    >
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)]">
        {primary ? (
          <Doodad spec={primary} selected={primary.id === selected} onSelect={onSelect} live={live} />
        ) : null}
        <aside className="flex max-h-[28rem] flex-col border border-bezel bg-panel">
          <div className="flex items-center justify-between gap-2 border-b border-bezel bg-rail px-3 py-2">
            <h3 className="font-mono text-xs tracking-widest text-faint">Watch bill</h3>
            <button
              type="button"
              onClick={rot.relieve}
              className="h-8 border border-bezel px-2 font-mono text-xs tracking-widest text-cyan hover:border-cyan"
            >
              Relieve
            </button>
          </div>
          <ol className="min-h-0 flex-1 overflow-y-auto">
            {bill.map((donor) => (
              <li key={donor.id}>
                <DonorRow
                  donor={donor}
                  active={donor.id === sensor.id}
                  onPick={() => onSelect(primary?.id ?? donor.id)}
                />
              </li>
            ))}
          </ol>
          <div className="mt-auto space-y-2 border-t border-bezel px-3 py-3">
            <p className="text-sm leading-relaxed text-mute">
              <span className="font-display text-xl font-semibold uppercase tracking-tight text-ink">
                {sensor.given}
              </span>{" "}
              has sensor. {incoming.given} stands ready.
            </p>
            {lastHand ? (
              <p className="font-mono text-xs tracking-wider text-faint">
                Last handoff · {lastHand.from.call} → {lastHand.to.call}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
      <ul className="grid grid-cols-2 gap-px border border-bezel bg-bezel sm:grid-cols-3 lg:grid-cols-6">
        {STATION_ORDER.map((station) => {
          const holder = rot.current[station];
          return (
            <li key={station} className="bg-panel px-3 py-2">
              <p className="font-mono text-xs tracking-widest text-faint">{STATION_LABEL[station]}</p>
              <p className="font-display text-base font-semibold uppercase tracking-tight">
                {holder?.given ?? "—"}
              </p>
            </li>
          );
        })}
      </ul>
    </BoardChrome>
  );
}

export function HelmBoard({
  items,
  live,
  selected,
  onSelect,
}: {
  items: DoodadSpec[];
  live: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const rot = useWatchRotation(live);
  const helm = rot.current.helm;
  const nav = rot.current.nav;

  return (
    <BoardChrome
      kicker={`Watch ${String(rot.watch % 1000).padStart(3, "0")} · ${rot.remainingLabel}`}
      title="On the stick"
      aside={`${helm.call} · ${nav.call}`}
    >
      <div className="grid grid-cols-2 gap-3">
        {items.slice(0, 2).map((spec) => (
          <Doodad key={spec.id} spec={spec} selected={spec.id === selected} onSelect={onSelect} live={live} />
        ))}
      </div>
      <dl className="grid grid-cols-2 gap-px border border-bezel bg-bezel sm:grid-cols-4">
        <div className="bg-panel px-3 py-3">
          <dt className="font-mono text-xs tracking-widest text-faint">Helmsman</dt>
          <dd className="mt-1 font-display text-2xl font-semibold uppercase leading-none tracking-tight">{helm.given}</dd>
        </div>
        <div className="bg-panel px-3 py-3">
          <dt className="font-mono text-xs tracking-widest text-faint">Navigator</dt>
          <dd className="mt-1 font-display text-2xl font-semibold uppercase leading-none tracking-tight">{nav.given}</dd>
        </div>
        <div className="bg-panel px-3 py-3">
          <dt className="font-mono text-xs tracking-widest text-faint">Next helm</dt>
          <dd className="mt-1 font-mono text-sm tracking-wider text-ink">{rot.next.helm.given}</dd>
        </div>
        <div className="bg-panel px-3 py-3">
          <dt className="font-mono text-xs tracking-widest text-faint">Duty</dt>
          <dd className="mt-1">
            <DutyMark duty="watch" />
          </dd>
        </div>
      </dl>
    </BoardChrome>
  );
}

export function CryoBoard({
  items,
  live,
  selected,
  onSelect,
}: {
  items: DoodadSpec[];
  live: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const rot = useWatchRotation(live);
  const cryo = rot.roster.filter((d) => d.duty === "cryo");
  const focus = cryo[rot.watch % Math.max(1, cryo.length)];

  return (
    <BoardChrome kicker="Station · Cryo bay" title="Donor roster" aside="Tanks stay off the watch bill">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="overflow-x-auto border border-bezel">
          <table className="w-full text-left">
            <thead className="bg-rail font-mono text-xs tracking-widest text-faint">
              <tr>
                <th className="px-3 py-2 font-normal">Donor</th>
                <th className="px-3 py-2 font-normal">Call</th>
                <th className="px-3 py-2 font-normal">Berth</th>
                <th className="px-3 py-2 font-normal">State</th>
              </tr>
            </thead>
            <tbody>
              {rot.roster.map((donor) => (
                <tr
                  key={donor.id}
                  className={cn(
                    "border-t border-bezel",
                    focus && donor.id === focus.id ? "bg-rail" : "bg-panel",
                  )}
                >
                  <th className="px-3 py-2 font-display text-base font-semibold uppercase tracking-tight text-ink">
                    {donor.given}
                  </th>
                  <td className="px-3 py-2 font-mono text-xs tracking-wider text-mute">{donor.call}</td>
                  <td className="px-3 py-2 font-mono text-xs tracking-wider text-mute">{donor.berth}</td>
                  <td className="px-3 py-2">
                    <DutyMark duty={donor.duty} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3">
          {items.slice(0, 2).map((spec) => (
            <Doodad key={spec.id} spec={spec} selected={spec.id === selected} onSelect={onSelect} live={live} />
          ))}
        </div>
      </div>
    </BoardChrome>
  );
}

export function LibraryBoard({
  items,
  live,
  selected,
  onSelect,
}: {
  items: DoodadSpec[];
  live: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const rot = useWatchRotation(live);
  const entries = rot.handoffs.map((hand, i) => ({
    donor: hand.to,
    stamp: `2268.${String((rot.watch - i) % 1000).padStart(3, "0")}`,
    note: `Relieved ${hand.from.given} on ${STATION_LABEL[hand.station].toLowerCase()}.`,
  }));
  if (entries.length === 0) {
    const donor = rot.current.sensor;
    entries.push({
      donor,
      stamp: `2268.${String(rot.watch % 1000).padStart(3, "0")}`,
      note: "Signed the sensor log. Sweep nominal.",
    });
  }

  return (
    <BoardChrome kicker="Station · Library" title="Donor log" aside="Handoffs from the watch clock">
      <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
        {items[0] ? (
          <Doodad spec={items[0]} selected={items[0].id === selected} onSelect={onSelect} live={live} />
        ) : null}
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <article key={entry.donor.id + entry.stamp} className="border border-bezel bg-panel px-4 py-3">
              <header className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-xl font-semibold uppercase tracking-tight">{entry.donor.given}</h3>
                <time className="font-mono text-xs tracking-widest text-faint" dateTime={entry.stamp}>
                  {entry.stamp}
                </time>
              </header>
              <p className="mt-1 font-mono text-xs tracking-wider text-mute">
                {entry.donor.call} · {entry.donor.role}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink">{entry.note}</p>
            </article>
          ))}
        </div>
      </div>
    </BoardChrome>
  );
}

export function DockBoard({
  items,
  live,
  selected,
  onSelect,
}: {
  items: DoodadSpec[];
  live: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const rot = useWatchRotation(live);
  const dock = rot.current.dock;
  const nav = rot.current.nav;

  return (
    <BoardChrome
      kicker={`Watch ${String(rot.watch % 1000).padStart(3, "0")} · ${rot.remainingLabel}`}
      title="Who has the lock"
      aside={`${dock.call} on the collar`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {items.slice(0, 2).map((spec) => (
          <Doodad key={spec.id} spec={spec} selected={spec.id === selected} onSelect={onSelect} live={live} />
        ))}
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {[
          { donor: dock, post: "Dock", next: rot.next.dock },
          { donor: nav, post: "Nav", next: rot.next.nav },
        ].map((row) => (
          <li key={row.donor.id + row.post} className="border border-bezel bg-panel px-4 py-3">
            <p className="font-micro text-xs tracking-widest text-mute">{row.donor.glyph}</p>
            <p className="mt-1 font-display text-2xl font-semibold uppercase leading-none tracking-tight">{row.donor.given}</p>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              {row.post} this watch. Next: {row.next.given}.
            </p>
          </li>
        ))}
      </ul>
    </BoardChrome>
  );
}

export function RailBoard({
  items,
  live,
  selected,
  onSelect,
}: {
  items: DoodadSpec[];
  live: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const rot = useWatchRotation(live);
  const rails = rot.current.rails;
  const life = rot.current.life;
  const rows = [
    { rail: "Main +12", donor: rails },
    { rail: "Life loop", donor: life },
    { rail: "Next rails", donor: rot.next.rails },
    { rail: "Next life", donor: rot.next.life },
  ];

  return (
    <BoardChrome
      kicker={`Watch ${String(rot.watch % 1000).padStart(3, "0")} · ${rot.remainingLabel}`}
      title="Named rails"
      aside={`Live: ${rails.given}`}
    >
      <div className="grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div className="grid gap-3">
          {items.slice(0, 2).map((spec) => (
            <Doodad key={spec.id} spec={spec} selected={spec.id === selected} onSelect={onSelect} live={live} />
          ))}
        </div>
        <ul>
          {rows.map((row) => (
            <li
              key={row.rail}
              className={cn(
                "flex flex-wrap items-center justify-between gap-3 border border-bezel border-b-0 px-4 py-3 last:border-b",
                row.donor.id === rails.id ? "bg-rail" : "bg-panel",
              )}
            >
              <div>
                <p className="font-mono text-xs tracking-widest text-faint">{row.rail}</p>
                <p className="font-display text-xl font-semibold uppercase tracking-tight">{row.donor.given}</p>
              </div>
              <p className="font-mono text-xs tracking-wider text-mute">
                {row.donor.call} · {row.donor.berth}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </BoardChrome>
  );
}

export function BoardView({
  layout,
  items,
  live,
  selected,
  onSelect,
}: {
  layout: string;
  items: DoodadSpec[];
  live: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const props = { items, live, selected, onSelect };
  switch (layout) {
    case "watch":
      return <WatchBoard {...props} />;
    case "helm":
      return <HelmBoard {...props} />;
    case "cryo":
      return <CryoBoard {...props} />;
    case "library":
      return <LibraryBoard {...props} />;
    case "dock":
      return <DockBoard {...props} />;
    case "rails":
      return <RailBoard {...props} />;
    default:
      return null;
  }
}
