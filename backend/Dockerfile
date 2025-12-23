FROM python:3.11-slim

WORKDIR /app

# Empêche Python de créer des fichiers .pyc et assure un affichage direct des logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Installation des dépendances système nécessaires pour PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copie de tout le code source
COPY . .

# Donne les droits d'exécution (au cas où vous utilisez un script)
RUN chmod +x entrypoint.sh 2>/dev/null || true

# Commande de démarrage : Migration + Lancement Gunicorn
CMD ["sh", "-c", "python manage.py migrate && gunicorn config.wsgi --bind 0.0.0.0:$PORT"]