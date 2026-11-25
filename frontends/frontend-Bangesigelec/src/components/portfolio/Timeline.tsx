import { AnimatePresence, motion } from "framer-motion";

import { experiencesForMode } from "@/data/demo";
import { MODE_COPY, type Mode } from "@/lib/mode";
import type { Experience } from "@/services/types";
import { cn } from "@/lib/utils";

import { ModeChip } from "./ModeChip";
import { SectionHeading } from "./SectionHeading";

const INTRO: Record<Mode, string> = {
  chaud: "Carrière sportive : là où le mental s'est forgé.",
  hybride: "Vue complète : le parcours entier, sans rupture, du parquet à la data.",
  froid: "Cursus ingénieur ESIGELEC et stage Data / ML chez Omen Performance.",
};

export function Timeline({ experiences, mode }: { experiences: Experience[]; mode: Mode }) {
  const items = experiencesForMode(experiences, mode);
  return (
    <section id="parcours" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:py-32">
      <SectionHeading index="01" kicker={MODE_COPY[mode].zone} title="Parcours & Expériences">
        {INTRO[mode]}
      </SectionHeading>

      <ol className="relative">
        <div aria-hidden className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-hot via-live to-cold md:left-1/2" />
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((e, i) => (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className={cn(
                "relative mb-8 pl-10 md:w-1/2 md:pl-0",
                i % 2 === 0 ? "md:pr-12" : "md:ml-auto md:pl-12",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute left-3 top-6 size-3 -translate-x-1/2 rounded-full ring-4 ring-background",
                  i % 2 === 0 ? "md:left-auto md:-right-1.5 md:translate-x-0" : "md:-left-1.5 md:translate-x-0",
                  e.mode === "chaud" && "bg-hot",
                  e.mode === "froid" && "bg-cold",
                  e.mode === "hybride" && "bg-gradient-mobius",
                )}
              />
              <article className="panel group p-6 transition-colors hover:border-live/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">{e.periode}</span>
                  <ModeChip mode={e.mode} />
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold">{e.titre}</h3>
                <p className="text-sm text-live">{e.organisation}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {e.tags.map((t) => (
                    <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground/80">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </section>
  );
}
