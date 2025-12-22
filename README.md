# Quick Start Guide

## Démarrage avec Docker

1. **Démarrer l'application**
   ```bash
   docker-compose up -d
   ```

2. **Créer un superutilisateur**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

3. **Accéder à l'application**
   - Frontend: http://localhost:3000
   - API: http://localhost:8000/api/
   - Admin: http://localhost:8000/admin/

## Commandes Utiles

```bash
# Voir les logs
docker-compose logs -f

# Arrêter l'application
docker-compose down

# Reconstruire après modifications
docker-compose build
docker-compose up -d
```

Pour plus de détails, consultez [DEPLOYMENT.md](DEPLOYMENT.md)
