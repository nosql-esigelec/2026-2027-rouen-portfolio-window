# 📜 API_ROUTES - Contrat d'interface de l'équipe

> **Jalon 1** : le contrat entre le backend d'équipe et **chaque** frontend. Il doit être **complet** :
> chaque membre doit pouvoir coder son frontend avec ce seul document, sans attendre le backend.
> Les 5 routes ci-dessous sont le minimum ; ajoutez **toutes** celles dont vos frontends ont besoin.
> Remplacez **tous** les `TODO`. Après la soutenance, toute modification passe par une Pull Request relue par l'équipe.

Base URL : `http://localhost:8000` · Swagger : `http://localhost:8000/docs`

## Conventions

- Identifiants publics = **slugs** (`alice-martin`, `smartcity-explorer`, `mongodb`), jamais d'`ObjectId` exposé.
- Erreurs : `404 {"detail": "..."}` si la ressource n'existe pas.
- Pagination : `?page=1&size=20` → `{"items": [...], "total": 42, "page": 1, "size": 20}`.

## `GET /api/health`

Fourni. Réponse : `{"status": "ok"}`

## 1. `GET /api/personnes/{slug}` : profil complet, timeline et compétences du graphe

- **Paramètres** :
  - `slug` (path, obligatoire) : identifiant unique du membre (ex. `bruce-wayne`)
- **Écran qui l'utilise** : Page Profil / CV du candidat (en-tête, bio, contacts, timeline formations/expériences et compétences déduites de Neo4j)

```json
{
  "profil": {
    "slug": "bruce-wayne",
    "prenom": "Bruce",
    "nom": "Wayne",
    "titre": "Ingénieur Big Data & IA",
    "bio": "Spécialisé en architectures distribuées, machine learning et bases de données polyglottes.",
    "contacts": {
      "email": "bruce.wayne@wayne-ent.com",
      "github": "[https://github.com/bwayne](https://github.com/bwayne)",
      "linkedin": "[https://linkedin.com/in/bruce-wayne](https://linkedin.com/in/bruce-wayne)"
    },
    "formations": [
      {
        "id": "form-esigelec-2024",
        "ecole": "ESIGELEC Rouen",
        "diplome": "Diplôme d'Ingénieur - Big Data & IA",
        "debut": "2024-09",
        "fin": "2027-04",
        "competences": ["python", "mongodb", "neo4j"]
      }
    ],
    "experiences": [
      {
        "id": "exp-wayne-2026",
        "poste": "Data Engineer",
        "structure": "Wayne Enterprises",
        "type": "Stage",
        "debut": "2026-04",
        "fin": "2026-09",
        "missions": [
          "Conception d'un pipeline de traitement de données",
          "Développement d'API analytiques sous FastAPI"
        ],
        "competences": ["python", "mongodb", "docker"]
      }
    ],
    "competences": ["python", "mongodb", "neo4j", "docker"]
  },
  "competences_graphe": [
    {
      "slug": "mongodb",
      "nom": "MongoDB",
      "categorie": "Bases de données",
      "niveau": null,
      "mots_cles": []
    },
    {
      "slug": "python",
      "nom": "Python",
      "categorie": "Langages",
      "niveau": null,
      "mots_cles": []
    }
  ]
}
```

## 2. `GET /api/projets` : projets d'un candidat

- **Paramètres** : competence (query, optionnel) : slug de compétence pour filtrer les projets (ex. ?competence=mongodb)
- **Écran** : Galerie / Catalogue des projets (avec barre de filtres par technologie)

```json
[
  {
    "slug": "rouen-portfolio",
    "titre": "Portfolio Hybride MongoDB & Neo4j",
    "description": "Application web full-stack combinant stockage documentaire et moteur de recommandation graphe.",
    "date_realisation": "2026",
    "contexte_id": "form-esigelec-2024",
    "personne_slugs": ["bruce-wayne"],
    "skills_slugs": ["python", "fastapi", "mongodb", "neo4j"]
  }
]
```

## 3. `GET /api/projets/stats/competences` : statistiques par compétence (agrégation MongoDB)

- **Paramètres** : Aucun
- **Écran** : Dashboard / Graphique en barres du nombre de projets réalisés par technologie

```json
[
  {
    "competence_slug": "python",
    "nb_projets": 4
  },
  {
    "competence_slug": "mongodb",
    "nb_projets": 3
  },
  {
    "competence_slug": "neo4j",
    "nb_projets": 2
  }
]
```

## 4. `GET /api/graph/projets/{slug}/similaires` : projets similaires (Neo4j)

- **Paramètres** : slug (path, obligatoire) : slug du projet de référence (ex. rouen-portfolio)
                  limit (query, optionnel, défaut 5, min 1, max 100) : nombre maximum de projets similaires retournés
- **Écran** : Section « Projets similaires » en bas de la page détail d'un projet

```json
[
  {
    "slug": "streampulse-recommender",
    "titre": "StreamPulse - Moteur de recommandation hybride",
    "annee": 2026,
    "score": 3
  },
  {
    "slug": "olympics-bigdata",
    "titre": "Pipeline ETL PySpark & Power BI",
    "annee": 2026,
    "score": 1
  }
]
```

## 5. `GET /api/competences/stats/top` : graphe de compétences prêt à afficher (Neo4j)

- **Paramètres** : limit (query, optionnel, défaut 10, min 1, max 50) : nombre de compétences à afficher
- **Écran** : Vue analytique / Top des compétences les plus mobilisées across projets, expériences et formations

```json
[
  {
    "slug": "python",
    "nom": "Python",
    "categorie": "Langages",
    "nb_usages": 6
  },
  {
    "slug": "neo4j",
    "nom": "Neo4j",
    "categorie": "Bases de données",
    "nb_usages": 3
  }
]
```

## 6. `GET /api/personnes` : Affiche le details complet de la personne

- **Paramètres** : Aucun
- **Écran** : Page d'acceuil


```json
[
  {
    "slug": "bruce-wayne",
    "prenom": "Bruce",
    "nom": "Wayne",
    "titre": "Ingénieur Big Data & IA",
    "bio": "Spécialisé en architectures distribuées, machine learning et bases de données polyglottes.",
    "contacts": {
      "email": "bruce.wayne@wayne-ent.com",
      "github": "[https://github.com/bwayne](https://github.com/bwayne)",
      "linkedin": "[https://linkedin.com/in/bruce-wayne](https://linkedin.com/in/bruce-wayne)"
    },
    "formations": [],
    "experiences": [],
    "competences": ["python", "mongodb", "neo4j", "docker"]
  }
]
```

## 7. `GET /api/projets/{slug}` : détail complet d'un projet (MongoDB + Neo4j)

- **Paramètres** : slug (path, obligatoire) : slug du projet (ex. rouen-portfolio)
- **Écran** : Page Détail d'un projet (description complète, badges compétences enrichis et recommandations) 

```json
{
  "slug": "rouen-portfolio",
  "titre": "Portfolio Hybride MongoDB & Neo4j",
  "description": "Application web full-stack combinant stockage documentaire et moteur de recommandation graphe.",
  "date_realisation": "2026",
  "contexte_id": "form-esigelec-2024",
  "personne_slugs": ["bruce-wayne"],
  "skills_slugs": ["python", "neo4j"],
  "competences_detaillees": [
    {
      "slug": "python",
      "nom": "Python",
      "categorie": "Langages"
    },
    {
      "slug": "neo4j",
      "nom": "Neo4j",
      "categorie": "Bases de données"
    }
  ],
  "projets_similaires": [
    {
      "slug": "streampulse-recommender",
      "titre": "StreamPulse - Moteur de recommandation hybride",
      "annee": 2026,
      "score": 2
    }
  ]
}

```

## 8. `GET /api/competences` : référentiel complet des compétences

- **Paramètres** : Aucun (trié par ordre_affichage croissant dans MongoDB)
- **Écran** : Catalogue des compétences / Menu de filtrage global

```json
[
  {
    "slug": "python",
    "nom": "Python",
    "categorie": "Langages",
    "niveau": "Avancé",
    "mots_cles": ["fastapi", "pandas", "backend", "data"]
  }
]
```

## 9. `GET /api/competences/{slug}` : détail d'une compétence et preuves d'utilisation (MongoDB + Neo4j)

- **Paramètres** : slug (path, obligatoire) : slug de la compétence (ex. python)
- **Écran** : Page / Modale Détail d'une compétence listant toutes les preuves concrètes (projets, expériences, formations)

```json
{
  "slug": "python",
  "nom": "Python",
  "categorie": "Langages",
  "niveau": "Avancé",
  "mots_cles": ["fastapi", "pandas", "backend", "data"],
  "usages": [
    {
      "type": "Projet",
      "ref": "rouen-portfolio",
      "titre": "Portfolio Hybride MongoDB & Neo4j"
    },
    {
      "type": "Experience",
      "ref": "exp-wayne-2026",
      "titre": "Data Engineer"
    },
    {
      "type": "Formation",
      "ref": "form-esigelec-2024",
      "titre": "Diplôme d'Ingénieur - Big Data & IA"
    }
  ]
}
```

## 10. `GET /api/competences/stats/categories` : répartition des compétences par catégorie (agrégation MongoDB)

- **Paramètres** : Aucun
- **Écran** : Dashboard / Graphique de répartition des compétences par domaine (Langages, Bases de données, DevOps, Data / IA)

```json
[
  {
    "categorie": "Langages",
    "total": 3,
    "competences": [
      { "slug": "python", "nom": "Python", "categorie": null },
      { "slug": "sql", "nom": "SQL", "categorie": null }
    ]
  },
  {
    "categorie": "Bases de données",
    "total": 2,
    "competences": [
      { "slug": "mongodb", "nom": "MongoDB", "categorie": null },
      { "slug": "neo4j", "nom": "Neo4j", "categorie": null }
    ]
  }
]
```


## 11. Routes d'administration CRUD synchronisées (MongoDB + Neo4j)
Ces endpoints permettent de gérer le portfolio depuis une interface d'administration tout en maintenant la synchronisation automatique entre MongoDB et le graphe Neo4j :

| Méthode & Route | Corps de requête (Payload) | Réponse | Effet sur les bases |
|---|---|---|---|
| `POST /api/projets` | Objet `Projet` complet | `201 Created` (`Projet`) | Insère le document dans MongoDB + `MERGE (:Projet)` et ses relations `[:UTILISE]` dans Neo4j |
| `PATCH /api/projets/{slug}` | Objet `ProjetUpdate` (champs optionnels) | `200 OK` (`Projet`) | Met à jour MongoDB et resynchronise les relations `[:UTILISE]` dans Neo4j |
| `DELETE /api/projets/{slug}` | Aucun | `204 No Content` | Supprime dans MongoDB (`delete_one`) + `DETACH DELETE` du nœud dans Neo4j |
| `POST /api/competences` | Objet `Competence` complet | `201 Created` (`Competence`) | Insère dans MongoDB + `MERGE (:Competence)` dans Neo4j |
| `PATCH /api/competences/{slug}` | Objet `CompetenceUpdate` (champs optionnels) | `200 OK` (`Competence`) | Met à jour MongoDB et synchronise `nom`/`categorie` dans Neo4j |
| `DELETE /api/competences/{slug}` | Aucun | `204 No Content` | Supprime dans MongoDB (`delete_one`) + `DETACH DELETE` du nœud dans Neo4j |