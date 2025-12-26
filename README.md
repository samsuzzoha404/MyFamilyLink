# MyFamilyLink

**Privacy-preserving aid distribution platform for Malaysia**

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169e1?logo=postgresql&logoColor=white)](https://www.postgresql.org)

A government aid distribution system using Zero-Knowledge Proofs (ZKP) to verify eligibility without exposing citizen income data.

## Live Demo

**Citizen Portal:** [https://myfamilylink.vercel.app](https://myfamilylink.vercel.app)  
Test: `MyKad: 990101-01-5678` • `Password: citizen123`

**Admin Dashboard:** [https://myadmin-beige.vercel.app](https://myadmin-beige.vercel.app)  
Test: `Email: admin@myfamilylink.gov.my` • `Password: admin123`

## Overview

MyFamilyLink enables Malaysian citizens to access government assistance programs through privacy-preserving technology:

- **Instant Verification** - Check eligibility in seconds via MyKad NFC tap
- **Privacy Protection** - Zero-knowledge proofs verify eligibility without exposing income
- **Unified Platform** - Single portal for all aid programs (STR, subsidies, vouchers)
- **Automated Disbursement** - Direct bank/e-wallet transfers

### Key Benefits

**For Citizens:**
- No document submission or paperwork
- Income data never exposed
- Real-time application tracking
- One-click applications

**For Government:**
- Reduced fraud through cryptographic verification
- Lower administrative costs
- Real-time analytics and insights
- Scalable to all aid programs

## Features

### Citizen Portal
- MyKad NFC verification for instant identity confirmation
- Privacy-preserving eligibility checking with ZK proofs
- One-click application submission
- Real-time application tracking
- Disbursement history and notifications

### Admin Dashboard
- Real-time analytics and system monitoring
- Bulk application review and approval
- Batch disbursement processing
- Complete audit trail logging
- Eligibility simulator for testing

### Supported Aid Programs
- Sumbangan Tunai Rahmah (STR)
- Electricity Subsidies
- Education Assistance
- Healthcare Subsidies
- Food Vouchers
- Housing Support

## Architecture

```
┌─────────────────────────────────────┐
│   Citizen Portal + Admin Dashboard  │
│   React 18 • TypeScript • Vite      │
└──────────────┬──────────────────────┘
               │ REST API
┌──────────────▼──────────────────────┐
│   Backend API Server                │
│   Express • JWT Auth • ZKP Service  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   PostgreSQL + Prisma • Redis       │
└─────────────────────────────────────┘
```

### Tech Stack

**Frontend:** React 18 • TypeScript • Vite • Tailwind CSS • shadcn/ui  
**Backend:** Node.js • Express • TypeScript • JWT Authentication  
**Database:** PostgreSQL 15 • Prisma ORM • Redis Cache  
**Deployment:** Vercel

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15
- npm or bun

### Installation

```bash
# Clone repository
git clone https://github.com/blocknexalabs/myfamilylink.git
cd myfamilylink

# Install dependencies
npm install

# Setup database
cd apps/backend
npx prisma migrate dev
npx prisma db seed

# Start all services
cd ../..
npm run dev
```

Access the applications:
- Citizen Portal: `http://localhost:5173`
- Admin Dashboard: `http://localhost:5174`
- Backend API: `http://localhost:3000`

## Project Structure

```
MyFamilyLink/
├── apps/
│   ├── admin/          # Admin dashboard
│   ├── citizen/        # Citizen portal
│   └── backend/        # API server
├── packages/shared/    # Shared types & utilities
├── docs/              # Documentation
└── scripts/           # Build & deployment scripts
```

## Documentation

- [Setup Guide](docs/development/SETUP.md) - Detailed installation
- [Architecture](docs/architecture/ARCHITECTURE.md) - System design
- [API Reference](docs/api/README.md) - Complete API docs
- [ZKP Implementation](apps/backend/ZKP_ARCHITECTURE.md) - Privacy-preserving verification

## Security & Privacy

### Zero-Knowledge Proof Implementation

```typescript
// Traditional: Income exposed
{ income: 1500, threshold: 2500, isEligible: true }

// MyFamilyLink: Privacy preserved
{ zkProofToken: "a3520...", isEligible: true }
```

- **Completeness**: Eligible citizens always get approved
- **Soundness**: Ineligible citizens cannot fake eligibility
- **Zero-Knowledge**: Verifiers learn ONLY eligibility status, not income

### Security Features
- JWT authentication with short-lived access tokens
- Rate limiting (100 req/15min per IP)
- SQL injection prevention via Prisma
- Input validation with Zod schemas
- Complete audit trail logging
- AES-256 encryption at rest

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details

---

**Built for GodamLah2.0 Hackathon by BlockNexa Labs**
