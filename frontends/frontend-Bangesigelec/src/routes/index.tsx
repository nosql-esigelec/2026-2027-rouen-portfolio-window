import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Ambience } from "@/components/portfolio/Ambience";
import { Footer } from "@/components/portfolio/Footer";
import { Hero } from "@/components/portfolio/Hero";
import { ProjectModal } from "@/components/portfolio/ProjectModal";
import { Projects } from "@/components/portfolio/Projects";
import { Skills } from "@/components/portfolio/Skills";
import { Timeline } from "@/components/portfolio/Timeline";
import { ZONES, modeFromT } from "@/lib/mode";
import {
  competencesQuery,
  competencesStatsQuery,
  personneQuery,
  projetsQuery,
} from "@/services/api";

const TITLE = "Bangaly Fofana — Ingénieur Big Data & IA, ancien basketteur de haut niveau";
const DESCRIPTION =
  "Portfolio de Bangaly Fofana : du parquet à la data. Ingénieur Big Data & IA (ESIGELEC), FastAPI, MongoDB, Neo4j, PySpark. Stage mars 2027, poste avril 2027.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  const [t, setT] = useState(ZONES.hybride);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const mode = modeFromT(t);

  const personne = useQuery(personneQuery());
  const projets = useQuery(projetsQuery());
  const competences = useQuery(competencesQuery());
  const stats = useQuery(competencesStatsQuery());

  // La couleur de toute la page suit la position de l'orbe.
  useEffect(() => {
    document.documentElement.style.setProperty("--t", t.toFixed(3));
  }, [t]);

  const profil = personne.data!.data.profil;
  const connecting = personne.isPlaceholderData && personne.fetchStatus === "fetching";
  const source = personne.isPlaceholderData ? "demo" : personne.data!.source;

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Ambience />
      <Hero profil={profil} t={t} onChange={setT} source={source} connecting={connecting} />
      <main>
        <Timeline experiences={profil.experiences} mode={mode} />
        <Skills
          mode={mode}
          competences={competences.data!.data}
          stats={stats.data!.data}
          graphe={personne.data!.data.competences_graphe}
        />
        <Projects projets={projets.data!.data} mode={mode} onOpen={setOpenSlug} />
      </main>
      <Footer profil={profil} />
      <ProjectModal slug={openSlug} onOpenChange={(o) => !o && setOpenSlug(null)} onSelect={setOpenSlug} />
    </div>
  );
}
