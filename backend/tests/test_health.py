"""Test de base fourni. Ajoutez vos propres tests (repositories avec mocks, routes avec httpx)."""

from fastapi.testclient import TestClient

from portfolio_api.main import app
from portfolio_api.scripts.seed import load_member_files


def test_health():
    with TestClient(app) as client:
        r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_example_data_is_ignored_by_seed():
    """Les fichiers _exemple.json servent de modèle et ne sont pas chargés."""
    assert all(d.get("candidat_slug") != "exemple-candidat" for d in load_member_files("candidats"))
