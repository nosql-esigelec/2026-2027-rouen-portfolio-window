import { queryOptions } from "@tanstack/react-query";

import {
  DEMO_COMPETENCES,
  DEMO_PROJETS,
  demoCompetencesStats,
  demoPersonne,
  demoProjetDetail,
} from "@/data/demo";
import type { Mode } from "@/lib/mode";
import type {
  CategorieCompetence,
  CategorieStats,
  Competence,
  CompetenceGraphe,
  Experience,
  Personne,
  Projet,
  ProjetDetail,
  ProjetSimilaire,
  Sourced,
} from "./types";

/** URL de l'API FastAPI (MongoDB + Neo4j). */
export const API_URL: string = (
  (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:8000/api"
).replace(/\/+$/, "");

const TIMEOUT_MS = 2500;

async function getJson<T>(path: string, isValid: (v: unknown) => boolean): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} sur ${path}`);
    const json: unknown = await res.json();
    if (!isValid(json)) throw new Error(`Réponse inattendue sur ${path}`);
    return json as T;
  } finally {
    clearTimeout(timer);
  }
}

/** Appelle l'API ; si elle est absente ou invalide, renvoie le jeu de démonstration. */
export async function withFallback<T>(
  path: string,
  isValid: (v: unknown) => boolean,
  fallback: () => T,
  transform?: (raw: unknown) => T,
): Promise<Sourced<T>> {
  try {
    const raw = await getJson<unknown>(path, isValid);
    const data = transform ? transform(raw) : (raw as T);
    return { data, source: "api" };
  } catch {
    return { data: fallback(), source: "demo" };
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

/** Traduit les catégories du backend vers les catégories exactes de types.ts */
function mapCategorie(cat?: string): CategorieCompetence {
  const c = (cat ?? "").toLowerCase();
  if (c.includes("langage")) return "Langages";
  if (c.includes("data engineering") || c.includes("big data")) return "Big Data";
  if (c.includes("base") || c.includes("nosql") || c.includes("graphe")) return "Bases NoSQL & Graphe";
  if (c.includes("devops")) return "DevOps";
  if (c.includes("ia") || c.includes("ml") || c.includes("analyse")) return "IA / ML";
  return "Soft Skills & Leadership";
}

/** Déduit le mode (chaud/froid) pour une expérience */
function inferExpMode(exp: Record<string, unknown>): Mode {
  const tags = Array.isArray(exp["competences"]) ? (exp["competences"] as string[]) : [];
  const isSport = tags.some((t) =>
    ["leadership", "gestion-pression", "basketball", "sport"].includes(t.toLowerCase()),
  );
  return isSport ? "chaud" : "froid";
}

/** Déduit le mode (hybride/froid) pour un projet */
function inferProjetMode(p: Record<string, unknown>): Mode {
  const titre = String(p["titre"] ?? "").toLowerCase();
  const skills = Array.isArray(p["skills_slugs"]) ? (p["skills_slugs"] as string[]) : [];
  const isHybride =
    titre.includes("basket") ||
    titre.includes("olympique") ||
    titre.includes("sport") ||
    skills.some((s) => ["leadership", "gestion-pression"].includes(s.toLowerCase()));
  return isHybride ? "hybride" : "froid";
}

/** Adaptateur : JSON FastAPI -> Interface Personne */
function adaptPersonne(raw: unknown): Personne {
  const demo = demoPersonne();
  const root = raw as Record<string, unknown>;
  const p = (root["profil"] ?? {}) as Record<string, unknown>;
  const contacts = (p["contacts"] ?? {}) as Record<string, unknown>;
  const formations = Array.isArray(p["formations"]) ? (p["formations"] as Record<string, unknown>[]) : [];
  const rawExps = Array.isArray(p["experiences"]) ? (p["experiences"] as Record<string, unknown>[]) : [];
  const rawGraphe = Array.isArray(root["competences_graphe"])
    ? (root["competences_graphe"] as Record<string, unknown>[])
    : [];

  const experiences: Experience[] = rawExps.map((e, index) => {
    const debut = String(e["debut"] ?? "");
    const fin = String(e["fin"] ?? "");
    const periode = debut && fin && debut !== fin ? `${debut} – ${fin}` : debut || fin || "";
    const missions = Array.isArray(e["missions"]) ? (e["missions"] as string[]) : [];

    return {
      id: String(e["id"] ?? `exp-${index}`),
      periode,
      ordre: index + 1,
      titre: String(e["poste"] ?? ""),
      organisation: String(e["structure"] ?? ""),
      description: missions.join(" "),
      mode: inferExpMode(e),
      tags: Array.isArray(e["competences"]) ? (e["competences"] as string[]) : [],
    };
  });

  const competences_graphe: CompetenceGraphe[] = rawGraphe.map((g) => ({
    competence: String(g["nom"] ?? g["slug"] ?? ""),
    categorie: mapCategorie(String(g["categorie"] ?? "")),
    niveau: typeof g["niveau"] === "number" ? g["niveau"] : 80,
    projets: Array.isArray(g["projets"]) ? (g["projets"] as string[]) : [],
  }));

  const fullName = [p["prenom"], p["nom"]].filter(Boolean).join(" ") || demo.profil.nom;

  return {
    profil: {
      slug: String(p["slug"] ?? demo.profil.slug),
      nom: fullName,
      titre: String(p["titre"] ?? demo.profil.titre),
      formation: String(formations[0]?.["diplome"] ?? demo.profil.formation),
      localisation: String(p["localisation"] ?? demo.profil.localisation),
      email: String(contacts["email"] ?? demo.profil.email),
      github: String(contacts["github"] ?? demo.profil.github),
      linkedin: String(contacts["linkedin"] ?? demo.profil.linkedin),
      disponibilite: demo.profil.disponibilite,
      experiences,
    },
    competences_graphe,
  };
}

/** Adaptateur : Un projet brut -> Interface Projet */
function mapOneProjet(raw: Record<string, unknown>): Projet {
  const skills = Array.isArray(raw["skills_slugs"]) ? (raw["skills_slugs"] as string[]) : [];
  const stack = Array.isArray(raw["stack"]) ? (raw["stack"] as string[]) : skills;
  const competences = Array.isArray(raw["competences"]) ? (raw["competences"] as string[]) : skills;
  const desc = raw["description"] ? String(raw["description"]) : String(raw["titre"] ?? "");

  return {
    slug: String(raw["slug"] ?? ""),
    titre: String(raw["titre"] ?? ""),
    annee: Number(raw["annee"] ?? raw["date_realisation"]) || 2026,
    mode: (raw["mode"] as Mode) ?? inferProjetMode(raw),
    resume: raw["resume"] ? String(raw["resume"]) : desc,
    description: desc,
    stack,
    competences,
    lien: raw["lien"] ? String(raw["lien"]) : undefined,
  };
}

function adaptProjets(raw: unknown): Projet[] {
  if (!Array.isArray(raw)) return DEMO_PROJETS;
  return raw.filter(isObj).map(mapOneProjet);
}

function adaptProjetDetail(raw: unknown): ProjetDetail | null {
  if (!isObj(raw)) return null;
  const base = mapOneProjet(raw);
  const rawSimilaires = Array.isArray(raw["projets_similaires"])
    ? (raw["projets_similaires"] as Record<string, unknown>[])
    : [];

  const projets_similaires: ProjetSimilaire[] = rawSimilaires.map((s) => ({
    slug: String(s["slug"] ?? ""),
    titre: String(s["titre"] ?? ""),
    score: typeof s["score"] === "number" ? s["score"] : 0.75,
    competences_communes: Array.isArray(s["competences_communes"])
      ? (s["competences_communes"] as string[])
      : [],
  }));

  return { ...base, projets_similaires };
}

/** Adaptateur : Compétences & Stats */
function adaptCompetences(raw: unknown): Competence[] {
  if (!Array.isArray(raw)) return DEMO_COMPETENCES;
  return raw.filter(isObj).map((c) => ({
    nom: String(c["nom"] ?? c["slug"] ?? ""),
    categorie: mapCategorie(String(c["categorie"] ?? "")),
    niveau: typeof c["niveau"] === "number" ? c["niveau"] : 80,
  }));
}

function adaptCompetencesStats(raw: unknown): CategorieStats[] {
  if (!Array.isArray(raw)) return demoCompetencesStats();
  return raw.filter(isObj).map((s) => ({
    categorie: mapCategorie(String(s["categorie"] ?? "")),
    total: Number(s["total"] ?? s["count"] ?? 1),
    niveau_moyen: Number(s["niveau_moyen"] ?? 80),
  }));
}

export const api = {
  getPersonne: () =>
    withFallback<Personne>(
      "/personnes/bangaly-fofana",
      (v) => isObj(v) && isObj(v["profil"]) && Array.isArray(v["competences_graphe"]),
      demoPersonne,
      adaptPersonne,
    ),
  getProjets: () => withFallback<Projet[]>("/projets", Array.isArray, () => DEMO_PROJETS, adaptProjets),
  getProjet: (slug: string) =>
    withFallback<ProjetDetail | null>(
      `/projets/${encodeURIComponent(slug)}`,
      (v) => isObj(v) && typeof v["slug"] === "string",
      () => demoProjetDetail(slug),
      adaptProjetDetail,
    ),
  getCompetences: () =>
    withFallback<Competence[]>("/competences", Array.isArray, () => DEMO_COMPETENCES, adaptCompetences),
  getCompetencesStats: () =>
    withFallback<CategorieStats[]>(
      "/competences/stats/categories",
      Array.isArray,
      demoCompetencesStats,
      adaptCompetencesStats,
    ),
};

const common = { staleTime: 5 * 60_000, retry: false } as const;

export const personneQuery = () =>
  queryOptions({
    queryKey: ["personne", "bangaly-fofana"],
    queryFn: api.getPersonne,
    placeholderData: { data: demoPersonne(), source: "demo" as const },
    ...common,
  });

export const projetsQuery = () =>
  queryOptions({
    queryKey: ["projets"],
    queryFn: api.getProjets,
    placeholderData: { data: DEMO_PROJETS, source: "demo" as const },
    ...common,
  });

export const projetQuery = (slug: string) =>
  queryOptions({
    queryKey: ["projets", slug],
    queryFn: () => api.getProjet(slug),
    placeholderData: { data: demoProjetDetail(slug), source: "demo" as const },
    ...common,
  });

export const competencesQuery = () =>
  queryOptions({
    queryKey: ["competences"],
    queryFn: api.getCompetences,
    placeholderData: { data: DEMO_COMPETENCES, source: "demo" as const },
    ...common,
  });

export const competencesStatsQuery = () =>
  queryOptions({
    queryKey: ["competences", "stats", "categories"],
    queryFn: api.getCompetencesStats,
    placeholderData: { data: demoCompetencesStats(), source: "demo" as const },
    ...common,
  });