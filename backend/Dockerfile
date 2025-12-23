# ---- Multi‑stage Dockerfile for Railway ----
# Build stage – install dependencies and collect static files
FROM python:3.11-slim AS builder
WORKDIR /app

# Environment variables for optimal Python behaviour
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System dependencies (PostgreSQL client for migrations)
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy source code and collect static files
COPY . ./
RUN python manage.py collectstatic --noinput

# Runtime stage – lightweight image
FROM python:3.11-slim
WORKDIR /app

# Copy only the needed artefacts from builder
COPY --from=builder /app /app

# Ensure entrypoint is executable
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

# Expose the port Railway will provide via $PORT (default 8000 for local dev)
ENV PORT=${PORT:-8000}
EXPOSE $PORT

# Use the entrypoint which will start Gunicorn on the injected port
ENTRYPOINT ["/app/entrypoint.sh"]
