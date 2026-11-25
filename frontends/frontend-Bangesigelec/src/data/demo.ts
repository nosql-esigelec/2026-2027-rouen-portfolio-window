import { similarProjects } from "@/lib/similarity";
import type { Mode } from "@/lib/mode";
import type {
  CategorieCompetence,
  CategorieStats,
  Competence,
  CompetenceGraphe,
  Experience,
  Personne,
  Profil,
  Projet,
  ProjetDetail,
} from "@/services/types";

/** Jeu de démonstration utilisé quand l'API FastAPI locale ne répond pas. */

export const DEMO_EXPERIENCES: Experience[] = [
  {
    id: "basket-haut-niveau",
    periode: "Carrière sportive",
    ordre: 1,
    titre: "Basketteur de haut niveau",
    organisation: "Compétition nationale",
    description:
      "Des années de compétition au plus haut niveau : décisions en une fraction de seconde, gestion de la pression dans les fins de match serrées et responsabilité envers le collectif.",
    mode: "chaud",
    tags: ["Leadership", "Résilience", "Lecture du jeu"],
  },
  {
    id: "reconversion",
    periode: "Reconversion",
    ordre: 3,
    titre: "Reconversion vers l'ingénierie",
    organisation: "Du sport de haut niveau à la Data",
    description:
      "Choix assumé de transformer l'énergie du terrain en rigueur scientifique : mathématiques, programmation et statistiques pour comprendre la performance autrement.",
    mode: "hybride",
    tags: ["Discipline", "Apprentissage rapide"],
  },
  {
    id: "esigelec",
    periode: "Cycle ingénieur → 2027",
    ordre: 4,
    titre: "Cycle Ingénieur — Big Data & Intelligence Artificielle",
    organisation: "ESIGELEC",
    description:
      "Formation d'ingénieur orientée Big Data et IA : systèmes distribués, bases NoSQL et graphe, Machine Learning, architecture logicielle et DevOps.",
    mode: "froid",
    tags: ["Big Data", "IA / ML", "NoSQL"],
  },
  {
    id: "projet-galaxy-watch",
    periode: "Projet ESIGELEC",
    ordre: 5,
    titre: "Analyse du mouvement de basket par IA",
    organisation: "ESIGELEC — projet sport × IA",
    description:
      "Classification des gestes de basket (tir, dribble, passe) à partir des accéléromètres d'une Samsung Galaxy Watch : le pont exact entre mes deux vies.",
    mode: "hybride",
    tags: ["Machine Learning", "Capteurs", "Sport"],
  },
  {
    id: "stage-omen",
    periode: "Stage",
    ordre: 6,
    titre: "Stage Data / Machine Learning",
    organisation: "Omen Performance",
    description:
      "Construction de pipelines de données et de modèles de Machine Learning appliqués à l'analyse de la performance : collecte, nettoyage, features et évaluation.",
    mode: "froid",
    tags: ["Python", "Pipelines", "ML"],
  },
];

export const DEMO_PROFIL: Profil = {
  slug: "bangaly-fofana",
  nom: "Bangaly Fofana",
  titre: "Ingénieur Big Data & Intelligence Artificielle",
  formation: "ESIGELEC",
  localisation: "France",
  email: "bangaly.fofana@groupe-esigelec.org",
  github: "https://github.com/bangaly-fofana",
  linkedin: "https://www.linkedin.com/in/bangaly-f-702465397",
  disponibilite: { stage: "mars 2027", poste: "avril 2027" },
  experiences: DEMO_EXPERIENCES,
};

export const DEMO_COMPETENCES: Competence[] = [
  { nom: "Python", categorie: "Langages", niveau: 92 },
  { nom: "SQL", categorie: "Langages", niveau: 86 },
  { nom: "TypeScript", categorie: "Langages", niveau: 68 },
  { nom: "Java", categorie: "Langages", niveau: 64 },
  { nom: "Scala", categorie: "Langages", niveau: 58 },
  { nom: "PySpark", categorie: "Big Data", niveau: 85 },
  { nom: "Hadoop / HDFS", categorie: "Big Data", niveau: 76 },
  { nom: "Airflow", categorie: "Big Data", niveau: 64 },
  { nom: "Kafka", categorie: "Big Data", niveau: 58 },
  { nom: "MongoDB", categorie: "Bases NoSQL & Graphe", niveau: 86 },
  { nom: "Neo4j / Cypher", categorie: "Bases NoSQL & Graphe", niveau: 82 },
  { nom: "PostgreSQL", categorie: "Bases NoSQL & Graphe", niveau: 78 },
  { nom: "Redis", categorie: "Bases NoSQL & Graphe", niveau: 60 },
  { nom: "FastAPI", categorie: "DevOps", niveau: 84 },
  { nom: "Docker", categorie: "DevOps", niveau: 80 },
  { nom: "Git & CI/CD", categorie: "DevOps", niveau: 80 },
  { nom: "Linux", categorie: "DevOps", niveau: 74 },
  { nom: "Scikit-learn", categorie: "IA / ML", niveau: 86 },
  { nom: "Pandas / NumPy", categorie: "IA / ML", niveau: 90 },
  { nom: "Random Forest", categorie: "IA / ML", niveau: 84 },
  { nom: "Séries temporelles & capteurs", categorie: "IA / ML", niveau: 78 },
  { nom: "TensorFlow / Keras", categorie: "IA / ML", niveau: 68 },
  { nom: "Leadership sous pression", categorie: "Soft Skills & Leadership", niveau: 95 },
  { nom: "Résilience", categorie: "Soft Skills & Leadership", niveau: 96 },
  { nom: "Esprit collectif", categorie: "Soft Skills & Leadership", niveau: 93 },
  { nom: "Lecture du jeu", categorie: "Soft Skills & Leadership", niveau: 91 },
  { nom: "Discipline", categorie: "Soft Skills & Leadership", niveau: 94 },
];

export const DEMO_PROJETS: Projet[] = [
  {
    slug: "portfolio-hybride-mongodb-neo4j",
    titre: "Portfolio Hybride MongoDB & Neo4j",
    annee: 2026,
    mode: "froid",
    resume:
      "Ce portfolio : une API FastAPI qui croise un stockage documentaire et un graphe de compétences.",
    description:
      "Architecture polyglotte : MongoDB stocke les profils, projets et expériences sous forme de documents ; Neo4j modélise les relations (Personne)-[:MAITRISE]->(Compétence)<-[:UTILISE]-(Projet). FastAPI expose des endpoints REST et calcule les projets similaires par requêtes Cypher. Le front React consomme l'API avec un repli automatique sur des données de démonstration.",
    stack: ["FastAPI", "MongoDB", "Neo4j", "React", "TypeScript", "Docker"],
    competences: ["FastAPI", "MongoDB", "Neo4j / Cypher", "Python", "Docker", "TypeScript"],
  },
  {
    slug: "classification-basketball-galaxy-watch",
    titre: "Classification Basketball ML sur Galaxy Watch",
    annee: 2025,
    mode: "hybride",
    resume:
      "Reconnaître tir, dribble et passe à partir des accéléromètres d'une Samsung Galaxy Watch.",
    description:
      "Collecte de signaux accéléromètre et gyroscope pendant des séances de basket, segmentation en fenêtres glissantes, extraction de features temporelles et fréquentielles, puis entraînement et comparaison de modèles de classification (Random Forest, SVM, réseaux légers). Objectif : un retour objectif sur la gestuelle du joueur.",
    stack: ["Python", "Scikit-learn", "Pandas", "Galaxy Watch", "Signal processing"],
    competences: [
      "Python",
      "Scikit-learn",
      "Pandas / NumPy",
      "Séries temporelles & capteurs",
      "Random Forest",
      "TensorFlow / Keras",
    ],
  },
  {
    slug: "big-data-jeux-olympiques-pyspark",
    titre: "Big Data Jeux Olympiques PySpark",
    annee: 2025,
    mode: "froid",
    resume: "Pipeline distribué d'analyse de plus d'un siècle de résultats olympiques.",
    description:
      "Ingestion des jeux de données historiques des Jeux Olympiques dans HDFS, nettoyage et jointures massives avec PySpark, agrégations par nation, discipline et époque, puis restitution des indicateurs (médailles, performances, tendances) via Spark SQL.",
    stack: ["PySpark", "Hadoop", "HDFS", "Spark SQL", "Python"],
    competences: ["PySpark", "Hadoop / HDFS", "SQL", "Python", "Pandas / NumPy"],
  },
  {
    slug: "detection-rfid-random-forest",
    titre: "Détection RFID Random Forest",
    annee: 2024,
    mode: "froid",
    resume: "Détection et localisation d'étiquettes RFID par apprentissage supervisé.",
    description:
      "Exploitation des mesures de signal (RSSI, phase) de lecteurs RFID pour prédire la présence et la zone d'un objet. Feature engineering sur les signaux bruités, entraînement d'un Random Forest, optimisation des hyperparamètres et analyse de l'importance des variables.",
    stack: ["Python", "Scikit-learn", "Random Forest", "Pandas"],
    competences: ["Python", "Scikit-learn", "Random Forest", "Pandas / NumPy", "Séries temporelles & capteurs"],
  },
];

export function demoPersonne(): Personne {
  return { profil: DEMO_PROFIL, competences_graphe: demoCompetencesGraphe() };
}

export function demoCompetencesGraphe(): CompetenceGraphe[] {
  return DEMO_COMPETENCES.map((c) => ({
    competence: c.nom,
    categorie: c.categorie,
    niveau: c.niveau,
    projets: DEMO_PROJETS.filter((p) => p.competences.includes(c.nom)).map((p) => p.slug),
  }));
}

export function demoCompetencesStats(): CategorieStats[] {
  const map = new Map<CategorieCompetence, number[]>();
  for (const c of DEMO_COMPETENCES) {
    map.set(c.categorie, [...(map.get(c.categorie) ?? []), c.niveau]);
  }
  return [...map.entries()].map(([categorie, niveaux]) => ({
    categorie,
    total: niveaux.length,
    niveau_moyen: Math.round(niveaux.reduce((a, b) => a + b, 0) / niveaux.length),
  }));
}

export function demoProjetDetail(slug: string): ProjetDetail | null {
  const projet = DEMO_PROJETS.find((p) => p.slug === slug);
  if (!projet) return null;
  return { ...projet, projets_similaires: similarProjects(DEMO_PROJETS, slug) };
}

/** Parcours affiché selon le mode : Chaud ou Froid filtrent, Hybride montre tout. */
export function experiencesForMode(experiences: Experience[], mode: Mode): Experience[] {
  const list = mode === "hybride" ? experiences : experiences.filter((e) => e.mode === mode);
  return [...list].sort((a, b) => a.ordre - b.ordre);
}
