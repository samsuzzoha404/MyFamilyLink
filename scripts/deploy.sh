#!/usr/bin/env bash

# Deploy script for production environment
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$TIMESTAMP"

echo "🚀 Starting deployment to $ENVIRONMENT environment..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup current deployment
echo "📦 Creating backup..."
if [ -d "dist" ]; then
  cp -r dist $BACKUP_DIR/
fi

# Pull latest changes
echo "⬇️  Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📥 Installing dependencies..."
npm ci

# Build all applications
echo "🏗️  Building applications..."
npm run build

# Run database migrations
echo "🗄️  Running database migrations..."
cd apps/backend
npm run db:migrate
cd ../..

# Run tests
echo "🧪 Running tests..."
npm run test --workspaces

# Restart services
echo "♻️  Restarting services..."
pm2 restart myfamilylink-backend || pm2 start apps/backend/dist/index.js --name myfamilylink-backend

# Health check
echo "🏥 Performing health check..."
sleep 5
HEALTH_CHECK=$(curl -s http://localhost:3000/health | grep -o "ok")

if [ "$HEALTH_CHECK" == "ok" ]; then
  echo "✅ Deployment successful!"
  echo "🎉 Application is healthy and running"
else
  echo "❌ Health check failed!"
  echo "⚠️  Rolling back..."
  
  # Rollback
  cp -r $BACKUP_DIR/dist .
  pm2 restart myfamilylink-backend
  
  echo "🔄 Rollback completed"
  exit 1
fi

# Clean up old backups (keep last 5)
echo "🧹 Cleaning up old backups..."
cd backups
ls -t | tail -n +6 | xargs -r rm -rf
cd ..

echo "✨ Deployment completed at $(date)"
