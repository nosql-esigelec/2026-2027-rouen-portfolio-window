import asyncio

import pytest
from portfolio_api.db.mongo import get_mongo_db

@pytest.mark.asyncio
async def test_mongo_connection():
    db = get_mongo_db()

    result = await db.command("ping")

    assert result["ok"] == 1
    



