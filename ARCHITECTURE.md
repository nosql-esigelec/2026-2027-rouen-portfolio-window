# 🧠 ARCHITECTURE - Équipe `TODO-nom-equipe`

> **Jalon 1** : ce document est votre **spécification**. Il doit être **complet** : toute l'équipe va coder dessus.
> Toutes les sections sont obligatoires. Remplacez **tous** les `TODO` (la CI « Livrables » les compte).
> En soutenance (5 à 6 min), vous présenterez surtout la **section 1** (schéma) et le contrat `API_ROUTES.md`.

## 1. Schéma d'architecture

Montrez **qui stocke quoi** et **quels flux** : frontends → API → MongoDB / Neo4j.

**Recommandé : [Excalidraw](https://excalidraw.com)** (à plusieurs via *Live collaboration*). Exportez en PNG ou SVG avec **« Embed scene »** coché,
enregistrez dans `docs/architecture.excalidraw.png`, puis remplacez le schéma Mermaid ci-dessous par :

`![Architecture](docs/architecture.excalidraw.png)`

L'image reste modifiable : rouvrez-la dans Excalidraw (ou dans VS Code avec l'extension *Excalidraw*).

```mermaid
flowchart LR
    F["Frontends (1 par membre)"] -->|HTTP JSON| API["FastAPI - backend d'équipe"]
    API -->|"personne, projets, compétences"| M[("MongoDB")]
    API -->|"graphe de compétences, similarités projets"| N[("Neo4j")]
    %% TODO : complétez / corrigez ce schéma selon VOS choix
```

TODO : en 3 à 5 lignes, le rôle de chaque base dans votre portfolio.
Voici un texte prêt à être copié-collé pour remplir votre **TODO** dans votre rapport :

**MongoDB :** Elle stocke l'ensemble des données riches, textuelles et administratives du portfolio (profil personnel, formations, expériences et fiches projets au format Markdown). Grâce à une stratégie combinant embedding et referencing par *slug*, elle garantit un accès direct et rapide en lecture pour restituer les contenus éditoriaux et les métadonnées.
**Neo4j :** Elle gère le graphe de connaissances centré sur les relations structurelles entre les projets et les compétences (*skills*). Elle prend en charge la logique métier avancée, telle que la recommandation de projets similaires par traversée de graphe et l'analyse de la centralité des technologies.

## 2. Les requêtes à servir

| # | Besoin (vu par un recruteur) | Route API | Base(s) interrogée(s) |
|---|---|---|---|
| R1 | Profil + timeline (expériences, formations) d'un candidat | `GET /api/personne/{slug}` | MongoDB |
| R2 | Projets d'un candidat, filtrables par compétence | `GET /api/personne/{slug}/projets` | MongoDB |
| R3 | Statistiques d'un candidat par compétence | `GET /api/personne/{slug}/stats` | MongoDB |
| R4 | Projets similaires à un projet | `GET /api/graph/projets/{slug}/similaires` | Neo4j |
| R5 | Graphe de compétences d'un candidat | `GET /api/graph/competences/{slug}` | Neo4j |
| R6 | Détail complet d'un projet (architecture, médias, métriques) |  | MongoDB |
| R7 | Preuves d'une compétence (projets et expériences où elle a été appliquée) |  | Neo4j (MongoDB)|
| R8 | Liste des diplômes et certifications d'un candidat |  | MongoDB |

## 3. Modèle MongoDB

### 3.1 Collection `personne` - pattern TODO (*Embedding* ? *Referencing* ?)

```json
TODO : un document d'exemple complet

{
        ObjectId _id PK
        string prenom
        string nom
        string titre
        string bio
        object contact "email, github, linkedin..."
        array formations "école, diplôme, années..."
        array experiences "entreprise, poste, missions..."
    }
```




### 3.2 Collection `projets` - pattern TODO

```json
TODO : un document d'exemple complet

{
        ObjectId _id PK
        string slug UK "Clé pivot unique"
        string titre
        string resume
        string contenu_md "Format Markdown complet"
        object liens "github, demo"
        object metriques "performances, stats"
        array skills_slugs "['python', 'mongodb', ...]"
        string date_realisation

}
   
```

### 3.3 Collection `compétences` - pattern 

```json

{
        ObjectId _id PK
        string slug UK "Clé pivot unique"
        string nom
        string categorie "Langage, BDD, DevOps..."
        string niveau_maitrise
        string icone_url
        int ordre_affichage
    }
 
```

**justifications** : 


---

**personne :** Choix du pattern d'***Embedding*** (imbrication). Les listes `formations` et `experiences` possèdent une **cardinalité bornée** (un candidat a un nombre fini et gérable d'expériences). Cela permet de récupérer l'intégralité du profil et de sa timeline en **une seule requête** (optimisant la route `GET /api/personne/{slug}`), sachant que la fréquence de mise à jour de ces données est très faible.

---

**Projets :** Choix d'un pattern ***Hybride***. Le contenu lourd et textuel (`contenu_md`, métriques) est stocké directement dans le document pour un affichage rapide, tandis que les compétences sont reliées via leurs identifiants (`skills_slugs`). Cela permet de maintenir la liaison applicative avec le graphe Neo4j tout en évitant les jointures complexes en base.

---

**Compétences :** Choix du pattern de ***Referencing*** (Référentiel partagé). Les compétences sont des entités transverses utilisées par de multiples projets et expériences. Centraliser leurs informations dans une collection dédiée évite la duplication des données, tandis que le slug fait office de référence unique partagée à la fois dans MongoDB et dans le graphe Neo4j

### 3.4 Index

| Collection | Index | Requête servie (R#) |
|---|---|---|
| TODO | TODO | TODO |

### 3.5 Pipeline d'agrégation clé (R3)

```javascript
TODO : db.projets.aggregate([ ... ])
```

## 4. Modèle Neo4j

### 4.1 Schéma du graphe

```mermaid
graph TD
    %% Nœuds
    Projets["Projets"] -->|"(utilise)"| Compétences["Compétences"]
    Expériences["Expériences"] -->|"(utilise)"| Compétences
    Formations["Formations"] -->|"(utilise)"| Compétences
    Formations -->|"(dans le cadre de)"| Projets
    Expériences -->|"(dans le cadre de)"| Projets
    Projets -->|"(similaire)"| Projets
```

| Label | Propriétés | Clé unique |
|---|---|---|
| Projets | slug, titre, annee | slug |
| Expériences | slug, poste, entreprise | slug ou id |
| Formations | slug, diplome, ecole | slug ou id |
| Compétences | slug, nom, categorie | id |

| Relation | De → Vers | Propriétés | Pourquoi ce sens |
|---|---|---|---|
| UTILISE | Projet → Skill | / | lier les réalisations et le parcours aux technologies maîtrisées pour l'analyse de compétences |
| UTILISE | Formation → Skill | / | lier les réalisations et le parcours aux technologies maîtrisées pour l'analyse de compétences |
| UTILISE | Experience → Skill | / | lier les réalisations et le parcours aux technologies maîtrisées pour l'analyse de compétences |
| DANS LE CADRE DE | Expérience → Projet | / | rattacher un projet à son cadre d'origine |
| DANS LE CADRE DE | Formation → Projet | / | rattacher un projet à son cadre d'origine |
| SIMILAIRE | Projet → Projet | score de similarité | Relie deux projets proches par leurs compétences communes |

### 4.2 Les 3 requêtes Cypher clés

```cypher
// R4 - projets similaires
TODO

// R5 - graphe de compétences d'un candidat
TODO

// Compétences communes aux membres de l'équipe (ou requête de votre choix)
TODO
```

### 4.3 Contraintes

```cypher
TODO : CREATE CONSTRAINT ... IF NOT EXISTS
```

## 5. Cohérence entre les bases (slugs pivots)

| Entité | Slug | Dans MongoDB | Dans Neo4j |
|---|---|---|---|
| Candidat | Aucun | Document unique dans la collection personne (récupéré via _id ou en tant que profil principal du portfolio).| Non modélisé dans le graphe (le graphe est centré sur les liens entre Projets, Expériences, Formations et Compétences). |
| Projet | `projet_slug` (ex. `smartcity-explorer`) | Champ slug unique dans la collection projets. | Propriété slug du noeud (:Projet). |
| Compétence | `skill_slug` (ex. `mongodb`) | Champ slug unique dans la collection compétences. | Propriété slug du nœud (:Skill / :Competence). |

**Suppression d'un projet** : que faites-vous dans chaque base ? TODO

L'API FastAPI applique une stratégie de **suppression en cascade applicative** pour garantir la cohérence entre les deux bases :
- **Dans MongoDB :** Suppression du document dans la collection `projets` en ciblant son `slug`.
- **Dans Neo4j :** Exécution d'une requête Cypher avec l'instruction `DETACH DELETE` sur le nœud `(:Projet {slug: ...})`. Le mot-clé `DETACH` supprime automatiquement toutes les relations associées (liens `UTILISE` vers les compétences, `DANS_CADRE_DE`, et `SIMILAIRE` vers d'autres projets) pour éviter les nœuds orphelins dans le graphe.

## 6. Répartition du travail

| Membre (pseudo GitHub) | Backend (couches / routes) | Frontend |
|---|---|---|
| TODO | TODO | `frontends/frontend-TODO/` |
