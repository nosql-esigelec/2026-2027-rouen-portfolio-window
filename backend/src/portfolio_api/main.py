"""Portfolio Polyglotte — application FastAPI."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from portfolio_api.core.config import get_settings
from portfolio_api.db.mongo import close_mongo
from portfolio_api.db.neo4j import close_neo4j
from portfolio_api.models import HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await close_mongo()
    await close_neo4j()


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="API d'équipe du Portfolio Polyglotte — voir API_ROUTES.md",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse, tags=["santé"])
async def health() -> HealthResponse:
    return HealthResponse()


# TODO (équipe) : enregistrer vos routeurs
# from portfolio_api.api.routes_candidats import router as candidats_router
# app.include_router(candidats_router, prefix="/api")
