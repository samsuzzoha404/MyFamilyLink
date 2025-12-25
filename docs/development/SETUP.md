# Development Setup

Complete guide to setting up MyFamilyLink for local development.

## Prerequisites

Make sure you have the following installed:

- **Node.js** 18 or higher
- **npm** 9 or higher
- **PostgreSQL** 14 or higher
- **Redis** 6 or higher
- **Git**

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/blocknexalabs/myfamilylink.git
cd myfamilylink
```

### 2. Install Dependencies

```bash
# Install root dependencies and all workspace packages
npm install
```

This will install dependencies for all apps (admin, citizen, backend) and packages (shared).

### 3. Environment Setup

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
# Minimum required:
# - DATABASE_URL
# - REDIS_URL  
# - JWT_SECRET
```

### 4. Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker run -d \
  --name myfamilylink-postgres \
  -e POSTGRES_DB=myfamilylink \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -p 5432:5432 \
  postgres:14

# Start Redis (if using Docker)
docker run -d \
  --name myfamilylink-redis \
  -p 6379:6379 \
  redis:6-alpine

# Run database migrations
cd apps/backend
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### 5. Start Development Servers

```bash
# From root directory, start all apps
npm run dev

# Or start individually:
npm run dev:admin    # Admin dashboard on http://localhost:5173
npm run dev:citizen  # Citizen portal on http://localhost:5174
npm run dev:backend  # API server on http://localhost:3000
```

## Project Structure

```
myfamilylink/
├── apps/
│   ├── admin/          # Admin dashboard (React + Vite)
│   ├── citizen/        # Citizen portal (React + Vite)
│   └── backend/        # API server (Express + TypeScript)
├── packages/
│   └── shared/         # Shared types, utilities, validators
├── docs/               # Documentation
├── scripts/            # Build and deployment scripts
├── assets/             # Static assets and screenshots
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
├── .prettierrc         # Code formatting config
├── .editorconfig       # Editor configuration
├── package.json        # Root package with workspaces
└── README.md           # Project overview
```

## Development Workflow

### Working with Workspaces

The project uses npm workspaces for monorepo management.

```bash
# Run command in specific workspace
npm run build --workspace=apps/admin
npm run dev --workspace=apps/backend

# Run command in all workspaces
npm run build --workspaces

# Install package in specific workspace
npm install axios --workspace=apps/backend
```

### Shared Package

The `@myfamilylink/shared` package contains common code:

```typescript
// In apps/backend/src/some-file.ts
import { ApplicationStatus, formatCurrency } from '@myfamilylink/shared';

const status = ApplicationStatus.APPROVED;
const amount = formatCurrency(2500); // RM2,500.00
```

To use in workspace:
```bash
# Add to dependencies in package.json
{
  "dependencies": {
    "@myfamilylink/shared": "*"
  }
}
```

### Code Formatting

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Linting

```bash
# Lint all workspaces
npm run lint

# Lint specific workspace
npm run lint --workspace=apps/admin
```

### Building

```bash
# Build all apps
npm run build

# Build specific app
npm run build:admin
npm run build:citizen
npm run build:backend
```

## Database Management

### Prisma Commands

```bash
cd apps/backend

# Create new migration
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Database Schema

Located in `apps/backend/prisma/schema.prisma`.

After modifying schema:
```bash
npm run db:migrate
npm run db:generate
```

## Testing

```bash
# Run tests for all workspaces
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests for specific workspace
npm run test --workspace=apps/backend
```

## Debugging

### Backend Debugging

Add to VS Code `launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "skipFiles": ["<node_internals>/**"],
  "program": "${workspaceFolder}/apps/backend/src/index.ts",
  "preLaunchTask": "npm: dev:backend",
  "outFiles": ["${workspaceFolder}/apps/backend/dist/**/*.js"]
}
```

### Frontend Debugging

Use browser DevTools or React Developer Tools extension.

## Common Issues

### Port already in use

```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change port in .env
PORT=3001
```

### Database connection failed

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Test connection
psql -h localhost -U admin -d myfamilylink

# Check .env DATABASE_URL is correct
```

### Module not found errors

```bash
# Clean install
npm run clean
npm install

# Build shared package
npm run build --workspace=packages/shared
```

## Best Practices

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/tooling changes

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write descriptive variable names
- Add comments for complex logic
- Keep functions small and focused

## IDE Setup

### VS Code Extensions

Recommended extensions:
- ESLint
- Prettier
- TypeScript
- Prisma
- GitLens
- Docker

### Settings

Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express Documentation](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Getting Help

- Check [documentation](../README.md)
- Review [architecture](../architecture/ARCHITECTURE.md)
- Contact team leads
- Create GitHub issue
