"""Peuple MongoDB et Neo4j avec les VRAIES données de tous les membres (dossier data/).

Exigences (évaluées au Jalon 2) :
- 1 seule commande : `just seed`
- idempotent : relancer le seed ne crée pas de doublons
- reproductible sur une machine neuve après `just up`
"""

from __future__ import annotations

import asyncio
import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[4] / "data"


def load_member_files(kind: str) -> list[dict]:
    """Charge data/<kind>/*.json (hors fichiers commençant par '_', ex. _exemple.json)."""
    docs: list[dict] = []
    for path in sorted((DATA_DIR / kind).glob("*.json")):
        if path.name.startswith("_"):
            continue
        content = json.loads(path.read_text(encoding="utf-8"))
        docs.extend(content if isinstance(content, list) else [content])
    return docs


async def seed_mongo(candidats: list[dict], projets: list[dict]) -> None:
    # TODO (équipe) : vider puis insérer selon VOTRE modèle (ARCHITECTURE.md §3), créer les index
    raise NotImplementedError


async def seed_neo4j(candidats: list[dict], projets: list[dict]) -> None:
    # TODO (équipe) : contraintes + MERGE des nœuds et relations (ARCHITECTURE.md §4)
    raise NotImplementedError


async def main() -> None:
    candidats = load_member_files("candidats")
    projets = load_member_files("projets")
    print(f"[seed] {len(candidats)} candidat(s), {len(projets)} projet(s) trouvés dans {DATA_DIR}")
    await seed_mongo(candidats, projets)
    await seed_neo4j(candidats, projets)
    print("[seed] OK")


if __name__ == "__main__":
    asyncio.run(main())
