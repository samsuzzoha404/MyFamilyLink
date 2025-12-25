# API Documentation

MyFamilyLink REST API v1.0

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://api.myfamilylink.gov.my/api/v1
```

## Authentication

All API requests require authentication using JWT tokens in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "icNumber": "990101-01-1234"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "citizen"
    }
  }
}
```

### Applications

#### Create Application
```http
POST /applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "programType": "STR",
  "icNumber": "990101-01-1234",
  "monthlyIncome": 2000,
  "familySize": 4,
  "dependents": 2
}
```

#### List Applications
```http
GET /applications?page=1&pageSize=20&status=SUBMITTED
Authorization: Bearer <token>
```

#### Get Application Details
```http
GET /applications/{id}
Authorization: Bearer <token>
```

### Zero-Knowledge Proofs

#### Generate Proof
```http
POST /zkproof/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "applicationId": "uuid",
  "privateData": {
    "income": 2000,
    "familySize": 4
  }
}
```

#### Verify Proof
```http
POST /zkproof/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "proof": "...",
  "publicSignals": ["..."],
  "verificationKey": "..."
}
```

### Admin Endpoints

#### Dashboard Statistics
```http
GET /admin/dashboard/stats
Authorization: Bearer <admin-token>
```

Response:
```json
{
  "success": true,
  "data": {
    "totalApplications": 1500,
    "pendingApplications": 245,
    "approvedApplications": 1100,
    "totalDisbursed": 4500000,
    "avgProcessingTime": "2.5 days"
  }
}
```

#### Pending Applications
```http
GET /admin/applications/pending?page=1&pageSize=20
Authorization: Bearer <admin-token>
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

### Error Codes

- `UNAUTHORIZED` - 401: Authentication required
- `FORBIDDEN` - 403: Insufficient permissions
- `NOT_FOUND` - 404: Resource not found
- `VALIDATION_ERROR` - 400: Input validation failed
- `DUPLICATE_APPLICATION` - 409: Application already exists
- `INELIGIBLE` - 422: User not eligible for program
- `INTERNAL_ERROR` - 500: Server error

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## Pagination

List endpoints support pagination:

Query parameters:
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 20, max: 100)

Response format:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 1500,
    "page": 1,
    "pageSize": 20,
    "totalPages": 75
  }
}
```
