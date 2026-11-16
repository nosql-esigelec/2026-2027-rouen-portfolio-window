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

## 1. `GET /api/candidats/{slug}` : profil et timeline

- **Paramètres** : TODO
- **Écran qui l'utilise** : TODO

```json
TODO : exemple de réponse complet et réaliste
```

## 2. `GET /api/candidats/{slug}/projets` : projets d'un candidat

- **Paramètres** : TODO (ex. `?competence=mongodb&page=1`)
- **Écran** : TODO

```json
TODO
```

## 3. `GET /api/candidats/{slug}/stats` : statistiques par compétence (agrégation MongoDB)

- **Paramètres** : TODO
- **Écran** : TODO

```json
TODO
```

## 4. `GET /api/graph/projets/{slug}/similaires` : projets similaires (Neo4j)

- **Paramètres** : TODO (ex. `?limit=5`)
- **Écran** : TODO

```json
TODO
```

## 5. `GET /api/graph/competences/{slug}` : graphe de compétences prêt à afficher (Neo4j)

- **Paramètres** : TODO
- **Écran** : TODO

```json
TODO : {"nodes": [...], "links": [...]}
```

## TODO : vos routes supplémentaires

Une section par route, même format : chemin, paramètres, écran, exemple de réponse.
