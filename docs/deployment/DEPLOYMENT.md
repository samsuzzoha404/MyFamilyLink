# Deployment Guide

MyFamilyLink Deployment Documentation

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- Domain name with SSL certificate
- Cloud provider account (AWS/Azure/GCP)

## Environment Setup

### 1. Environment Variables

Create `.env` files for each environment:

**Backend (.env)**
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/myfamilylink
REDIS_URL=redis://host:6379
JWT_SECRET=your-secure-secret-key
ADMIN_URL=https://admin.myfamilylink.gov.my
CITIZEN_URL=https://app.myfamilylink.gov.my
```

**Admin (.env)**
```bash
VITE_API_URL=https://api.myfamilylink.gov.my
VITE_APP_NAME=MyFamilyLink Admin
```

**Citizen (.env)**
```bash
VITE_API_URL=https://api.myfamilylink.gov.my
VITE_APP_NAME=MyFamilyLink
```

## Deployment Methods

### Option 1: Docker Deployment

#### Build Docker Images

```bash
# Build backend
cd apps/backend
docker build -t myfamilylink-backend:latest .

# Build admin
cd ../admin
docker build -t myfamilylink-admin:latest .

# Build citizen
cd ../citizen
docker build -t myfamilylink-citizen:latest .
```

#### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: myfamilylink
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  backend:
    image: myfamilylink-backend:latest
    environment:
      DATABASE_URL: postgresql://admin:${DB_PASSWORD}@postgres:5432/myfamilylink
      REDIS_URL: redis://redis:6379
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis

  admin:
    image: myfamilylink-admin:latest
    ports:
      - "5173:80"

  citizen:
    image: myfamilylink-citizen:latest
    ports:
      - "5174:80"

volumes:
  postgres-data:
```

Run with:
```bash
docker-compose up -d
```

### Option 2: Cloud Deployment (AWS)

#### Backend (ECS)

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name myfamilylink-backend
```

2. **Push Image**
```bash
docker tag myfamilylink-backend:latest ${AWS_ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/myfamilylink-backend:latest
docker push ${AWS_ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/myfamilylink-backend:latest
```

3. **Create ECS Task Definition**
```json
{
  "family": "myfamilylink-backend",
  "containerDefinitions": [{
    "name": "backend",
    "image": "${ECR_IMAGE_URI}",
    "memory": 512,
    "cpu": 256,
    "essential": true,
    "portMappings": [{
      "containerPort": 3000,
      "protocol": "tcp"
    }],
    "environment": [
      {"name": "NODE_ENV", "value": "production"}
    ]
  }]
}
```

#### Frontend (S3 + CloudFront)

1. **Build Frontend**
```bash
cd apps/admin
npm run build

cd ../citizen
npm run build
```

2. **Upload to S3**
```bash
aws s3 sync apps/admin/dist s3://myfamilylink-admin-bucket
aws s3 sync apps/citizen/dist s3://myfamilylink-citizen-bucket
```

3. **Configure CloudFront**
- Create distribution pointing to S3 bucket
- Add custom domain
- Enable HTTPS with ACM certificate

### Option 3: Traditional Server Deployment

#### Backend Setup

```bash
# Install dependencies
cd apps/backend
npm install --production

# Build
npm run build

# Run with PM2
pm2 start dist/index.js --name myfamilylink-backend

# Setup PM2 startup
pm2 startup
pm2 save
```

#### Frontend Setup with Nginx

```nginx
# Admin
server {
    listen 443 ssl http2;
    server_name admin.myfamilylink.gov.my;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/myfamilylink-admin;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Citizen
server {
    listen 443 ssl http2;
    server_name app.myfamilylink.gov.my;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/myfamilylink-citizen;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API
server {
    listen 443 ssl http2;
    server_name api.myfamilylink.gov.my;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Migration

```bash
cd apps/backend

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

## SSL/TLS Setup

### Let's Encrypt (Certbot)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d admin.myfamilylink.gov.my
sudo certbot --nginx -d app.myfamilylink.gov.my
sudo certbot --nginx -d api.myfamilylink.gov.my

# Auto-renewal
sudo certbot renew --dry-run
```

## Monitoring Setup

### PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### Health Checks

```bash
# Check backend health
curl https://api.myfamilylink.gov.my/health

# Expected response
{"status":"ok","timestamp":"2025-12-25T00:00:00.000Z"}
```

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U admin myfamilylink > backup_$DATE.sql
gzip backup_$DATE.sql

# Upload to S3
aws s3 cp backup_$DATE.sql.gz s3://myfamilylink-backups/
```

### Application Backups

```bash
# Backup uploads and logs
tar -czf uploads_backup.tar.gz apps/backend/uploads
tar -czf logs_backup.tar.gz apps/backend/logs
```

## Rollback Procedure

1. **Backend Rollback**
```bash
pm2 stop myfamilylink-backend
git checkout <previous-commit>
npm run build
pm2 restart myfamilylink-backend
```

2. **Frontend Rollback**
```bash
# Restore from S3 previous version
aws s3 sync s3://myfamilylink-admin-backup/version-X/ s3://myfamilylink-admin-bucket/
```

3. **Database Rollback**
```bash
# Restore from backup
psql -h localhost -U admin myfamilylink < backup_YYYYMMDD.sql
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Firewall rules configured
- [ ] Backups scheduled
- [ ] Monitoring enabled
- [ ] Rate limiting configured
- [ ] CORS policy set
- [ ] Error tracking setup
- [ ] Load balancer configured
- [ ] CDN configured
- [ ] DNS records updated
- [ ] Health checks passing

## Troubleshooting

### Backend not starting
```bash
# Check logs
pm2 logs myfamilylink-backend

# Check environment
pm2 env 0

# Restart
pm2 restart myfamilylink-backend
```

### Database connection issues
```bash
# Test connection
psql -h host -U user -d database

# Check credentials in .env
cat .env | grep DATABASE_URL
```

### High memory usage
```bash
# Check PM2 status
pm2 status

# Restart with increased memory
pm2 restart myfamilylink-backend --max-memory-restart 500M
```

## Support

For deployment issues, contact the DevOps team or check internal documentation.
