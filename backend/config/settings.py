"""
Django settings for config project.
Optimized for Production & Docker.
"""

from pathlib import Path
from datetime import timedelta
from decouple import config
import dj_database_url
import os

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# --- SÉCURITÉ ---
# En ligne, SECRET_KEY doit être dans ton .env
SECRET_KEY = config('SECRET_KEY', default='django-insecure-production-ready-key-change-me')

# DEBUG est True par défaut en local, mais sera False en production via le .env
DEBUG = config('DEBUG', default=True, cast=bool)

# Autorise localhost et ton futur domaine (ex: stackoverflow.onrender.com)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# --- APPS ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',
    'whitenoise.runserver_nostatic',  # Pour servir les fichiers statiques proprement
]

# --- MIDDLEWARE ---
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # INDISPENSABLE pour le CSS en ligne
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# --- BASE DE DONNÉES ---
# On essaie de récupérer DATABASE_URL de l'environnement (Railway injecte ça automatiquement)
# Si absent ou vide, on utilise SQLite par défaut pour éviter le crash.
tmp_db_url = os.environ.get('DATABASE_URL')

if tmp_db_url:
    # Log the host for debugging (safe as it doesn't log password)
    from urllib.parse import urlparse
    parsed = urlparse(tmp_db_url)
    print(f"--- INFO: Initialisation de la base de données sur l'hôte: {parsed.hostname} ---")
    DATABASES = {
        'default': dj_database_url.config(default=tmp_db_url, conn_max_age=600, conn_health_checks=True)
    }
else:
    print("--- WARNING: DATABASE_URL non trouvée, utilisation de SQLite ---")
    # Fallback SQLite pour le build ou local
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# --- AUTHENTIFICATION ---
AUTH_USER_MODEL = 'api.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# --- CORS ---
CORS_ALLOW_ALL_ORIGINS = True  # À restreindre plus tard pour la sécurité

# --- FICHIERS STATIQUES & MEDIA ---
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Configuration WhiteNoise pour la compression des fichiers CSS/JS
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# --- VALIDATION MOT DE PASSE ---
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# --- INTERNATIONALIZATION ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'