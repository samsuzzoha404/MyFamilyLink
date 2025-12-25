#!/usr/bin/env bash

# Database backup script
# Usage: ./scripts/backup-db.sh

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/database"
FILENAME="myfamilylink_$TIMESTAMP.sql"

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Create backup directory
mkdir -p $BACKUP_DIR

echo "📦 Starting database backup..."

# Extract database connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Perform backup
echo "🗄️  Backing up database: $DB_NAME"
PGPASSWORD=$DB_PASS pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME > $BACKUP_DIR/$FILENAME

# Compress backup
echo "🗜️  Compressing backup..."
gzip $BACKUP_DIR/$FILENAME

# Upload to cloud storage (optional)
if command -v aws &> /dev/null; then
  echo "☁️  Uploading to S3..."
  aws s3 cp $BACKUP_DIR/$FILENAME.gz s3://myfamilylink-backups/database/
fi

# Clean up old backups (keep last 30 days)
echo "🧹 Cleaning up old backups..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "✅ Backup completed: $BACKUP_DIR/$FILENAME.gz"
echo "📊 Backup size: $(du -h $BACKUP_DIR/$FILENAME.gz | cut -f1)"
