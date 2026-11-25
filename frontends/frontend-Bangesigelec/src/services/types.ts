import type { Mode } from "@/lib/mode";

export type DataSource = "api" | "demo";

export interface Sourced<T> {
  data: T;
  source: DataSource;
}

export interface Experience {
  id: string;
  periode: string;
  ordre: number;
  titre: string;
  organisation: string;
  description: string;
  mode: Mode;
  tags: string[];
}

export interface Profil {
  slug: string;
  nom: string;
  titre: string;
  formation: string;
  localisation: string;
  email: string;
  github: string;
  linkedin: string;
  disponibilite: { stage: string; poste: string };
  experiences: Experience[];
}

export type CategorieCompetence =
  | "Langages"
  | "Big Data"
  | "Bases NoSQL & Graphe"
  | "DevOps"
  | "IA / ML"
  | "Soft Skills & Leadership";

export interface Competence {
  nom: string;
  categorie: CategorieCompetence;
  niveau: number; // 0 → 100
}

export interface CompetenceGraphe {
  competence: string;
  categorie: CategorieCompetence;
  niveau: number;
  projets: string[]; // slugs reliés dans le graphe (USED_IN)
}

export interface Personne {
  profil: Profil;
  competences_graphe: CompetenceGraphe[];
}

export interface CategorieStats {
  categorie: CategorieCompetence;
  total: number;
  niveau_moyen: number;
}

export interface ProjetSimilaire {
  slug: string;
  titre: string;
  score: number; // 0 → 1
  competences_communes: string[];
}

export interface Projet {
  slug: string;
  titre: string;
  annee: number;
  mode: Mode;
  resume: string;
  description: string;
  stack: string[];
  competences: string[];
  lien?: string;
}

export interface ProjetDetail extends Projet {
  projets_similaires: ProjetSimilaire[];
}
