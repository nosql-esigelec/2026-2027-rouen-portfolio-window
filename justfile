set dotenv-load := true

# Lister les commandes
default:
    @just --list

# Démarrer MongoDB + Neo4j
up:
    docker compose up -d

# Arrêter les bases
down:
    docker compose down

# Repartir de bases vides
reset:
    docker compose down -v
    docker compose up -d

# Installer les dépendances du backend
install:
    cd backend && uv sync

# Lancer l'API (http://localhost:8000/docs)
dev:
    cd backend && uv run uvicorn portfolio_api.main:app --reload --port 8000

# Peupler MongoDB et Neo4j depuis data/
seed:
    cd backend && uv run python -m portfolio_api.scripts.seed

# Tests du backend
test:
    cd backend && uv run pytest -q
