FROM python:3.11-slim

WORKDIR /app

# Variables d'environnement pour Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Dépendances système (pour psycopg2 et la santé du conteneur)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copie du reste du projet
COPY . .

# Rendre l'entrypoint exécutable (si présent)
RUN chmod +x entrypoint.sh

# Commande de démarrage directe pour éviter les erreurs d'entrypoint
CMD ["sh", "-c", "python manage.py migrate && gunicorn config.wsgi --bind 0.0.0.0:$PORT"]