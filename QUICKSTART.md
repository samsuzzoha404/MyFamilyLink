# MyFamilyLink - Quick Start Commands

## 🚀 Quick Start (Run These in Order)

### 1. Seed the Database
```powershell
cd apps/backend
npx tsx src/seed/seed.ts
```

### 2. Start Backend (Terminal 1)
```powershell
cd apps/backend
npm run dev
```

### 3. Start Citizen Frontend (Terminal 2)
```powershell
cd apps/citizen
npm run dev
```

### 4. Start Admin Frontend (Terminal 3)
```powershell
cd apps/admin
npm run dev
```

## 🌐 Access URLs

- **Citizen Portal**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5174
- **Backend API**: http://localhost:5001

## 🎯 Demo Sequence

1. **Open Citizen Portal** (http://localhost:5173)
2. **Click "Scan MyKad"** - This will automatically cycle through:
   - 1st scan: Ali (B40, Auto-Approved) ✅
   - 2nd scan: Chong (M40, Pending) ⏳
   - 3rd scan: Subra (T20, Rejected) ❌

3. **Open Admin Dashboard** (http://localhost:5174) in another window
4. **Watch applications appear** in real-time
5. **Approve Chong's application** manually

## 📊 Expected Results

### Ali (1st Scan)
- ✅ Eligibility: **Eligible**
- ✅ Status: **Auto-Disbursed** (no admin approval needed)
- ✅ Secret Code: Displayed immediately

### Chong (2nd Scan)
- ✅ Eligibility: **Eligible**
- ⏳ Status: **Pending Review**
- 🔄 Admin must manually approve

### Subra (3rd Scan)
- ❌ Eligibility: **Not Eligible**
- ❌ Income: RM 15,000 (T20 category)

## 🔄 Reset Demo

To reset and start fresh:
```powershell
cd apps/backend
npx tsx src/seed/seed.ts
```

This will clear all existing data and reseed with the 3 demo personas.
