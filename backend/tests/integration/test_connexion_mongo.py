import asyncio

import pytest
from portfolio_api.db.mongo import get_mongo_db
""" Test d'intégration de la connexion avec la commande : cd backend puis uv run pytest tests/integration/test_connexion_mongo.py -v """
@pytest.mark.asyncio
async def test_mongo_connection():
    db = get_mongo_db()

    result = await db.command("ping")

    assert result["ok"] == 1
    



