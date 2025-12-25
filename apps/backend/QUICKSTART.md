# 🚀 Quick Start Guide - MyFamilyLink Backend

## Prerequisites
✅ Node.js installed  
✅ MongoDB Atlas account (already configured)  
✅ Terminal access

## Setup (First Time Only)

### 1. Install Dependencies
```bash
cd Y:\GodamLah2.0\MyFamilyLink\apps\backend
npm install
```

### 2. Seed Database
```bash
npm run seed
```

This creates 3 demo users:
- Ali (B40): `900101145000` - Auto-approves
- Chong (M40): `950505106000` - Needs manual review
- Subra (T20): `881212147000` - Needs manual review

### 3. Start Server
```bash
npm run dev
```

Server will start at: **http://localhost:3000**

---

## Testing the API

### Test 1: Auto-Approval Flow (Ali - B40)

**Step 1: Verify MyKad**
```http
POST http://localhost:3000/api/citizen/verify
Content-Type: application/json

{
  "mykadNumber": "900101145000"
}
```

**Response:**
```json
{
  "success": true,
  "zkProofToken": "a1b2c3d4e5f6...",
  "isEligible": true,
  "fullName": "Ali bin Abdullah",
  "category": "B40"
}
```

**Step 2: Submit Application** (copy zkProofToken from above)
```http
POST http://localhost:3000/api/citizen/submit
Content-Type: application/json

{
  "zkProofToken": "a1b2c3d4e5f6...",
  "programName": "STR",
  "accountDetails": {
    "bankName": "Maybank",
    "accountNumber": "1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application auto-approved and disbursed!",
  "application": {
    "status": "Disbursed",
    "secretCode": "STR-1735123456-ABCD",
    "amount": 100
  }
}
```

✅ **Result**: Instant approval! Check console for mock bank transfer.

---

### Test 2: Manual Review Flow (Chong - M40)

**Step 1: Verify**
```http
POST http://localhost:3000/api/citizen/verify
Content-Type: application/json

{
  "mykadNumber": "950505106000"
}
```

**Step 2: Submit**
```http
POST http://localhost:3000/api/citizen/submit
Content-Type: application/json

{
  "zkProofToken": "<TOKEN>",
  "programName": "Sara Hidup",
  "accountDetails": {
    "bankName": "Hong Leong Bank",
    "accountNumber": "9876543210"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted for review",
  "application": {
    "status": "Pending",
    "secretCode": null,
    "amount": 350
  }
}
```

⏳ **Result**: Pending - needs admin approval

---

### Test 3: Admin Approval

**Get All Applications**
```http
GET http://localhost:3000/api/admin/applications
```

**Approve Pending Application** (use ID from response above)
```http
PATCH http://localhost:3000/api/admin/application/{APPLICATION_ID}/approve
```

**Response:**
```json
{
  "success": true,
  "message": "Application approved and disbursed successfully",
  "application": {
    "status": "Disbursed",
    "secretCode": "STR-1735123457-XYZ1"
  }
}
```

✅ **Result**: Manual approval triggers bank transfer!

---

## API Endpoints Reference

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

---

## Program Names & Aid Amounts

| Program Name | Aid Amount | Auto-Approve Threshold |
|-------------|-----------|------------------------|
| `STR` | RM 100 | ✅ Yes (if income ≤ 2500) |
| `Rahmah` | RM 100 | ✅ Yes (if income ≤ 2500) |
| `Sara Hidup` | RM 350 | ✅ Yes (if income ≤ 2500) |
| Others | RM 500 | ✅ Yes (if income ≤ 2500) |

---

## Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process if needed
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm run dev
```

### MongoDB connection error
- Verify internet connection
- Check if MongoDB Atlas is accessible
- URI is already configured in `src/config/db.ts`

### Need to re-seed database
```bash
npm run seed
```

---

## Testing Tools

**Option 1: VS Code REST Client Extension**
1. Install "REST Client" extension
2. Use `test-api.js` as reference
3. Create `.http` files with requests

**Option 2: Postman**
1. Open Postman
2. Import the endpoints manually
3. Test each endpoint

**Option 3: cURL (Git Bash)**
```bash
curl -X POST http://localhost:3000/api/citizen/verify \
  -H "Content-Type: application/json" \
  -d '{"mykadNumber": "900101145000"}'
```

---

## Console Output to Watch For

### Successful Verification
```
✅ Verification: Ali bin Abdullah (B40) - Token Generated
```

### Auto-Approval & Disbursement
```
🏦 ════════════════════════════════════════════════════════
💰 MOCK BANK TRANSFER INITIATED
════════════════════════════════════════════════════════
📋 Reference Code: STR-1735123456-ABCD
👤 Recipient: Ali bin Abdullah
💵 Amount: RM 100.00
✅ Status: TRANSFER SUCCESSFUL (SIMULATED)
════════════════════════════════════════════════════════
```

---

## What to Show at Hackathon

### Demo Flow (2-3 minutes)

**1. Show Privacy Protection** ⏱️ 30s
- Make verify request for Ali
- Point out: "Income never exposed in API!"
- Only token + eligibility returned

**2. Show Auto-Approval** ⏱️ 30s
- Submit application with token
- Show console output: instant bank transfer
- Highlight: "No waiting for B40 citizens!"

**3. Show Manual Review** ⏱️ 30s
- Verify + Submit for Chong
- Show "Pending" status
- Explain: "Higher income needs review"

**4. Show Admin Power** ⏱️ 30s
- Open admin applications endpoint
- Approve pending application
- Show bank transfer triggered

**5. Wrap Up** ⏱️ 30s
- "Privacy + Speed + Transparency"
- "Zero-knowledge simulation protects citizens"
- "Instant aid for those who need it most"

---

## File Locations

- **Main Entry**: [src/index.ts](./src/index.ts)
- **Database Config**: [src/config/db.ts](./src/config/db.ts)
- **Models**: [src/models/](./src/models/)
- **Controllers**: [src/controllers/](./src/controllers/)
- **Routes**: [src/routes/api.routes.ts](./src/routes/api.routes.ts)
- **Seed Script**: [src/seed/seed.ts](./src/seed/seed.ts)

---

**Happy Hacking! 🚀**  
Your backend is production-ready for the hackathon demo!
