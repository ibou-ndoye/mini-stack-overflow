# Mini Stack Overflow - Deployment Guide

## 🚀 Déploiement avec Docker

Cette application utilise Docker pour faciliter le déploiement avec PostgreSQL.

### Prérequis

- Docker Desktop installé
- Docker Compose installé

### Structure des Services

L'application est composée de 3 services Docker :

1. **PostgreSQL** (port 5432) - Base de données
2. **Backend Django** (port 8000) - API REST
3. **Frontend React** (port 3000) - Interface utilisateur

### Démarrage Rapide

1. **Cloner le projet et naviguer dans le dossier**
   ```bash
   cd mini-stack-overflow
   ```

2. **Démarrer tous les services**
   ```bash
   docker-compose up -d
   ```

3. **Vérifier que les services sont en cours d'exécution**
   ```bash
   docker-compose ps
   ```

4. **Accéder à l'application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/
   - Admin Django: http://localhost:8000/admin/

### Commandes Utiles

#### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

#### Arrêter les services
```bash
docker-compose down
```

#### Arrêter et supprimer les volumes (⚠️ supprime les données)
```bash
docker-compose down -v
```

#### Reconstruire les images
```bash
docker-compose build
docker-compose up -d
```

#### Exécuter des commandes Django
```bash
# Créer un superutilisateur
docker-compose exec backend python manage.py createsuperuser

# Exécuter les migrations
docker-compose exec backend python manage.py migrate

# Accéder au shell Django
docker-compose exec backend python manage.py shell
```

#### Accéder à PostgreSQL
```bash
docker-compose exec db psql -U postgres -d stackoverflow
```

### Variables d'Environnement

Les variables d'environnement sont définies dans `docker-compose.yml`. Pour la production, créez un fichier `.env` :

```env
SECRET_KEY=votre-clé-secrète-très-longue-et-aléatoire
DEBUG=False
DATABASE_URL=postgresql://postgres:mot_de_passe_fort@db:5432/stackoverflow
ALLOWED_HOSTS=votre-domaine.com,www.votre-domaine.com
```

### Développement Local (sans Docker)

Si vous préférez développer sans Docker :

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configurer PostgreSQL localement et créer .env
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stackoverflow

python manage.py migrate
python manage.py runserver
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Troubleshooting

#### Le backend ne démarre pas
```bash
# Vérifier les logs
docker-compose logs backend

# Reconstruire le backend
docker-compose build backend
docker-compose up -d backend
```

#### Erreur de connexion à la base de données
```bash
# Vérifier que PostgreSQL est prêt
docker-compose exec db pg_isready -U postgres

# Redémarrer la base de données
docker-compose restart db
```

#### Les migrations ne s'appliquent pas
```bash
# Exécuter manuellement les migrations
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### Production

Pour un déploiement en production :

1. Modifier les variables d'environnement (SECRET_KEY, DEBUG=False)
2. Configurer un domaine et HTTPS (avec Nginx + Let's Encrypt)
3. Utiliser des mots de passe forts pour PostgreSQL
4. Configurer les sauvegardes de la base de données
5. Utiliser un service de stockage pour les fichiers media (AWS S3, etc.)

### Support

Pour toute question ou problème, consultez la documentation Django et React.
