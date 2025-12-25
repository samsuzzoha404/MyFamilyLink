# Backend API

MyFamilyLink Backend API with Zero-Knowledge Proofs and MyKad NFC verification.

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp ../../.env.example .env
```

### Development

```bash
npm run dev
```

Server will start on http://localhost:3000

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh token

### Applications
- `POST /api/v1/applications` - Create application
- `GET /api/v1/applications` - List applications
- `GET /api/v1/applications/:id` - Get application by ID
- `PATCH /api/v1/applications/:id` - Update application

### Disbursements (Admin only)
- `POST /api/v1/disbursements/batches` - Create batch
- `GET /api/v1/disbursements/batches` - List batches
- `GET /api/v1/disbursements/batches/:id` - Get batch
- `POST /api/v1/disbursements/batches/:id/execute` - Execute batch

### Admin
- `GET /api/v1/admin/dashboard/stats` - Dashboard statistics
- `GET /api/v1/admin/applications/pending` - Pending applications
- `GET /api/v1/admin/audit-logs` - Audit logs
- `GET /api/v1/admin/settings` - System settings
- `PATCH /api/v1/admin/settings` - Update settings

### ZK Proofs
- `POST /api/v1/zkproof/generate` - Generate proof
- `POST /api/v1/zkproof/verify` - Verify proof
- `GET /api/v1/zkproof/eligibility/:userId` - Check eligibility

## Tech Stack

- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Prisma ORM)
- **Cache:** Redis
- **Authentication:** JWT
- **Logging:** Winston
- **Security:** Helmet, CORS
