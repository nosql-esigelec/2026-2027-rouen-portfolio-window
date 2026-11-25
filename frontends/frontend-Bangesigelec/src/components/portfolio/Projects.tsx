import { motion } from "framer-motion";
import { ArrowUpRight, GitFork } from "lucide-react";

import { MODE_COPY, type Mode } from "@/lib/mode";
import type { Projet } from "@/services/types";
import { cn } from "@/lib/utils";

import { ModeChip } from "./ModeChip";
import { SectionHeading } from "./SectionHeading";

const RANK: Record<Mode, Record<Mode, number>> = {
  chaud: { hybride: 0, chaud: 0, froid: 1 },
  hybride: { hybride: 0, chaud: 1, froid: 1 },
  froid: { froid: 0, hybride: 1, chaud: 2 },
};

export function Projects({ projets, mode, onOpen }: { projets: Projet[]; mode: Mode; onOpen: (slug: string) => void }) {
  const sorted = [...projets].sort((a, b) => RANK[mode][a.mode] - RANK[mode][b.mode] || b.annee - a.annee);
  return (
    <section id="projets" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:py-32">
      <SectionHeading index="03" kicker={MODE_COPY[mode].zone} title="Projets & Recommandations">
        Propulsé par MongoDB & Neo4j : ouvrez un projet pour voir les projets similaires issus du graphe.
      </SectionHeading>

      <div className="grid gap-5 md:grid-cols-2">
        {sorted.map((p, i) => {
          const highlighted = RANK[mode][p.mode] === 0;
          return (
            <motion.button
              key={p.slug}
              layout
              type="button"
              onClick={() => onOpen(p.slug)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={cn(
                "panel group relative flex flex-col overflow-hidden p-7 text-left transition-all hover:-translate-y-1 hover:border-live/60",
                highlighted && "border-live/40",
              )}
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-mobius opacity-60" />
              <div className="flex items-center justify-between gap-2">
                <ModeChip mode={p.mode} />
                <span className="font-mono text-xs text-muted-foreground">{p.annee}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold leading-tight">{p.titre}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.resume}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.stack.slice(0, 5).map((s) => (
                  <span key={s} className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-foreground/80">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <GitFork className="size-4" /> {p.competences.length} compétences reliées
                </span>
                <span className="flex items-center gap-1 font-medium text-live">
                  Détails <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
