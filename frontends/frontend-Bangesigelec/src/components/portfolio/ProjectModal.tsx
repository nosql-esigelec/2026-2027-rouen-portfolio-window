import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Share2 } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { projetQuery } from "@/services/api";
import type { ProjetDetail } from "@/services/types";

import { ModeChip } from "./ModeChip";

function SimilarGraph({ projet }: { projet: ProjetDetail }) {
  const sims = projet.projets_similaires;
  const W = 460;
  const H = 200;
  const cx = W / 2;
  const cy = H - 48;
  const nodes = sims.map((s, i) => {
    const angle = Math.PI + (Math.PI * (i + 1)) / (sims.length + 1);
    return { ...s, x: cx + Math.cos(angle) * 170, y: cy + Math.sin(angle) * 110, label: s.titre.split(" ").slice(0, 2).join(" ") };
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden>
      {nodes.map((n) => (
        <line key={n.slug} x1={cx} y1={cy} x2={n.x} y2={n.y} stroke="var(--cold-1)" strokeOpacity={0.3 + n.score} strokeWidth={1 + n.score * 5} />
      ))}
      <circle cx={cx} cy={cy} r="28" fill="none" stroke="var(--live)" strokeOpacity="0.35" />
      <circle cx={cx} cy={cy} r="18" fill="var(--live)" />
      <text x={cx} y={cy + 44} textAnchor="middle" fontSize="10" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">ce projet</text>
      {nodes.map((n) => (
        <g key={n.slug}>
          <circle cx={n.x} cy={n.y} r={17 + n.score * 10} fill="var(--card)" stroke="var(--cold-2)" strokeWidth="1.5" />
          <text x={n.x} y={n.y + 3.5} textAnchor="middle" fontSize="10" fill="var(--foreground)" fontFamily="var(--font-mono)">
            {Math.round(n.score * 100)}%
          </text>
          <text x={n.x} y={n.y - 26 - n.score * 10} textAnchor="middle" fontSize="10" fill="var(--muted-foreground)" fontFamily="var(--font-sans)">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function ProjectModal({ slug, onOpenChange, onSelect }: { slug: string | null; onOpenChange: (open: boolean) => void; onSelect: (slug: string) => void }) {
  const { data } = useQuery({ ...projetQuery(slug ?? ""), enabled: !!slug });
  const projet = data?.data ?? null;

  return (
    <Dialog open={!!slug} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border bg-popover p-0 sm:rounded-2xl">
        {projet ? (
          <div>
            <div className="relative border-b border-border p-7 pb-6">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-mobius" />
              <div className="flex items-center gap-3">
                <ModeChip mode={projet.mode} />
                <span className="font-mono text-xs text-muted-foreground">{projet.annee}</span>
              </div>
              <DialogTitle className="mt-4 font-display text-3xl font-bold leading-tight">{projet.titre}</DialogTitle>
              <DialogDescription className="mt-2 text-base text-muted-foreground">{projet.resume}</DialogDescription>
            </div>

            <div className="space-y-8 p-7">
              <p className="leading-relaxed text-foreground/90">{projet.description}</p>

              <div>
                <h4 className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-live">Compétences associées</h4>
                <div className="flex flex-wrap gap-1.5">
                  {projet.competences.map((c) => (
                    <span key={c} className="rounded-full bg-accent px-3 py-1 text-xs">{c}</span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {projet.stack.map((s) => (
                    <span key={s} className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-1 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-cold">
                  <Share2 className="size-3.5" /> Projets similaires
                </h4>
                <p className="mb-4 text-xs text-muted-foreground">Relations du graphe Neo4j : compétences partagées entre projets.</p>
                {projet.projets_similaires.length ? (
                  <>
                    <div className="panel mb-4 px-4 py-2">
                      <SimilarGraph projet={projet} />
                    </div>
                    <ul className="space-y-2">
                      {projet.projets_similaires.map((s) => (
                        <li key={s.slug}>
                          <button
                            type="button"
                            onClick={() => onSelect(s.slug)}
                            className="group flex w-full items-center justify-between gap-4 rounded-xl border border-border p-4 text-left transition-colors hover:border-live/60 hover:bg-accent"
                          >
                            <div>
                              <p className="font-medium">{s.titre}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {s.competences_communes.length ? `En commun : ${s.competences_communes.join(", ")}` : "Relation dans le graphe"}
                              </p>
                            </div>
                            <span className="flex shrink-0 items-center gap-2 font-mono text-xs text-live">
                              {Math.round(s.score * 100)}% <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun projet relié pour l'instant.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <DialogTitle>Projet introuvable</DialogTitle>
            <DialogDescription className="mt-2">Ce projet n'existe pas ou n'est plus disponible.</DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
