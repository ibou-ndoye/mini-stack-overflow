#!/bin/bash

# Exit on error
set -e

echo "Waiting for PostgreSQL..."
while ! pg_isready -h db -p 5432 -U postgres; do
    sleep 1
done
echo "PostgreSQL is ready!"

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start server
echo "Starting Gunicorn server..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
