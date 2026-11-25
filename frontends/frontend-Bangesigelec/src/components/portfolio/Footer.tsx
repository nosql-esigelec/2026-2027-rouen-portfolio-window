import { Briefcase, Github, GraduationCap, Linkedin, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Profil } from "@/services/types";

export function Footer({ profil }: { profil: Profil }) {
  return (
    <footer id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-12 pt-24">
      <div className="panel relative overflow-hidden p-8 md:p-14">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-mobius" />
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-live">04 — Disponibilité</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          Prêt à entrer <span className="text-gradient-mobius">sur votre terrain.</span>
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <GraduationCap className="size-6 text-hot" />
            <p className="mt-4 text-sm text-muted-foreground">Stage de fin d'études</p>
            <p className="font-display text-2xl font-semibold">À partir de {profil.disponibilite.stage}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <Briefcase className="size-6 text-cold" />
            <p className="mt-4 text-sm text-muted-foreground">Poste d'Ingénieur Data / IA</p>
            <p className="font-display text-2xl font-semibold">À partir d'{profil.disponibilite.poste}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="live" size="lg">
            <a href={`mailto:${profil.email}`}>
              <Mail /> {profil.email}
            </a>
          </Button>
          <Button asChild variant="line" size="lg">
            <a href={profil.linkedin} target="_blank" rel="noreferrer">
              <Linkedin /> LinkedIn
            </a>
          </Button>
          <Button asChild variant="line" size="lg">
            <a href={profil.github} target="_blank" rel="noreferrer">
              <Github /> GitHub
            </a>
          </Button>
        </div>
      </div>
      <div className="mt-8 flex flex-col justify-between gap-2 font-mono text-xs text-muted-foreground sm:flex-row">
        <span>© {new Date().getFullYear()} {profil.nom} — {profil.formation}</span>
        <span>React · FastAPI · MongoDB · Neo4j</span>
      </div>
    </footer>
  );
}
