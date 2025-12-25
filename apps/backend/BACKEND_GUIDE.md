# MyFamilyLink Backend - Privacy-Preserving Aid Distribution Engine

## 🚀 Overview

This backend implements a **Zero-Knowledge Proof simulation** for privacy-preserving government aid distribution in Malaysia. Citizens can verify eligibility and receive aid without exposing sensitive income data during the transaction.

## 🏗️ Architecture

- **Framework**: Express.js with TypeScript
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Pattern**: Controller-Model architecture
- **Privacy Layer**: Session token-based verification (ZK-proof simulation)

## 🔐 Privacy-Preserving Flow

### Step 1: Verify Eligibility
```http
POST /api/citizen/verify
Body: { "mykadNumber": "900101145000" }
Response: { 
  "zkProofToken": "abc123...",
  "isEligible": true,
  "fullName": "Ali bin Abdullah"
  // Note: Income NOT exposed
}
```

### Step 2: Submit Application
```http
POST /api/citizen/submit
Body: { 
  "zkProofToken": "abc123...",
  "programName": "STR",
  "accountDetails": { "bankName": "Maybank", "accountNumber": "123..." }
}
Response: {
  "status": "Disbursed",  // Auto-approved if eligible
  "secretCode": "STR-1234567890-ABCD",
  "amount": 100
}
```

## 📊 Auto-Approval Logic

Applications are **automatically approved and disbursed** if:
- `householdIncome <= 2500` AND
- `aidAmount <= 500`

Otherwise, they go to `Pending` status for manual admin review.

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
cd apps/backend
npm install
```

### 2. Seed Database
Populate with 3 demo personas:
```bash
npm run seed
```

**Demo Personas:**
- **Ali (B40)**: MyKad `900101145000` - Income RM1,500 ✅ Auto-Approve
- **Chong (M40)**: MyKad `950505106000` - Income RM4,500 ⚠️ Manual Review
- **Subra (T20)**: MyKad `881212147000` - Income RM15,000 ❌ Not Eligible

### 3. Start Development Server
```bash
npm run dev
```

Server runs on: `http://localhost:3000`

## 📡 API Endpoints

### Citizen Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/citizen/verify` | Verify MyKad & get zkProofToken |
| POST | `/api/citizen/submit` | Submit application with token |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/applications` | Get all applications |
| GET | `/api/admin/application/:id` | Get single application |
| PATCH | `/api/admin/application/:id/approve` | Approve & disburse |
| PATCH | `/api/admin/application/:id/reject` | Reject application |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

## 🧪 Testing the Flow

### Test Auto-Approval (Ali - B40)
```bash
# Step 1: Verify
curl -X POST http://localhost:3000/api/citizen/verify \
  -H "Content-Type: application/json" \
  -d '{"mykadNumber": "900101145000"}'

# Step 2: Submit (use zkProofToken from response)
curl -X POST http://localhost:3000/api/citizen/submit \
  -H "Content-Type: application/json" \
  -d '{
    "zkProofToken": "<TOKEN_FROM_STEP_1>",
    "programName": "STR",
    "accountDetails": {"bankName": "Maybank", "accountNumber": "123456"}
  }'
```

Expected: **Status = "Disbursed"** (auto-approved)

### Test Manual Review (Chong - M40)
Same flow, but with MyKad `950505106000`  
Expected: **Status = "Pending"** (requires admin approval)

## 📁 Project Structure

```
backend/src/
├── config/
│   └── db.ts                 # MongoDB connection
├── models/
│   ├── Citizen.ts            # Citizen schema
│   └── Application.ts        # Application schema
├── controllers/
│   ├── citizen.controller.ts # Citizen verification & submission
│   └── admin.controller.ts   # Admin approval logic
├── routes/
│   └── api.routes.ts         # API route definitions
├── seed/
│   └── seed.ts               # Database seeding script
└── index.ts                  # Express app entry point
```

## 🔒 Security Features

1. **No Income Exposure**: MyKad verification returns only eligibility status, not income data
2. **One-Time Tokens**: Session tokens are cleared after use
3. **Token-Based Submission**: Applications use zkProofToken, not MyKad
4. **CORS Protection**: Only allows localhost:5173 (citizen) and localhost:5174 (admin)

## 🎯 Mock Bank Transfer

When an application is disbursed, the console shows:
```
🏦 ════════════════════════════════════════════════════════
💰 MOCK BANK TRANSFER INITIATED
════════════════════════════════════════════════════════
📋 Reference Code: STR-1735123456-ABCD1234
👤 Recipient: Ali bin Abdullah
💵 Amount: RM 100.00
🏦 Bank: Maybank
🔢 Account: 123456
⏰ Timestamp: 2025-12-25T10:30:45.000Z
✅ Status: TRANSFER SUCCESSFUL (SIMULATED)
════════════════════════════════════════════════════════
```

## 🚨 Troubleshooting

### MongoDB Connection Error
- Verify MongoDB Atlas URI is correct
- Check network connectivity
- Ensure IP whitelist includes your IP (or use 0.0.0.0/0 for development)

### Port Already in Use
```bash
# Change PORT in index.ts or use environment variable
PORT=3001 npm run dev
```

## 📦 Dependencies

### Core
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - CORS middleware
- `typescript` - Type safety

### Development
- `tsx` - TypeScript execution
- `@types/*` - TypeScript definitions

## 🎓 Hackathon Demo Flow

1. **Start Backend**: `npm run dev` in `apps/backend`
2. **Seed Database**: `npm run seed` (if not done)
3. **Demo Scenario A (Auto-Approve)**:
   - Use Ali's MyKad: `900101145000`
   - Show token generation (Step 1)
   - Show auto-disbursement (Step 2)
4. **Demo Scenario B (Manual Review)**:
   - Use Chong's MyKad: `950505106000`
   - Show pending status
   - Switch to admin panel
   - Show manual approval

## 📝 License

MIT - Built for MyFamilyLink Hackathon Project

---

**Built with ❤️ for transparent, privacy-preserving governance in Malaysia**
