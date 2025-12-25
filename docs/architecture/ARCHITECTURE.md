# System Architecture

MyFamilyLink - Privacy-Preserving Aid Distribution System

## Overview

MyFamilyLink is a modern, privacy-first aid distribution system built with a microservices-inspired architecture, leveraging Zero-Knowledge Proofs for eligibility verification.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
├──────────────────────┬──────────────────────────────────────┤
│   Citizen Portal     │       Admin Dashboard                │
│   (React/Vite)       │       (React/Vite)                   │
└──────────┬───────────┴──────────────┬───────────────────────┘
           │                          │
           │        HTTPS/WSS         │
           └─────────┬────────────────┘
                     │
           ┌─────────▼──────────┐
           │   API Gateway      │
           │   (Express.js)     │
           └─────────┬──────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼───┐  ┌────▼───┐  ┌────▼───┐
   │  Auth  │  │  App   │  │  ZK    │
   │Service │  │Service │  │Service │
   └────┬───┘  └────┬───┘  └────┬───┘
        │           │           │
        └───────────┼───────────┘
                    │
        ┌───────────▼──────────┐
        │   PostgreSQL + Redis │
        └──────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **API Style**: RESTful
- **Authentication**: JWT
- **Validation**: Zod

### Database & Cache
- **Primary Database**: PostgreSQL
- **ORM**: Prisma
- **Cache Layer**: Redis
- **Session Store**: Redis

### Security & Privacy
- **Zero-Knowledge Proofs**: snarkjs
- **Encryption**: bcryptjs
- **Rate Limiting**: express-rate-limit
- **Security Headers**: helmet
- **CORS**: cors

## Core Components

### 1. Authentication Service
- User registration and login
- JWT token generation and validation
- Role-based access control (RBAC)
- Session management

### 2. Application Service
- Aid application submission
- Application status tracking
- Document upload and management
- Application history

### 3. Zero-Knowledge Proof Service
- ZK proof generation for eligibility
- Proof verification
- Privacy-preserving data validation
- Eligibility scoring without exposing income data

### 4. MyKad NFC Integration
- NFC card reading
- Identity verification
- Data extraction and validation
- Secure data transmission

### 5. Disbursement Service
- Batch processing
- Payment gateway integration
- Transaction tracking
- Reconciliation

### 6. Admin Dashboard
- Application review and approval
- Batch disbursement management
- Analytics and reporting
- System configuration
- Audit logs

## Data Flow

### Application Submission Flow

```
1. Citizen taps MyKad → NFC reader extracts data
2. Data sent to backend with ZK proof generation
3. Backend validates proof without seeing raw income
4. Application stored with encrypted sensitive data
5. Admin reviews application (sees eligibility, not raw data)
6. Upon approval, disbursement batch created
7. Payment processed and tracked
8. Citizen notified of disbursement
```

### Zero-Knowledge Proof Flow

```
┌─────────┐                  ┌─────────┐                 ┌─────────┐
│ Citizen │                  │ Backend │                 │  ZK     │
│  App    │                  │   API   │                 │ Prover  │
└────┬────┘                  └────┬────┘                 └────┬────┘
     │                            │                           │
     │ 1. Submit income data      │                           │
     ├───────────────────────────>│                           │
     │                            │ 2. Request proof gen      │
     │                            ├──────────────────────────>│
     │                            │                           │
     │                            │ 3. Generate ZK proof      │
     │                            │<──────────────────────────┤
     │                            │                           │
     │ 4. Proof + public signals  │                           │
     │<───────────────────────────┤                           │
     │                            │                           │
     │ 5. Verify eligibility      │                           │
     │   (without raw income)     │                           │
     └────────────────────────────┘                           │
```

## Security Measures

### Data Protection
- End-to-end encryption for sensitive data
- Zero-knowledge proofs for income verification
- Secure key management
- Regular security audits

### API Security
- JWT-based authentication
- Role-based access control
- Rate limiting (100 req/15min)
- Input validation with Zod
- SQL injection prevention
- XSS protection

### Infrastructure Security
- HTTPS only
- Security headers (Helmet)
- CORS policy
- Environment variable protection
- Secure session management

## Deployment Architecture

### Development
```
Local Machine
├── Admin: localhost:5173
├── Citizen: localhost:5174
├── Backend: localhost:3000
└── Database: localhost:5432
```

### Production
```
Cloud Infrastructure (AWS/Azure)
├── Load Balancer
├── Web Tier (Admin + Citizen)
│   ├── CDN (CloudFront/Azure CDN)
│   └── Static hosting (S3/Blob Storage)
├── Application Tier
│   ├── API servers (ECS/AKS)
│   └── Auto-scaling group
└── Data Tier
    ├── PostgreSQL (RDS/Azure Database)
    └── Redis (ElastiCache/Azure Cache)
```

## Performance Considerations

- **Caching**: Redis for session and frequently accessed data
- **Database Indexing**: Optimized queries with proper indexes
- **CDN**: Static assets served from edge locations
- **API Response Time**: Target < 200ms for most endpoints
- **Pagination**: Limit result sets to prevent memory issues

## Monitoring & Logging

- **Application Logs**: Winston logger
- **Error Tracking**: Structured error logging
- **Performance Metrics**: Response time tracking
- **Audit Logs**: All admin actions logged
- **Health Checks**: /health endpoint for monitoring

## Future Enhancements

1. **Mobile Apps**: Native iOS and Android applications
2. **Blockchain Integration**: Immutable audit trail
3. **AI/ML**: Fraud detection and pattern analysis
4. **Multi-language Support**: Additional languages beyond English/Malay
5. **SMS Notifications**: Real-time status updates
6. **Biometric Authentication**: Fingerprint/face recognition
