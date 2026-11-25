export type Mode = "chaud" | "hybride" | "froid";

/** Position (0 → 1) des trois zones magnétiques du ruban. */
export const ZONES: Record<Mode, number> = { chaud: 0, hybride: 0.5, froid: 1 };
export const MODES: Mode[] = ["chaud", "hybride", "froid"];

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function modeFromT(t: number): Mode {
  if (t < 1 / 3) return "chaud";
  if (t > 2 / 3) return "froid";
  return "hybride";
}

/** Zone magnétique la plus proche. */
export function snapT(t: number): number {
  const v = clamp01(t);
  return MODES.map((m) => ZONES[m]).reduce((best, z) =>
    Math.abs(z - v) < Math.abs(best - v) ? z : best,
  );
}

export const MODE_COPY: Record<
  Mode,
  { label: string; zone: string; eyebrow: string; title: string; pitch: string }
> = {
  chaud: {
    label: "Terrain • Chaud",
    zone: "Le Terrain",
    eyebrow: "Boucle gauche — Volcan",
    title: "Ancien basketteur de haut niveau",
    pitch:
      "Leadership sous pression, résilience, sens du collectif et lecture du jeu : le mental forgé sur le parquet.",
  },
  hybride: {
    label: "Reconversion • Hybride",
    zone: "La Torsion",
    eyebrow: "Croisement central — Obsidienne",
    title: "Une seule énergie, deux terrains de jeu",
    pitch:
      "Du parquet à l'ESIGELEC : je mets le Machine Learning au service du mouvement sportif, sans rupture.",
  },
  froid: {
    label: "Data & IA • Froid",
    zone: "Le Système",
    eyebrow: "Boucle droite — Glace",
    title: "Ingénieur Big Data & Intelligence Artificielle",
    pitch:
      "Architectures polyglottes FastAPI · MongoDB · Neo4j, pipelines PySpark / Hadoop et modèles ML en production.",
  },
};
