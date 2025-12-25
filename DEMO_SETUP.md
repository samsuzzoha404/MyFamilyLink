# MyFamilyLink Demo Setup Guide

## 🎯 Sequential Demo Mode Implementation

This guide explains how to set up and run the sequential demo mode for your hackathon presentation.

## 📋 What's Been Implemented

### Backend Changes
- ✅ **Seed Script** (`backend/src/seed/seed.ts`)
  - Clears both `citizens` and `applications` collections
  - Seeds 3 demo personas:
    1. **Ali bin Abdullah** (B40, Eligible) - MyKad: 900101145000
    2. **Chong Wei Ming** (M40, Pending) - MyKad: 950505106000
    3. **Subramanian Ramasamy** (T20, Rejected) - MyKad: 881212147000

### Citizen Frontend Changes
- ✅ **ScanPage.tsx** - Sequential Demo Mode
  - Cycles through 3 personas automatically
  - Calls `POST /api/citizen/verify` with MyKad
  - Navigates to eligibility with real API data
  
- ✅ **EligibilityPage.tsx** - Dynamic Data Display
  - Shows citizen name from API response
  - Displays eligibility status based on backend logic
  - Passes zkProofToken through navigation state
  
- ✅ **DisbursementPage.tsx** - State Pass-through
  - Receives and forwards zkProofToken
  - Passes selected disbursement method
  
- ✅ **AidSelectionPage.tsx** - State Pass-through
  - Receives zkProofToken and citizen data
  - Forwards to confirmation page
  
- ✅ **ConfirmationPage.tsx** - Application Submission
  - Calls `POST /api/citizen/submit` with zkProofToken
  - Displays "Disbursed" for auto-approved (B40)
  - Displays "Pending Review" for manual review (M40)
  - Shows secret code for disbursed applications

### Admin Frontend Changes
- ✅ **PendingApplications.tsx** - Real-time Dashboard
  - Polls `GET /api/admin/applications` every 2 seconds
  - Displays real application data in table
  - Approve button calls `PATCH /api/admin/application/:id`
  - Shows application status (Pending/Disbursed/Rejected)

## 🚀 Setup Instructions

### 1. Seed the Database
```bash
cd apps/backend
npx tsx src/seed/seed.ts
```

Expected output:
```
🗑️  Cleared X existing citizens
🗑️  Cleared X existing applications

✅ Successfully seeded the database with demo personas:
1. Ali bin Abdullah
   MyKad: 900101145000
   Income: RM 1500
   Category: B40
   Linked Account: Yes
...
```

### 2. Set Environment Variables

#### Backend (.env)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/myfamilylink
```

#### Citizen Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
```

#### Admin Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Start All Services

#### Terminal 1 - Backend
```bash
cd apps/backend
npm run dev
```

#### Terminal 2 - Citizen Frontend
```bash
cd apps/citizen
npm run dev
```

#### Terminal 3 - Admin Frontend
```bash
cd apps/admin
npm run dev
```

## 🎬 Demo Flow for Judges

### Round 1: Ali (B40 - Auto-Approved) ✅
1. Open Citizen app → Click "Scan MyKad"
2. System automatically scans **Ali's MyKad (900101145000)**
3. Shows "Eligible" status
4. Select disbursement method → Choose aid program
5. **Confirmation page shows "Disbursed"** immediately
6. Open Admin dashboard → See no pending (auto-approved)

### Round 2: Chong (M40 - Manual Review) ⏳
1. Click "Scan MyKad" again (from home page)
2. System automatically scans **Chong's MyKad (950505106000)**
3. Shows "Eligible" status
4. Select disbursement method → Choose aid program
5. **Confirmation page shows "Pending Review"**
6. Open Admin dashboard → **See Chong's application in pending**
7. Admin clicks **"Approve"** → Application moves to Disbursed

### Round 3: Subra (T20 - Not Eligible) ❌
1. Click "Scan MyKad" again
2. System automatically scans **Subra's MyKad (881212147000)**
3. Shows **"Not Eligible"** status (income too high)
4. Demonstrates rejection flow

## 🔄 Sequential Cycle Logic

The `ScanPage.tsx` maintains a `scanCount` state that cycles through the 3 MyKad IDs:
```typescript
const DEMO_IDS = ['900101145000', '950505106000', '881212147000'];
const targetMyKad = DEMO_IDS[scanCount % 3];
```

Each scan increments the counter, so:
- 1st scan → Ali (index 0)
- 2nd scan → Chong (index 1)
- 3rd scan → Subra (index 2)
- 4th scan → Ali again (index 0)
- etc.

## 🎯 Key Features Demonstrated

### Privacy-Preserving (Zero-Knowledge Proof Simulation)
- MyKad number is only used once during verification
- All subsequent requests use `zkProofToken`
- Admin never sees actual MyKad numbers
- Income data not exposed in API responses

### Auto-Approval Logic
- **B40 (≤RM 2,500)** → Auto-approve and disburse
- **M40 (RM 2,501 - 5,880)** → Manual review required
- **T20 (> RM 5,880)** → Not eligible

### Real-time Updates
- Admin dashboard polls every 2 seconds
- Shows new applications instantly
- Status updates reflected immediately

## 📊 Testing the API Directly

### Verify Eligibility
```bash
curl -X POST http://localhost:5001/api/citizen/verify \
  -H "Content-Type: application/json" \
  -d '{"mykadNumber": "900101145000"}'
```

### Submit Application
```bash
curl -X POST http://localhost:5001/api/citizen/submit \
  -H "Content-Type: application/json" \
  -d '{
    "zkProofToken": "YOUR_TOKEN_FROM_VERIFY",
    "programName": "Cash Assistance (STR)",
    "accountDetails": {
      "bankName": "Maybank",
      "accountNumber": "1234567890"
    }
  }'
```

### Get All Applications (Admin)
```bash
curl http://localhost:5001/api/admin/applications
```

### Approve Application (Admin)
```bash
curl -X PATCH http://localhost:5001/api/admin/application/APPLICATION_ID \
  -H "Content-Type: application/json" \
  -d '{"action": "approve"}'
```

## 🐛 Troubleshooting

### Issue: API calls failing
**Solution:** Check that VITE_API_URL is set correctly in both frontend .env files

### Issue: No applications showing in admin
**Solution:** 
1. Check backend is running
2. Verify MongoDB is running
3. Check browser console for CORS errors

### Issue: Scan page stuck
**Solution:** 
1. Check backend logs for API errors
2. Verify the seed data was created
3. Open browser DevTools Network tab

### Issue: Applications not auto-refreshing in admin
**Solution:** 
1. Check that the polling interval is running (should fetch every 2 seconds)
2. Look for console errors
3. Verify the API endpoint is responding

## 🎊 Success Indicators

You'll know everything is working when:
- ✅ Each scan cycles through a different persona
- ✅ Ali's application is auto-disbursed (no admin action needed)
- ✅ Chong's application appears in admin pending list
- ✅ Admin can approve Chong's application
- ✅ Subra is marked as "Not Eligible"
- ✅ Real-time updates visible in admin dashboard

## 📝 Presentation Tips

1. **Start with a clean database** - Run the seed script before demo
2. **Have 2 browser windows open** - Citizen and Admin side-by-side
3. **Explain the sequential cycle** - Show judges it's rotating automatically
4. **Highlight the privacy** - Point out zkProofToken vs MyKad usage
5. **Show the auto-approval** - Emphasize how B40 gets instant disbursement
6. **Demonstrate admin workflow** - Manually approve Chong's application

Good luck with your hackathon! 🚀
