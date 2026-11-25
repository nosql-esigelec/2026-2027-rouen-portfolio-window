# Rapport de projet — Portfolio Polyglotte

## 1. Dépôt Git & Documentation technique

* **Dépôt Git du projet :** https://github.com/nosql-esigelec/2026-2027-rouen-portfolio-window

* **Architecture & Routes API :** Les fichiers `ARCHITECTURE.md` et `API_ROUTES.md` (à jour) sont disponibles directement dans ce dépôt Git :

  * [ARCHITECTURE.md](https://github.com/nosql-esigelec/2026-2027-rouen-portfolio-window/blob/main/ARCHITECTURE.md)

  * [API_ROUTES.md](https://github.com/nosql-esigelec/2026-2027-rouen-portfolio-window/blob/main/API_ROUTES.md)

> **Organisation Git :** Le code commun (backend et structure globale) se trouve sur la branche `main`. Chaque membre de l'équipe a développé son **portfolio individuel sur sa propre branche Git** dédiée.

## 2. Backend déployé & Validation des bases de données (MongoDB & Neo4j)

* **API déployée (Vercel) :** https://portfolio-lucie-fawn.vercel.app/api/health

* **Documentation interactive (Swagger / OpenAPI) :** https://portfolio-lucie-fawn.vercel.app/docs

* **Video de test de l'API : ** C:\Users\lucie\2026-2027-rouen-portfolio-window\video get projet.mp4

### Vérification de la connexion aux BDDs

1. **Via l'endpoint de santé en ligne (recommandé) :**

   * **Healthcheck :** https://portfolio-lucie-fawn.vercel.app/api/health *(vérifie en direct l'état de connexion à MongoDB Atlas et Neo4j Aura)*

   * Vous pouvez également tester directement les requêtes API depuis l'interface Swagger : https://portfolio-lucie-fawn.vercel.app/docs *(ex. `GET /api/projects`, `GET /api/skills`, etc.)*.

   <video src="./video%20get%20projet.mp4" controls width="100%"></video>

2. **Via le script de vérification en local (avec le fichier `.env` configuré) :**

   ```bash
   cd backend
   uv run python src/portfolio_api/scripts/check_connexion.py
   ```

   *(Note : sur le plan gratuit Neo4j Aura, l'instance se met en pause automatiquement après une période d'inactivité ).*

## 3. Portfolios déployés (Frontends)

Chaque membre de l'équipe dispose de sa branche dédiée et de son déploiement individuel :

* **Clara (`claramasse4`) :** https://portfolio-frontend-claramasse4.vercel.app/#accueil *(branche : `front-clara` , fork : https://github.com/claramasse4/portfolio/tree/main/frontends/frontend-claramasse4)*

* **Lucie (LucieEsigelec) :** https://portfoliolucie-frontend-psi.vercel.app/ *(fork : https://github.com/LucieEsigelec/portfolio_lucie/tree/main/frontends/frontend-LucieEsigelec)*

* **Akim :** https://portfolio-akim-iwke.vercel.app/ *(fork : https://github.com/idontknowwwwwww/portfolio-Akim/tree/main/frontends/frontend-idontknowwwwwww)*

* **Bangaly :** 