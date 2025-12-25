# Scripts

Utility scripts for MyFamilyLink project management.

## Available Scripts

### Build Scripts

#### `build-all.js`
Build all applications in the workspace.

```bash
node scripts/build-all.js
```

Builds:
- Admin dashboard
- Citizen portal  
- Backend API

### Deployment Scripts

#### `deploy.sh`
Deploy to production or staging environment.

```bash
./scripts/deploy.sh production
./scripts/deploy.sh staging
```

Features:
- Creates backup before deployment
- Pulls latest changes
- Installs dependencies
- Builds applications
- Runs database migrations
- Performs health checks
- Automatic rollback on failure

### Database Scripts

#### `backup-db.sh`
Create database backup.

```bash
./scripts/backup-db.sh
```

Features:
- Creates compressed SQL dump
- Uploads to S3 (if configured)
- Cleans up old backups (30+ days)
- Stores in `backups/database/`

#### `restore-db.sh`
Restore database from backup.

```bash
./scripts/restore-db.sh backups/database/myfamilylink_20251225_120000.sql.gz
```

### Setup Scripts

#### `setup-dev.js`
Interactive development environment setup.

```bash
node scripts/setup-dev.js
```

Features:
- Checks Node.js version
- Verifies required tools
- Creates .env from template
- Installs dependencies
- Runs database migrations

## Making Scripts Executable

On Unix-based systems (Linux/macOS):

```bash
chmod +x scripts/*.sh
```

## Environment Variables

Scripts read from `.env` file in the root directory.

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `NODE_ENV` - Environment (development/production)

## Scheduled Tasks

### Daily Database Backup (Cron)

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * cd /path/to/myfamilylink && ./scripts/backup-db.sh
```

### Weekly Cleanup

```bash
# Clean old logs and temp files every Sunday at 3 AM
0 3 * * 0 cd /path/to/myfamilylink && npm run clean
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Build
        run: node scripts/build-all.js
      - name: Deploy
        run: ./scripts/deploy.sh production
```

## Troubleshooting

### Permission Denied

```bash
chmod +x scripts/script-name.sh
```

### Script Not Found

Ensure you're running from project root:
```bash
cd /path/to/myfamilylink
./scripts/script-name.sh
```

### Database Connection Failed

Check DATABASE_URL in .env file:
```bash
cat .env | grep DATABASE_URL
```

## Adding New Scripts

1. Create script in `scripts/` directory
2. Add shebang line: `#!/usr/bin/env bash` or `#!/usr/bin/env node`
3. Make executable: `chmod +x scripts/new-script.sh`
4. Document in this README
5. Test thoroughly before committing
