# Deployment Guide

## Overview

This guide covers deploying the Trinity Studio Architecture to various environments and platforms.

## Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (for K8s deployment)
- Cloud provider account (AWS, Azure, GCP)
- CI/CD pipeline (GitHub Actions, GitLab CI, Jenkins)

## Environment Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Application
NODE_ENV=production
PORT=3000
APP_NAME=Trinity Studio Architecture

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trinity_prod
DB_USER=postgres
DB_PASSWORD=secure_password

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Security
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=24h

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASSWORD=smtp_password

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=https://your-sentry-dsn
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=trinity_prod
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Build and Run

```bash
# Build Docker image
docker build -t trinity-studio-architecture .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Kubernetes Deployment

### Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: trinity-app
  labels:
    app: trinity
spec:
  replicas: 3
  selector:
    matchLabels:
      app: trinity
  template:
    metadata:
      labels:
        app: trinity
    spec:
      containers:
      - name: trinity
        image: trinity-studio-architecture:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: trinity-secrets
              key: db-host
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: trinity-service
spec:
  selector:
    app: trinity
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

### Apply Configuration

```bash
# Create secrets
kubectl create secret generic trinity-secrets \
  --from-literal=db-host=postgres \
  --from-literal=db-password=secure_password \
  --from-literal=jwt-secret=your_jwt_secret

# Apply deployment
kubectl apply -f k8s/deployment.yaml

# Check status
kubectl get pods
kubectl get services

# View logs
kubectl logs -f deployment/trinity-app

# Scale deployment
kubectl scale deployment trinity-app --replicas=5
```

## Cloud Deployments

### AWS Elastic Beanstalk

```bash
# Initialize EB
eb init -p node.js-18 trinity-studio-architecture

# Create environment
eb create production

# Deploy
eb deploy

# Open in browser
eb open
```

### Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/trinity-studio-architecture

# Deploy to Cloud Run
gcloud run deploy trinity-studio-architecture \
  --image gcr.io/PROJECT_ID/trinity-studio-architecture \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure App Service

```bash
# Login to Azure
az login

# Create resource group
az group create --name trinity-rg --location eastus

# Create app service plan
az appservice plan create --name trinity-plan \
  --resource-group trinity-rg --sku B1 --is-linux

# Create web app
az webapp create --resource-group trinity-rg \
  --plan trinity-plan --name trinity-studio-architecture \
  --runtime "NODE|18-lts"

# Deploy
az webapp deployment source config-zip \
  --resource-group trinity-rg \
  --name trinity-studio-architecture \
  --src deploy.zip
```

## CI/CD Pipeline

### GitHub Actions

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
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Build Docker image
      run: docker build -t trinity-studio-architecture .
    
    - name: Push to registry
      run: |
        docker tag trinity-studio-architecture registry/trinity-studio-architecture:latest
        docker push registry/trinity-studio-architecture:latest
    
    - name: Deploy to production
      run: |
        # Add deployment commands here
```

## Monitoring and Logging

### Health Check Endpoint

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

### Logging Setup

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

## Database Migrations

```bash
# Run migrations
npm run migrate

# Rollback migrations
npm run migrate:rollback

# Seed database
npm run seed
```

## SSL/TLS Configuration

### Nginx SSL Configuration

```nginx
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Backup and Recovery

### Database Backup

```bash
# Backup PostgreSQL
pg_dump -h localhost -U postgres trinity_prod > backup.sql

# Restore PostgreSQL
psql -h localhost -U postgres trinity_prod < backup.sql
```

### Automated Backups

```bash
#!/bin/bash
BACKUP_DIR=/backups
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > $BACKUP_DIR/backup_$DATE.sql
# Upload to S3 or other storage
aws s3 cp $BACKUP_DIR/backup_$DATE.sql s3://trinity-backups/
```

## Performance Optimization

1. Enable gzip compression
2. Use CDN for static assets
3. Implement caching strategy
4. Optimize database queries
5. Use connection pooling
6. Enable HTTP/2
7. Minify and bundle assets
8. Use lazy loading

## Security Checklist

- [ ] Use HTTPS/TLS
- [ ] Set secure headers
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Validate all inputs
- [ ] Keep dependencies updated
- [ ] Use security scanning tools
- [ ] Implement logging and monitoring
- [ ] Regular backups

## Troubleshooting

### Common Issues

1. **Connection refused**: Check if service is running
2. **Database errors**: Verify connection settings
3. **Memory issues**: Increase container limits
4. **Slow performance**: Check database indexes and queries
5. **SSL errors**: Verify certificate validity

### Debug Mode

```bash
# Enable debug logging
NODE_ENV=development DEBUG=* npm start
```

## Rollback Strategy

1. Keep previous versions tagged
2. Use blue-green deployment
3. Implement canary releases
4. Monitor metrics after deployment
5. Have rollback scripts ready

```bash
# Rollback to previous version
kubectl rollout undo deployment/trinity-app
```

## Post-Deployment

1. Verify health endpoints
2. Check logs for errors
3. Monitor performance metrics
4. Test critical user flows
5. Update documentation
6. Notify stakeholders
