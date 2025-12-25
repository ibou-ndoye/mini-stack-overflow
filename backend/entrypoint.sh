#!/bin/bash

# Exit on error
set -e

# If DATABASE_URL is set, wait for database
if [ -n "$DATABASE_URL" ]; then
  echo "Waiting for PostgreSQL to be ready..."
  # Use pg_isready with the full DATABASE_URL for robustness
  while ! pg_isready -d "$DATABASE_URL"; do
    sleep 1
  done
  echo "PostgreSQL is ready!"
fi

# Run migrations (ensure they are committed to git)
echo "Running database migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start server
echo "Starting Gunicorn server..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3
