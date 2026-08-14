import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";
import {
  CATALOG,
  ERA_LABELS,
  PHOSPHOR_LABELS,
  type Era,
  type Phosphor,
} from "./catalog";
import { Doodad } from "./Doodad";
import { GRID_CLASS, GRID_PRESETS, type GridId } from "./grids";
import { pagesFor, type LivePage } from "./sets";

const PHOSPHORS = Object.keys(PHOSPHOR_LABELS) as Phosphor[];
const ERAS = Object.keys(ERA_LABELS) as Era[];

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-8 w-24 animate-pulse rounded-sm bg-bezel" />;
  }
  return user ? (
    <SignedIn>
      <UserButton />
    </SignedIn>
  ) : (
    <SignedOut>
      <Link
        to="/login"
        className="inline-flex h-10 items-center border border-bezel bg-panel px-3 font-mono text-xs tracking-widest text-ink transition-colors duration-150 hover:border-mute"
      >
        SIGN IN
      </Link>
    </SignedOut>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 border px-3 font-mono text-[0.65rem] tracking-widest uppercase transition-colors duration-150",
        active
          ? "border-cyan bg-rail text-cyan"
          : "border-bezel bg-panel text-mute hover:border-mute hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function SetPage({
  page,
  index,
  total,
  selected,
  onSelect,
  grid,
  eager,
  onActive,
}: {
  page: LivePage;
  index: number;
  total: number;
  selected: string | null;
  onSelect: (id: string) => void;
  grid: GridId;
  eager: boolean;
  onActive: (id: string) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const live = useInView(ref, "8% 0px", eager);

  useEffect(() => {
    if (live) onActive(page.set.id);
  }, [live, onActive, page.set.id]);

  return (
    <section
      ref={ref}
      id={`set-${page.set.id}`}
      data-era={page.set.era}
      className="bay-set flex flex-col px-4 py-4 sm:px-6"
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-mono text-[0.58rem] tracking-[0.22em] text-faint">
            SET {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {page.set.era === "slab" ? "1968 SLAB" : "BRIDGE CRT"}
          </p>
          <h2 className="font-display text-2xl font-semibold uppercase tracking-tight">{page.set.title}</h2>
        </div>
        <p className="font-mono text-[0.62rem] tracking-widest text-faint">
          {page.set.hint} · {page.items.length} LIVE MAX
        </p>
      </div>

      <div className={cn("mx-auto w-full max-w-[640px] flex-1", GRID_CLASS[grid])}>
        {page.items.map((spec) => (
          <Doodad
            key={spec.id}
            spec={spec}
            selected={spec.id === selected}
            onSelect={onSelect}
            live={live}
          />
        ))}
      </div>
    </section>
  );
}

export function ConsoleApp() {
  const [phosphor, setPhosphor] = useState<Phosphor | "all">("all");
  const [era, setEra] = useState<Era | "all">("all");
  const [grid, setGrid] = useState<GridId>("4");
  const [selected, setSelected] = useState<string | null>(null);
  const [activeSet, setActiveSet] = useState<string>(SETS_HEAD);
  const scroller = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const apply = () => {
      document.documentElement.style.setProperty("--bay-chrome", `${Math.ceil(el.getBoundingClientRect().height)}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const items = useMemo(() => {
    return CATALOG.filter((d) => {
      if (phosphor !== "all" && d.phosphor !== phosphor) return false;
      if (era !== "all" && d.era !== era) return false;
      return true;
    });
  }, [phosphor, era]);

  const pages = useMemo(() => pagesFor(items, era), [items, era]);

  useEffect(() => {
    if (pages[0]) setActiveSet(pages[0].set.id);
    scroller.current?.scrollTo({ top: 0 });
  }, [era, phosphor, pages]);

  const active = (selected && CATALOG.find((d) => d.id === selected)) || pages[0]?.items[0] || null;
  const currentPage = pages.find((p) => p.set.id === activeSet) ?? pages[0];

  const stardate = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const start = new Date(y, 0, 0);
    const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return `${y}.${String(day).padStart(3, "0")}`;
  }, []);

  const jump = (id: string) => {
    document.getElementById(`set-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-chassis text-ink">
      <header ref={headerRef} className="shrink-0 border-b border-bezel bg-rail">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.28em] text-cyan">DECK 1 · INSTRUMENT BAY</p>
              <h1 className="mt-1 font-display text-3xl font-semibold uppercase leading-none tracking-tight sm:text-4xl">
                Scope Bay
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="stardate border border-bezel bg-panel px-3 py-2 font-mono text-xs tracking-widest text-mute">
                DATE {stardate}
              </div>
              <AuthSlot />
            </div>
          </div>

          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-mute">
            Four instruments per deck. Scroll to wake the next set — off-screen
            boards sleep so the bay stays light.
          </p>

          <div className="flex min-w-0 flex-nowrap gap-2 overflow-x-auto pb-1">
            <Chip active={era === "all"} onClick={() => setEra("all")}>
              All eras
            </Chip>
            {ERAS.map((id) => (
              <Chip key={id} active={era === id} onClick={() => setEra(id)}>
                {ERA_LABELS[id]}
              </Chip>
            ))}
            <span className="mx-1 w-px shrink-0 bg-bezel" />
            {GRID_PRESETS.map((p) => (
              <Chip key={p.id} active={grid === p.id} onClick={() => setGrid(p.id)}>
                {p.label}
              </Chip>
            ))}
            <span className="mx-1 w-px shrink-0 bg-bezel" />
            <Chip active={phosphor === "all"} onClick={() => setPhosphor("all")}>
              All phosphors
            </Chip>
            {PHOSPHORS.map((id) => (
              <Chip key={id} active={phosphor === id} onClick={() => setPhosphor(id)}>
                {PHOSPHOR_LABELS[id]}
              </Chip>
            ))}
          </div>

          <div className="flex min-w-0 flex-nowrap gap-2 overflow-x-auto pb-1">
            {pages.map((page, i) => (
              <Chip
                key={page.set.id}
                active={activeSet === page.set.id}
                onClick={() => jump(page.set.id)}
              >
                {`${String(i + 1).padStart(2, "0")} ${page.set.title}`}
              </Chip>
            ))}
          </div>

          {active && currentPage ? (
            <p className="truncate font-mono text-[0.62rem] tracking-wider text-faint">
              INSPECT {active.code} · {active.label} · {active.glyph} · {active.speed}
            </p>
          ) : null}
        </div>
      </header>

      <div ref={scroller} className="bay-scroll min-w-0">
        {pages.length === 0 ? (
          <p className="px-4 py-16 text-center font-mono text-sm text-mute">
            No instruments match those modifiers.
          </p>
        ) : (
          pages.map((page, i) => (
            <SetPage
              key={page.set.id}
              page={page}
              index={i}
              total={pages.length}
              selected={selected}
              onSelect={setSelected}
              grid={grid}
              eager={i === 0}
              onActive={setActiveSet}
            />
          ))
        )}
      </div>
    </div>
  );
}

const SETS_HEAD = "crt-sensor";
