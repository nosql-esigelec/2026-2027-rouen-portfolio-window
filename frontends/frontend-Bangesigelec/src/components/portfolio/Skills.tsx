import { motion } from "framer-motion";
import { Brain, Code2, Database, Flame, Network, Server, type LucideIcon } from "lucide-react";

import { MODE_COPY, type Mode } from "@/lib/mode";
import type { CategorieCompetence, CategorieStats, Competence, CompetenceGraphe } from "@/services/types";
import { cn } from "@/lib/utils";

import { SectionHeading } from "./SectionHeading";

const TECH: { cat: CategorieCompetence; icon: LucideIcon }[] = [
  { cat: "Langages", icon: Code2 },
  { cat: "Big Data", icon: Server },
  { cat: "Bases NoSQL & Graphe", icon: Network },
  { cat: "DevOps", icon: Database },
  { cat: "IA / ML", icon: Brain },
];
const SOFT: CategorieCompetence = "Soft Skills & Leadership";

interface Props {
  mode: Mode;
  competences: Competence[];
  stats: CategorieStats[];
  graphe: CompetenceGraphe[];
}

function Bar({ value, tone }: { value: number; tone: "hot" | "cold" }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        className={cn("h-full rounded-full", tone === "hot" ? "bg-gradient-to-r from-hot-2 to-hot" : "bg-gradient-to-r from-cold to-cold-2")}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function Skills({ mode, competences, stats, graphe }: Props) {
  const showSoft = mode !== "froid";
  const showTech = mode !== "chaud";
  const projetsCount = (nom: string) => graphe.find((g) => g.competence === nom)?.projets.length ?? 0;
  const statOf = (cat: CategorieCompetence) => stats.find((s) => s.categorie === cat);
  const soft = competences.filter((c) => c.categorie === SOFT);

  return (
    <section id="competences" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:py-32">
      <SectionHeading index="02" kicker={MODE_COPY[mode].zone} title="Compétences">
        {mode === "chaud" && "Le mental du terrain : ce qui ne s'apprend dans aucun manuel."}
        {mode === "hybride" && "Le terrain et le système réunis : le mental qui porte la technique."}
        {mode === "froid" && "La matrice technique, avec le nombre de projets reliés dans le graphe."}
      </SectionHeading>

      <div className="grid gap-5">
        {showSoft && (
          <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="panel p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Flame className="size-5 text-hot" /> Soft Skills & Leadership
              </h3>
              {statOf(SOFT) && (
                <span className="font-mono text-xs text-muted-foreground">
                  {statOf(SOFT)!.total} qualités · moy. {statOf(SOFT)!.niveau_moyen}%
                </span>
              )}
            </div>
            <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {soft.map((c) => (
                <div key={c.nom}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{c.nom}</span>
                    <span className="font-mono text-xs text-muted-foreground">{c.niveau}</span>
                  </div>
                  <Bar value={c.niveau} tone="hot" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {showTech && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TECH.map(({ cat, icon: Icon }, i) => {
              const list = competences.filter((c) => c.categorie === cat);
              const st = statOf(cat);
              if (!list.length) return null;
              return (
                <motion.div
                  key={cat}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="panel p-6"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                      <Icon className="size-5 text-cold" /> {cat}
                    </h3>
                    {st && (
                      <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {st.total} · {st.niveau_moyen}%
                      </span>
                    )}
                  </div>
                  <ul className="space-y-4">
                    {list.map((c) => {
                      const n = projetsCount(c.nom);
                      return (
                        <li key={c.nom}>
                          <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                            <span>{c.nom}</span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {n > 0 ? `${n} projet${n > 1 ? "s" : ""} · ` : ""}
                              {c.niveau}
                            </span>
                          </div>
                          <Bar value={c.niveau} tone="cold" />
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
