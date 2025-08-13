# Docker Setup for AskZoie User Dashboard

This project is fully dockerized with support for both production and development environments.

## Architecture

- **PostgreSQL**: Database server (port 5433)
- **NestJS Server**: Backend API (port 3000)
- **React Client**: Frontend application (port 80 in production, 5173 in development)
- **Nginx**: Web server for serving the React app in production

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Production Environment

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - Database: localhost:5433

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

### Development Environment

1. **Build and start development services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Database: localhost:5433

3. **Stop development services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## Database Setup

### First Time Setup

1. **Start the services:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Run database migrations:**
   ```bash
   docker-compose exec server npx prisma migrate dev
   ```

3. **Generate Prisma client:**
   ```bash
   docker-compose exec server npx prisma generate
   ```

### Development Database Setup

1. **Start development services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d postgres
   ```

2. **Run database migrations:**
   ```bash
   docker-compose -f docker-compose.dev.yml exec server npx prisma migrate dev
   ```

## Useful Commands

### Production

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f postgres

# Restart a specific service
docker-compose restart server

# Access server shell
docker-compose exec server sh

# Access database
docker-compose exec postgres psql -U zoie -d chatbotdb
```

### Development

```bash
# View development logs
docker-compose -f docker-compose.dev.yml logs -f

# Access development server shell
docker-compose -f docker-compose.dev.yml exec server sh

# Access development client shell
docker-compose -f docker-compose.dev.yml exec client sh
```

## Environment Variables

### Server Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)
- `FRONTEND_URL`: Frontend URL for CORS
- `NODE_ENV`: Environment (production/development)

### Client Environment Variables

- `VITE_API_URL`: Backend API URL (development only)

## Health Checks

All services include health checks:

- **PostgreSQL**: Checks database connectivity
- **Server**: Checks API health endpoint at `/health`
- **Client**: Checks nginx health endpoint at `/health`

## Volumes

- `pgdata`: PostgreSQL data persistence (production)
- `pgdata_dev`: PostgreSQL data persistence (development)

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Ensure ports 80, 3000, and 5433 are available
   - Modify ports in docker-compose files if needed

2. **Database connection issues:**
   - Wait for PostgreSQL to fully start (health check)
   - Check DATABASE_URL environment variable

3. **Build failures:**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild without cache: `docker-compose build --no-cache`

4. **Permission issues:**
   - Ensure Docker has proper permissions
   - Run with sudo if necessary (Linux/macOS)

### Logs and Debugging

```bash
# Check service status
docker-compose ps

# View detailed logs
docker-compose logs --tail=100 server

# Check container health
docker-compose exec server wget -qO- http://localhost:3000/health
```

## Production Deployment

For production deployment:

1. **Set proper environment variables**
2. **Configure reverse proxy (nginx/traefik)**
3. **Set up SSL certificates**
4. **Configure monitoring and logging**
5. **Set up database backups**

## Development Workflow

1. **Start development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Make code changes** - Hot reloading is enabled

3. **Run database migrations:**
   ```bash
   docker-compose -f docker-compose.dev.yml exec server npx prisma migrate dev
   ```

4. **Test changes** - Access at http://localhost:5173

5. **Stop development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```
