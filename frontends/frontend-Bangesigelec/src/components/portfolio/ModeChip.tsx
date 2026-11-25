import type { Mode } from "@/lib/mode";
import { cn } from "@/lib/utils";

const LABEL: Record<Mode, string> = { chaud: "Chaud", hybride: "Hybride", froid: "Froid" };

export function ModeChip({ mode, className }: { mode: Mode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em]",
        mode === "chaud" && "border-hot/40 text-hot",
        mode === "froid" && "border-cold/40 text-cold",
        mode === "hybride" && "border-border text-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          mode === "chaud" && "bg-hot",
          mode === "froid" && "bg-cold",
          mode === "hybride" && "bg-gradient-mobius",
        )}
      />
      {LABEL[mode]}
    </span>
  );
}
