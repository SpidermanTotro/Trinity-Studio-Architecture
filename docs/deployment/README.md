# Deployment Guide

This guide covers deploying Trinity Studio Architecture in various environments.

## Deployment Options

1. **Development** - Local machine, single server
2. **Staging** - Testing environment
3. **Production** - Live server for players
4. **Docker** - Containerized deployment
5. **Cloud** - AWS, Azure, or GCP

## Development Deployment

### Local Setup

```bash
# Install dependencies
npm install

# Configure
cp config/default.example.json config/default.json
# Edit config/default.json

# Initialize database
npm run db:init

# Start server
npm start
```

## Production Deployment

### System Requirements

**Minimum**:
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB
- OS: Ubuntu 20.04 LTS or later

**Recommended**:
- CPU: 4+ cores
- RAM: 16GB+
- Storage: 100GB+ SSD
- OS: Ubuntu 22.04 LTS

### Ubuntu/Debian Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Secure MySQL
sudo mysql_secure_installation

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone repository
git clone https://github.com/SpidermanTotro/Trinity-Studio-Architecture.git
cd Trinity-Studio-Architecture

# Install dependencies
npm install --production

# Configure
cp config/default.example.json config/default.json
# Edit configuration

# Initialize database
npm run db:init

# Start with PM2
pm2 start src/core/index.js --name trinity-studio
pm2 save
pm2 startup
```

### Environment Variables

Create `.env` file:

```bash
NODE_ENV=production
PORT=8085
DB_HOST=localhost
DB_USER=trinity
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-secret-key
```

### Firewall Configuration

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow Trinity Studio
sudo ufw allow 8085/tcp

# Allow AI Debugger (optional)
sudo ufw allow 8086/tcp

# Enable firewall
sudo ufw enable
```

### Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Configure
sudo nano /etc/nginx/sites-available/trinity-studio
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8085;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/trinity-studio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL/TLS with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose ports
EXPOSE 8085 8086

# Start application
CMD ["node", "src/core/index.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  trinity-studio:
    build: .
    ports:
      - "8085:8085"
      - "8086:8086"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_USER=trinity
      - DB_PASSWORD=trinity
    depends_on:
      - mysql
    volumes:
      - ./config:/app/config
      - ./logs:/app/logs
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=trinity_auth
      - MYSQL_USER=trinity
      - MYSQL_PASSWORD=trinity
    volumes:
      - mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"
    restart: unless-stopped

volumes:
  mysql-data:
```

### Running with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

## Cloud Deployment

### AWS EC2

```bash
# Launch EC2 instance (Ubuntu 22.04)
# t3.medium or larger recommended

# Connect via SSH
ssh -i your-key.pem ubuntu@your-instance-ip

# Follow production deployment steps above

# Configure security group
# - Allow port 8085 (Trinity Studio)
# - Allow port 22 (SSH)
```

### AWS RDS (Database)

```bash
# Create RDS MySQL instance
# Update config/default.json with RDS endpoint
{
  "database": {
    "host": "your-rds-endpoint.rds.amazonaws.com",
    "port": 3306,
    "user": "admin",
    "password": "your-password"
  }
}
```

### DigitalOcean Droplet

```bash
# Create droplet (Ubuntu 22.04)
# Choose $20/month plan or higher

# Follow production deployment steps

# Add managed database (optional)
# Update configuration with database credentials
```

## Database Optimization

### MySQL Configuration

Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:

```ini
[mysqld]
# Performance Schema
performance_schema = ON

# InnoDB Settings
innodb_buffer_pool_size = 2G
innodb_log_file_size = 512M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# Query Cache (if MySQL < 8.0)
query_cache_size = 256M
query_cache_type = 1

# Connection Settings
max_connections = 200
wait_timeout = 300
```

Restart MySQL:
```bash
sudo systemctl restart mysql
```

## Monitoring

### PM2 Monitoring

```bash
# View status
pm2 status

# View logs
pm2 logs trinity-studio

# Monitor resources
pm2 monit

# Restart
pm2 restart trinity-studio
```

### System Monitoring

Install monitoring tools:

```bash
# Install htop
sudo apt install -y htop

# Install monitoring agent (example: DataDog)
DD_API_KEY=your-api-key bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script.sh)"
```

## Backup Strategy

### Automated Backups

Create backup script `backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup databases
mysqldump -u trinity -p trinity_auth > $BACKUP_DIR/auth_$DATE.sql
mysqldump -u trinity -p trinity_characters > $BACKUP_DIR/characters_$DATE.sql
mysqldump -u trinity -p trinity_world > $BACKUP_DIR/world_$DATE.sql

# Compress
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/*.sql

# Remove old backups (keep 30 days)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete
```

Schedule with cron:
```bash
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

## Scaling

### Horizontal Scaling

Use load balancer with multiple servers:

```nginx
upstream trinity_backend {
    server server1.example.com:8085;
    server server2.example.com:8085;
    server server3.example.com:8085;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://trinity_backend;
    }
}
```

### Database Replication

Set up MySQL master-slave replication:

**Master Configuration** (`/etc/mysql/mysql.conf.d/mysqld.cnf`):
```ini
server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
binlog_do_db = trinity_auth
binlog_do_db = trinity_characters
binlog_do_db = trinity_world
```

**Slave Configuration**:
```ini
server-id = 2
relay-log = /var/log/mysql/mysql-relay-bin.log
log_bin = /var/log/mysql/mysql-bin.log
```

## Health Checks

Create health check endpoint (already included):

```bash
# Check server health
curl http://localhost:8085/health

# Expected response
{
  "status": "healthy",
  "uptime": 3600,
  "version": "1.0.0"
}
```

## Troubleshooting

### Server won't start

```bash
# Check logs
pm2 logs trinity-studio

# Check port availability
sudo netstat -tulpn | grep 8085

# Check permissions
ls -la /path/to/trinity-studio
```

### High memory usage

```bash
# Check Node.js memory
pm2 show trinity-studio

# Restart if needed
pm2 restart trinity-studio

# Set memory limit
pm2 start src/core/index.js --max-memory-restart 2G
```

### Database connection issues

```bash
# Test connection
mysql -h localhost -u trinity -p

# Check MySQL status
sudo systemctl status mysql

# View MySQL logs
sudo tail -f /var/log/mysql/error.log
```

## Security Hardening

### Application Security

1. Change default passwords
2. Use strong JWT secrets
3. Enable rate limiting
4. Keep dependencies updated
5. Use HTTPS only

### Server Security

```bash
# Install fail2ban
sudo apt install -y fail2ban

# Configure firewall
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8085/tcp

# Disable root SSH
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

## Maintenance

### Regular Updates

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Restart
pm2 restart trinity-studio
```

### Database Maintenance

```bash
# Optimize tables
mysqlcheck -u trinity -p --optimize trinity_world

# Analyze tables
mysqlcheck -u trinity -p --analyze trinity_world
```

## Performance Tuning

### Node.js Optimization

```bash
# Start with performance settings
NODE_ENV=production node --max-old-space-size=4096 src/core/index.js
```

### Enable Clustering

Update `config/default.json`:
```json
{
  "performance": {
    "clustering": true,
    "workers": 4
  }
}
```

## Support

For deployment issues:
- Check [Troubleshooting Guide](troubleshooting.md)
- Review logs in `logs/` directory
- Open GitHub issue
- Join Discord community

---

**Last Updated**: 2024-12-09
