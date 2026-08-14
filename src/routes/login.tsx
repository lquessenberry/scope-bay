import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-chassis px-6 text-ink">
      <div className="w-full max-w-sm border border-bezel bg-panel p-6">
        <p className="font-mono text-[0.65rem] tracking-[0.28em] text-cyan">ACCESS</p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-tight">Sign in</h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-mute">
          Authenticate to attach your name to the donor status strips.
        </p>
        <div className="mt-6 space-y-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="flex h-11 w-full items-center justify-center border border-bezel bg-rail font-mono text-xs tracking-widest text-ink transition-colors duration-150 hover:border-cyan hover:text-cyan"
              >
                CONTINUE WITH {p.label.toUpperCase()}
              </button>
            ))
          ) : (
            <p className="text-sm text-mute">Sign-in is disabled.</p>
          )}
        </div>
        <Link
          to="/"
          className="mt-5 inline-flex h-10 items-center font-mono text-xs tracking-widest text-mute hover:text-ink"
        >
          BACK TO BAY
        </Link>
      </div>
    </main>
  );
}
