"""Modèles Pydantic — doivent refléter EXACTEMENT les payloads de API_ROUTES.md.

TODO (équipe) : définir CandidatOut, ExperienceOut, FormationOut, ProjetOut, StatsOut, GraphOut…
"""

from __future__ import annotations

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str = "ok"
