"""Connexion MongoDB (singleton).

TODO (équipe) : reprenez le singleton de SmartCity (`db/mongo.py`, Sprint 1).
Recommandé : `pymongo.AsyncMongoClient` (même API que Motor).

    from pymongo import AsyncMongoClient
    from pymongo.asynchronous.database import AsyncDatabase
"""
from __future__ import annotations

import asyncio

# from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from portfolio_api.core.config import get_settings

_client: AsyncMongoClient | None = None


def get_mongo_db() -> AsyncDatabase:
    """Retourne la base MongoDB (singleton). À compléter : créer le client Motor avec settings.mongo_url, retourner client[settings.mongo_db]."""
    global _client
    try:
        current_loop = asyncio.get_running_loop()
    except RuntimeError:
        current_loop = None

    # Si le client existe mais que sa boucle est fermée ou différente, on le réinitialise
    if _client is not None:
        try:
            client_loop = _client.get_io_loop()
            if client_loop.is_closed() or (current_loop is not None and client_loop is not current_loop):
                _client = None
        except Exception:
            _client = None
            
    if _client is None:
        _client = AsyncMongoClient(get_settings().mongo_url)
    return _client[get_settings().mongo_db]



async def close_mongo() -> None:
    """Ferme la connexion (appelé à l'arrêt de l'API)."""
    if _client is not None:
        _client.close()
        _client = None
    return None
