# 🚀 Portfolio d'Ingénieur Polyglotte — Dépôt d'équipe

> Sujet complet, jalons et barème : **[Projet Portfolio](https://nosql-esigelec.github.io/course/portfolio/)**
> · Grille d'évaluation : **[Grille d'évaluation](https://nosql-esigelec.github.io/course/portfolio/grille/)**
> · Dates : **[Planning officiel](https://nosql-esigelec.github.io/course/planning/)**

## 🗺️ Ce que contient ce dépôt

```text
.
├── ARCHITECTURE.md        # 🧠 Jalon 1 — à compléter en équipe (modèles MongoDB + Neo4j, pivots)
├── API_ROUTES.md          # 📜 Jalon 1 — contrat d'API entre le backend et vos frontends
├── docker-compose.yml     # MongoDB + Neo4j (ports décalés : pas de conflit avec SmartCity)
├── justfile               # just up · just seed · just dev · just test
├── backend/               # ⚙️ Jalon 2 (équipe) — API FastAPI unifiée, même architecture que SmartCity
│   └── src/portfolio_api/
│       ├── core/          #   configuration (.env)
│       ├── db/            #   connexions MongoDB / Neo4j (reprenez vos singletons SmartCity)
│       ├── models/        #   modèles Pydantic = contrat API_ROUTES.md
│       ├── repositories/  #   requêtes MongoDB (CRUD + agrégations) et Cypher
│       ├── services/      #   orchestration multi-bases
│       ├── api/           #   routes FastAPI
│       └── scripts/seed.py#   peuplement depuis data/
├── data/                  # 📇 VOS vraies données (1 fichier par membre)
│   ├── candidats/<pseudo>.json
│   └── projets/<pseudo>.json
└── frontends/             # 🎨 Jalon 2 (individuel) — 1 dossier par membre : frontend-<pseudo-github>/
```

## ⚡ Démarrage

```bash
cp .env.example .env
just up          # MongoDB (localhost:27018) + Neo4j (http://localhost:7475, bolt 7688)
just install     # uv sync (backend)
just dev         # API sur http://localhost:8000/docs
just test        # tests du backend
```

> Neo4j Browser : http://localhost:7475 — connexion `bolt://localhost:7688`, identifiants `neo4j` / `password`.

## 👥 Règles de collaboration

Voir **[CONTRIBUTING.md](./CONTRIBUTING.md)** : une branche par fonctionnalité, Pull Request relue par un autre membre, `main` toujours fonctionnel.
Chaque membre ne modifie **que** son dossier `frontends/frontend-<pseudo>/` et ses fichiers `data/*/<pseudo>.json` en dehors du backend commun.

## ✅ Checklist des livrables

- [ ] **Jalon 1** — `ARCHITECTURE.md` et `API_ROUTES.md` complétés (plus aucun `TODO`) et poussés sur `main` avant l'échéance.
- [ ] **Jalon 2 (équipe)** — `just up && just seed && just dev` fonctionne sur une machine neuve ; toutes les routes de `API_ROUTES.md` répondent.
- [ ] **Jalon 2 (individuel)** — `frontends/frontend-<pseudo>/README.md` explique comment lancer votre frontend ; il consomme l'API d'équipe (parcours, projets, graphe de compétences).
