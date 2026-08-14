import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-chassis px-6 text-center text-ink">
      <span className="text-alert" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-xl font-semibold uppercase tracking-tight">Fault</h1>
      <p className="max-w-md text-pretty text-sm leading-relaxed break-words text-mute">
        {error.message || "An unexpected error occurred. Try reloading the page."}
      </p>
    </main>
  );
}
