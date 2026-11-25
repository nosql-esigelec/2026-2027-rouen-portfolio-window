import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MODE_COPY, modeFromT } from "@/lib/mode";
import type { DataSource, Profil } from "@/services/types";
import { cn } from "@/lib/utils";

import { MobiusSelector } from "./MobiusSelector";

const NAV = [
  { href: "#parcours", label: "Parcours" },
  { href: "#competences", label: "Compétences" },
  { href: "#projets", label: "Projets" },
  { href: "#contact", label: "Contact" },
];

export function Hero({ profil, t, onChange, source, connecting }: { profil: Profil; t: number; onChange: (t: number) => void; source: DataSource; connecting: boolean }) {
  const mode = modeFromT(t);
  const copy = MODE_COPY[mode];

  return (
    <header className="relative">
      <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="font-display text-lg font-bold tracking-tight">
            B<span className="text-gradient-live">F</span>
          </a>
          <ul className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors hover:text-foreground">{n.label}</a>
              </li>
            ))}
          </ul>
          <span
            title={source === "api" ? "Données servies par l'API FastAPI" : "API locale non joignable : données de démonstration"}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
          >
            <span className={cn("size-1.5 rounded-full", source === "api" ? "bg-cold" : "bg-hot", connecting && "animate-pulse")} />
            {connecting ? "Connexion API…" : source === "api" ? "API connectée" : "Mode démo"}
          </span>
        </div>
      </nav>

      <div id="top" className="mx-auto max-w-6xl px-5 pb-16 pt-14 text-center md:pt-20">
        <AnimatePresence mode="wait">
          <motion.p
            key={`eyebrow-${mode}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="font-mono text-xs uppercase tracking-[0.24em] text-live"
          >
            {copy.eyebrow}
          </motion.p>
        </AnimatePresence>

        <h1 className="mt-5 font-display text-6xl font-extrabold leading-[0.9] tracking-tight sm:text-7xl md:text-8xl">
          Bangaly <span className="text-gradient-mobius">Fofana</span>
        </h1>

        <div className="mx-auto mt-6 min-h-28 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
              transition={{ duration: 0.35 }}
            >
              <p className="font-display text-xl font-semibold md:text-2xl">{copy.title}</p>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">{copy.pitch}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6">
          <MobiusSelector t={t} onChange={onChange} />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="live" size="lg">
            <a href={`mailto:${profil.email}`}>
              <Mail /> Me contacter
            </a>
          </Button>
          <Button asChild variant="line" size="lg">
            <a href={profil.github} target="_blank" rel="noreferrer">
              <Github /> GitHub
            </a>
          </Button>
          <Button asChild variant="line" size="lg">
            <a href={profil.linkedin} target="_blank" rel="noreferrer">
              <Linkedin /> LinkedIn
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
