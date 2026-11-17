"""Modèles Pydantic — doivent refléter EXACTEMENT les payloads de API_ROUTES.md.

TODO (équipe) : définir CandidatOut, ExperienceOut, FormationOut, ProjetOut, StatsOut, GraphOut…
"""

from __future__ import annotations

from pydantic import BaseModel, Field
from typing import Optional

class HealthResponse(BaseModel):
    status: str = "ok"


# ── Personne ─────────────────────────────────────────────────────
class Personne(BaseModel):
    slug: str = Field(..., examples=["bruce-wayne"])
    prenom: str = Field(..., examples=["Bruce"])
    nom: str = Field(..., examples=["Wayne"])
    titre: str = Field(..., examples=["Ingenieur généraliste"])
    bio: str = Field(..., examples=["Motivé recherche..."])
    contacts: dict = {}
    formations: list[Formation] = []
    experiences: list[Experience] = {}
    competences: list[Competence] = {}
   


# ── Formation ───────────────────────────────────────────────────────
class Formation(BaseModel):
    slug: str = Field(..., examples=["esigelec-big-data"])
    ecole: str = Field(..., examples=["ESIGELEC Rouen"])
    diplome: str = Field(..., examples=["Diplôme d'Ingénieur - Big Data & IA"])
    annee_debut: int = Field(..., examples=[2024])
    annee_fin: Optional[int] = Field(None, examples=[2027])


# ── Experience ───────────────────────────────────────────────────────
class Experience(BaseModel):
    
    slug: str = Field(..., examples=["stage-data-engineer"])
    entreprise: str = Field(..., examples=["Wayne Enterprises"])
    poste: str = Field(..., examples=["Data Engineer"])
    date_debut: str = Field(..., examples=["2026-04"])
    date_fin: Optional[str] = Field(None, examples=["2026-09"])
    missions: list[str] = Field(default_factory=list)

# ── Contact ───────────────────────────────────────────────────────
class Contact(BaseModel):
    email: Optional[str] = Field(None, examples=["bruce.wayne@wayne-ent.com"])
    github: Optional[str] = Field(None, examples=["https://github.com/bwayne"])
    linkedin: Optional[str] = Field(None, examples=["https://linkedin.com/in/bruce-wayne"])
    


# ── Contact ───────────────────────────────────────────────────────
