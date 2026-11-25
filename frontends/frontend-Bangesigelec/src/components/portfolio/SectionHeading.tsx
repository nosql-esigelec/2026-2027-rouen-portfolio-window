import type { ReactNode } from "react";

export function SectionHeading({ index, kicker, title, children }: { index: string; kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-live">
          {index} — {kicker}
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h2>
      </div>
      {children && <div className="max-w-md text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}
