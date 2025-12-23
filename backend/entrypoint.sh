#!/bin/bash

# Exit on error
set -e

# If DATABASE_URL is set, extract host and port
if [ -n "$DATABASE_URL" ]; then
  DB_HOST=$(echo $DATABASE_URL | sed -E 's#postgresql://[^:]+:[^@]+@([^:/]+):.*#\1#')
  DB_PORT=$(echo $DATABASE_URL | sed -E 's#postgresql://[^:]+:[^@]+@[^:]+:([0-9]+)/.*#\1#')
  DB_USER=$(echo $DATABASE_URL | sed -E 's#postgresql://([^:]+):.*#\1#')
  echo "Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
  while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
    sleep 1
done
  echo "PostgreSQL is ready!"
fi

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start server
echo "Starting Gunicorn server..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3
