import type { Projet, ProjetSimilaire } from "@/services/types";

/**
 * Reproduit localement la requête Neo4j « projets similaires » :
 * (p)-[:UTILISE]->(c)<-[:UTILISE]-(autre), score = indice de Jaccard.
 */
export function similarProjects(projets: Projet[], slug: string, limit = 3): ProjetSimilaire[] {
  const source = projets.find((p) => p.slug === slug);
  if (!source) return [];
  const a = new Set(source.competences);
  return projets
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const communes = p.competences.filter((c) => a.has(c));
      const union = new Set([...source.competences, ...p.competences]).size || 1;
      return {
        slug: p.slug,
        titre: p.titre,
        score: communes.length / union,
        competences_communes: communes,
      };
    })
    .filter((p) => p.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit);
}
