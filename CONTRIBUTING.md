# 👥 Travailler à 4 ou 5 sur le même dépôt

## Règle d'or : `main` fonctionne toujours

On ne pousse **jamais** directement sur `main` du code non testé. On passe par une branche + Pull Request.

```bash
git switch main && git pull                 # partir d'un main à jour
git switch -c feat/neo4j-projets-similaires # 1 branche = 1 fonctionnalité
# ... coder, tester (just test) ...
git add -A && git commit -m "feat(neo4j): projets similaires par compétences partagées"
git push -u origin feat/neo4j-projets-similaires
# -> ouvrir une Pull Request sur GitHub, un autre membre relit et merge
```

## Qui touche quoi (pour éviter les conflits)

| Zone | Propriétaire | Règle |
|---|---|---|
| `ARCHITECTURE.md`, `API_ROUTES.md` | toute l'équipe | modifications par PR relue par tous |
| `backend/src/portfolio_api/repositories/mongo_*.py` | binôme MongoDB | |
| `backend/src/portfolio_api/repositories/neo4j_*.py` | binôme Neo4j | |
| `backend/src/portfolio_api/services/`, `api/` | 1 référent + relecture | suivre `API_ROUTES.md` |
| `data/candidats/<pseudo>.json`, `data/projets/<pseudo>.json` | chaque membre | uniquement **ses** fichiers |
| `frontends/frontend-<pseudo>/` | chaque membre | uniquement **son** dossier |

## Messages de commit

`type(zone): description` — types : `feat`, `fix`, `docs`, `test`, `refactor`, `chore`.

> Vos commits sont **nominatifs** : configurez `git config --global user.email` avec l'email de votre compte GitHub,
> sinon vos contributions ne vous sont pas attribuées.

## En cas de conflit

```bash
git switch main && git pull
git switch ma-branche && git merge main   # résoudre les conflits dans VS Code, puis :
git add -A && git commit && git push
```
