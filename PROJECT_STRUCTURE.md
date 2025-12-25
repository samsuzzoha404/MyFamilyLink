# MyFamilyLink - Project Structure

This document provides a complete overview of the project structure and organization.

## 📁 Directory Structure

```
myfamilylink/
├── apps/                          # Application packages
│   ├── admin/                     # Admin dashboard (React + Vite)
│   │   ├── public/               # Static assets
│   │   ├── src/
│   │   │   ├── components/       # React components
│   │   │   │   ├── dashboard/   # Dashboard components
│   │   │   │   ├── layout/      # Layout components
│   │   │   │   └── ui/          # Shadcn/ui components
│   │   │   ├── contexts/        # React contexts
│   │   │   ├── data/            # Mock data
│   │   │   ├── hooks/           # Custom hooks
│   │   │   ├── lib/             # Utilities
│   │   │   ├── pages/           # Page components
│   │   │   ├── App.tsx          # Main app component
│   │   │   └── main.tsx         # Entry point
│   │   ├── .env.example         # Environment template
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   ├── citizen/                   # Citizen portal (React + Vite)
│   │   ├── public/               # Static assets
│   │   ├── src/
│   │   │   ├── components/       # React components
│   │   │   │   └── ui/          # Shadcn/ui components
│   │   │   ├── contexts/        # React contexts
│   │   │   ├── hooks/           # Custom hooks
│   │   │   ├── lib/             # Utilities
│   │   │   ├── pages/           # Page components
│   │   │   ├── App.tsx          # Main app component
│   │   │   └── main.tsx         # Entry point
│   │   ├── .env.example         # Environment template
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── backend/                   # API server (Express + TypeScript)
│       ├── src/
│       │   ├── config/           # Configuration files
│       │   │   └── config.ts
│       │   ├── middleware/       # Express middleware
│       │   │   ├── auth.ts
│       │   │   └── errorHandler.ts
│       │   ├── routes/           # API routes
│       │   │   ├── admin.routes.ts
│       │   │   ├── application.routes.ts
│       │   │   ├── auth.routes.ts
│       │   │   ├── disbursement.routes.ts
│       │   │   └── zkproof.routes.ts
│       │   ├── utils/            # Utility functions
│       │   │   └── logger.ts
│       │   └── index.ts          # Entry point
│       ├── .env.example          # Environment template
│       ├── .gitignore
│       ├── package.json
│       ├── README.md
│       └── tsconfig.json
│
├── packages/                      # Shared packages
│   └── shared/                    # Shared types and utilities
│       ├── src/
│       │   ├── constants.ts      # Shared constants
│       │   ├── index.ts          # Main export
│       │   ├── types.ts          # TypeScript types
│       │   ├── utils.ts          # Utility functions
│       │   └── validators.ts     # Zod validation schemas
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                          # Documentation
│   ├── api/                       # API documentation
│   │   └── README.md
│   ├── architecture/              # Architecture docs
│   │   └── ARCHITECTURE.md
│   ├── deployment/                # Deployment guides
│   │   └── DEPLOYMENT.md
│   ├── development/               # Development guides
│   │   └── SETUP.md
│   └── README.md
│
├── scripts/                       # Utility scripts
│   ├── backup-db.sh              # Database backup
│   ├── build-all.js              # Build all apps
│   ├── deploy.sh                 # Deployment script
│   ├── setup-dev.js              # Development setup
│   └── README.md
│
├── assets/                        # Project assets
│   └── screenshots/               # Screenshots and images
│       ├── Admin.png
│       ├── Distribution.png
│       ├── Eligibility.png
│       ├── Family.png
│       ├── Flowchart.png
│       └── MyKad.png
│
├── .editorconfig                  # Editor configuration
├── .env.example                   # Root environment template
├── .gitignore                     # Git ignore rules
├── .prettierrc                    # Prettier configuration
├── package.json                   # Root package.json (workspaces)
├── PROJECT_STRUCTURE.md           # This file
└── README.md                      # Project documentation
```

## 📦 Workspace Configuration

The project uses **npm workspaces** for monorepo management.

### Workspaces

- `apps/admin` - Admin dashboard
- `apps/citizen` - Citizen portal
- `apps/backend` - Backend API server
- `packages/shared` - Shared utilities and types

### Workspace Commands

```bash
# Install all dependencies
npm install

# Run in specific workspace
npm run dev --workspace=apps/admin

# Run in all workspaces
npm run build --workspaces
```

## 🏗️ Architecture Overview

### Frontend Apps (Admin & Citizen)

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling
- Shadcn/ui + Radix UI for components
- Tailwind CSS for styling
- React Router for routing
- React Context for state management

**Key Features:**
- Component-based architecture
- Type-safe development
- Hot module replacement (HMR)
- Optimized production builds
- Code splitting

### Backend API

**Technology Stack:**
- Node.js 18+ with TypeScript
- Express.js framework
- PostgreSQL with Prisma ORM
- Redis for caching
- JWT for authentication
- Winston for logging

**Key Features:**
- RESTful API design
- Type-safe development
- Middleware architecture
- Error handling
- Request validation
- Rate limiting

### Shared Package

**Purpose:**
- Share TypeScript types across apps
- Common utility functions
- Validation schemas (Zod)
- Constants and enums

**Benefits:**
- Single source of truth
- Type safety across apps
- Reduced code duplication
- Easier maintenance

## 🔧 Configuration Files

### Root Level

| File | Purpose |
|------|---------|
| `.editorconfig` | Editor settings for consistent formatting |
| `.prettierrc` | Code formatting rules |
| `.gitignore` | Files to ignore in Git |
| `.env.example` | Environment variable template |
| `package.json` | Root package with workspace configuration |

### App Level

Each app has:
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - App-specific ignore rules
- `.env.example` - Environment template
- `README.md` - App documentation

## 📝 Key Files

### Entry Points

- **Admin**: `apps/admin/src/main.tsx`
- **Citizen**: `apps/citizen/src/main.tsx`
- **Backend**: `apps/backend/src/index.ts`
- **Shared**: `packages/shared/src/index.ts`

### Configuration

- **Vite Config**: `vite.config.ts` (Frontend apps)
- **TypeScript Config**: `tsconfig.json` (All apps)
- **Backend Config**: `apps/backend/src/config/config.ts`

## 🚀 Development Workflow

### 1. Initial Setup

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

### 2. Development

```bash
# Start all apps
npm run dev

# Or start individually
npm run dev:admin
npm run dev:citizen
npm run dev:backend
```

### 3. Building

```bash
# Build all apps
npm run build

# Or build individually
npm run build:admin
npm run build:citizen
npm run build:backend
```

### 4. Testing

```bash
# Run tests
npm run test --workspaces
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](README.md) | Project overview and features |
| [docs/api/README.md](docs/api/README.md) | API documentation |
| [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) | System architecture |
| [docs/deployment/DEPLOYMENT.md](docs/deployment/DEPLOYMENT.md) | Deployment guide |
| [docs/development/SETUP.md](docs/development/SETUP.md) | Development setup |
| [scripts/README.md](scripts/README.md) | Script documentation |

## 🔐 Environment Variables

### Backend (.env)
- Database connection
- Redis connection
- JWT secrets
- API keys
- External service URLs

### Frontend (.env)
- API URL
- Feature flags
- Analytics keys

See `.env.example` files in each app for complete lists.

## 🗄️ Data Flow

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│  Admin   │──────▶│   API    │◀──────│ Citizen  │
│Dashboard │       │  Server  │       │  Portal  │
└──────────┘       └─────┬────┘       └──────────┘
                         │
                    ┌────▼────┐
                    │Database │
                    │  Cache  │
                    └─────────┘
```

## 📦 Dependencies

### Shared Dependencies
- TypeScript 5.3+
- React 18
- Zod for validation

### Admin/Citizen Specific
- Vite
- Tailwind CSS
- Shadcn/ui
- React Router
- Radix UI

### Backend Specific
- Express
- Prisma
- JWT
- Winston
- Helmet

## 🔄 Version Control

### Git Workflow
1. Feature branches: `feature/feature-name`
2. Bug fixes: `fix/bug-name`
3. Pull requests to `main`
4. Protected main branch

### Commit Convention
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Build/tools

## 🚢 Deployment

### Frontend (Static Hosting)
- Admin: `apps/admin/dist/`
- Citizen: `apps/citizen/dist/`

Deploy to: Vercel, Netlify, S3, CloudFront

### Backend (Server/Container)
- Backend: `apps/backend/dist/`

Deploy to: AWS ECS, Azure AKS, VPS with PM2

### Database
- PostgreSQL on AWS RDS, Azure Database, or managed service
- Redis on ElastiCache, Azure Cache, or managed service

## 📈 Monitoring

- Application logs: Winston
- Error tracking: Structured logging
- Health checks: `/health` endpoint
- Performance: Response time tracking

## 🔒 Security

- Environment variables for secrets
- JWT authentication
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

## 🤝 Contributing

1. Follow the project structure
2. Use TypeScript
3. Write tests
4. Update documentation
5. Follow commit conventions
6. Create pull requests

## 📞 Support

For questions or issues:
1. Check documentation
2. Review architecture docs
3. Contact development team
4. Create GitHub issue
