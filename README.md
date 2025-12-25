# MyFamilyLink

<div align="center">

![MyFamilyLink Logo](https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=MY)

### Tap-to-Verify Eligibility & Privacy-Preserving Aid Distribution Engine

**Unified Family Identity & Aid Management for Malaysia**

🏆 **GodamLah2.0 Hackathon Project** 🏆

Built by **BlockNexa Labs**

[![GodamLah2.0](https://img.shields.io/badge/GodamLah-2.0-orange)](https://godam.my)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Zero-Knowledge](https://img.shields.io/badge/ZK-Proofs-purple)](https://en.wikipedia.org/wiki/Zero-knowledge_proof)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Demo Script](#-demo-script)
- [Roadmap](#-roadmap)
- [Team](#-team)
- [Contributing](#-contributing)
- [License](#-license)

---

## Overview

**MyFamilyLink** is Malaysia's first **privacy-preserving aid distribution engine** that uses **Zero-Knowledge Proofs (ZKP)** and **NFC-enabled MyKad verification** to instantly verify citizen eligibility for government assistance programs without exposing sensitive financial data.

### Why MyFamilyLink?

- ✅ **Instant Verification** - Tap MyKad, get results in seconds
- 🔒 **Privacy First** - No income data ever leaves secure boundaries
- 🎯 **One Platform, All Programs** - STR, subsidies, education, health support
- 🚀 **Auto Distribution** - Funds directly to bank/e-wallet
- 📊 **Transparent Dashboard** - Citizens see exactly what they qualify for

---

## 🧩 The Problem

Malaysia's bantuan and subsidy ecosystem faces critical challenges that affect millions of citizens:

### Citizen Pain Points

| Challenge | Impact |
|-----------|--------|
| 📄 **Repeated Documentation** | Citizens must submit salary slips, bank statements, and household info for every program |
| ⏱️ **Long Waiting Times** | Approval processes take weeks or months |
| 🔄 **Data Redundancy** | Multiple agencies request the same information repeatedly |
| 👴 **High Friction** | Especially difficult for elderly, rural communities, and B40 families |

### Government Pain Points

| Challenge | Impact |
|-----------|--------|
| 💰 **Income Mismatch** | Incorrect B40/M40/T20 classification leads to misallocated aid |
| 🚨 **Fraud & Leakage** | Bantuan programs vulnerable to abuse |
| 🐌 **Manual Verification** | Delays in processing legitimate claims |
| 🔓 **Data Exposure Risks** | Sensitive information shared between agencies |
| 🎯 **No Universal Engine** | Each program builds its own verification system |

### Root Cause

> **Every program re-verifies eligibility and requires raw financial data, creating friction, delays, and privacy risks.**

---

## 🚀 Our Solution

MyFamilyLink transforms aid distribution through four key innovations:

### 1️⃣ Zero-Knowledge Proofs (ZKP)

Government agencies can **verify eligibility without knowing income** or seeing any private financial data.

**Example:**
```
Traditional System: "Show me your salary slip (RM 3,200)"
MyFamilyLink ZKP: "Prove your income is below RM 4,850" ✓ [Verified without revealing actual amount]
```

### 2️⃣ Tap-to-Verify MyKad

Citizens simply tap their **MyKad (NFC)** for instant eligibility results:

- ✅ **Eligible** - Automatically qualified for aid
- ❌ **Not Eligible** - Clear explanation provided
- 🟡 **Needs Review** - Manual verification required

### 3️⃣ Unified Eligibility Layer

One verification engine for all government programs:

- 💵 **STR (Sumbangan Tunai Rahmah)**
- ⛽ **Fuel Subsidy Programs**
- 🎓 **Education Scholarships**
- 🏥 **Health Support**
- 🌊 **Disaster Relief**
- 💻 **Youth & Digital Programs**

### 4️⃣ Auto-Distribution

Approved funds are **automatically distributed** to:

- 🏦 Bank accounts (via JomPay/FPX)
- 📱 E-wallets (Touch 'n Go, GrabPay)
- 💳 Subsidy wallets (MySalam, etc.)

**Privacy preserved. Zero financial data exposed.**

---

## 🔄 System Architecture

![MyFamilyLink System Architecture](images/Flowchart.png)


### Data Flow Sequence

1. **Authentication** - Citizen taps MyKad (NFC)
2. **Secure Request** - Encrypted NRIC sent to backend
3. **Data Aggregation** - System fetches attributes from government DBs
4. **Privacy Barrier** - Raw data enters ZKP engine (never leaves)
5. **Proof Generation** - Mathematical proofs created (no raw data)
6. **Token Return** - ZK-Token sent to device (Yes/No only)
7. **Display Result** - Citizen sees eligibility (✔/✘/🟡)
8. **Auto Distribution** - If eligible, funds transferred automatically

---

## ✨ Key Features

### For Citizens

| Feature | Description |
|---------|-------------|
| 🪪 **NFC MyKad Verification** | Tap and verify in 5-10 seconds |
| 📊 **Transparent Dashboard** | See all eligible aids and usage tracking |
| 🔔 **Real-time Notifications** | Get notified when aids are approved/distributed |
| 👨‍👩‍👧‍👦 **Family View** | Household head can view all family members |
| 💰 **Aid Breakdown** | Clear visualization of remaining quotas |
| 🏦 **Multiple Payment Options** | Bank transfer, e-wallet, or QR collection |

### For Government Administrators

| Feature | Description |
|---------|-------------|
| 📈 **Analytics Dashboard** | Track applications, approvals, rejections in real-time |
| ⚡ **Instant Verification** | No manual document checking required |
| 🎯 **Fraud Detection** | ZKP prevents double claims and identity fraud |
| 📋 **Audit Trail** | Complete transparency for compliance |
| 💼 **Multi-Program Support** | Manage all bantuan schemes from one panel |
| 🔍 **Search & Filter** | Find applications by NRIC, name, or status |

### Technical Features

- 🔐 **End-to-End Encryption** - All data transmitted securely
- 🧮 **Zero-Knowledge Circuits** - Circom/Noir implementation
- 🌳 **Merkle Tree Commitments** - Tamper-proof eligibility records
- ⚡ **Redis Caching** - Sub-second proof verification
- 📱 **Progressive Web App** - Works offline with sync
- 🌍 **Multi-language** - Bahasa Malaysia, English, Chinese, Tamil

---

## 📱 Screenshots

### 1. MyKad Tap Screen

<div align="center">
<img src="images/MyKad.png" width="600" alt="Scan MyKad Screen">

**Simple tap-to-verify interface** - Citizens place their MyKad on the NFC reader to begin verification. Alternative fingerprint and MySejahtera options available.
</div>

---

### 2. Eligibility Result

<div align="center">
<img src="images/Eligibility.png" width="600" alt="Eligibility Result Screen">

**Instant eligibility determination** - Citizens immediately see which aids they qualify for:
- ✅ **Subsidy** - Eligible
- ✅ **Scholarship** - Eligible  
- ✅ **Welfare** - Eligible
- ❌ **Health Support** - Not Eligible (with explanation)

Income classification (B40/M40/T20) shown with household details.
</div>

---

### 3. Family Dashboard

<div align="center">
<img src="images/Family.png" width="600" alt="Family Dashboard">

**Comprehensive household view** showing:
- 📊 Household classification (B40)
- 👥 Number of family members
- 💰 Active aids with usage tracking
- 📈 Real-time subsidy consumption (Fuel, STR Cash Aid, Education)
- 👤 Family member management
</div>

---

### 4. Admin Panel

<div align="center">
<img src="images/Admin.png" width="600" alt="Admin Panel">

**Government administrator dashboard** featuring:
- 📊 Real-time statistics (Pending, Approved, Rejected, Distributed)
- 🔍 Search and filter capabilities
- ✅ One-click approve/reject workflow
- 📝 Activity logs and audit trail
- 💵 Total distribution value tracking
</div>

---

### 5. Distribution Selection

<div align="center">
<img src="images/Distribution.png" width="600" alt="Distribution Method Selection">

**Flexible disbursement options** for approved aids:
- 🏦 **Bank Transfer** (Recommended) - Direct deposit to registered account
- 📱 **eWallet** - Touch 'n Go, GrabPay transfer
- 📍 **In-app Claim QR** - Collection at designated centers

Application status tracking: Submitted → Verified → Approved → Distributed
</div>

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **ShadCN UI** | Government-grade UI components |
| **Framer Motion** | Smooth animations |
| **Web NFC API** | MyKad NFC reading |
| **React Query** | Server state management |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **PostgreSQL** | Primary database |
| **Prisma ORM** | Type-safe database client |
| **Redis** | Caching & session management |
| **WebSocket** | Real-time notifications |

### Zero-Knowledge & Cryptography

| Technology | Purpose |
|------------|---------|
| **Circom / Noir** | ZK circuit development |
| **SnarkJS** | ZK proof generation & verification |
| **Poseidon Hash** | ZK-friendly hashing |
| **Merkle Trees** | Commitment scheme |
| **EdDSA Signatures** | Digital signature verification |

### Identity & Integration

| Component | Description |
|-----------|-------------|
| **MyKad NFC** | National ID card verification |
| **LHDN API (Mocked)** | Income range verification |
| **e-Kasih API (Mocked)** | Welfare status database |
| **JKM API (Mocked)** | Social welfare integration |
| **NRD Database (Mocked)** | Household information |
| **FPX/JomPay Gateway** | Bank transfer integration |

### DevOps & Deployment

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Vercel** | Frontend hosting |
| **Railway / AWS** | Backend hosting |
| **GitHub Actions** | CI/CD pipeline |
| **Cloudflare** | CDN & DDoS protection |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Redis 7+
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/BlockNexaLabs/MyFamilyLink.git
cd MyFamilyLink
```

2. **Install dependencies**

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Environment Setup**

Create `.env` files in both `frontend` and `backend` directories:

**Backend `.env`:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/myfamilylink
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
LHDN_API_URL=http://localhost:3001/mock/lhdn
EKASIH_API_URL=http://localhost:3001/mock/ekasih
NRD_API_URL=http://localhost:3001/mock/nrd
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

4. **Database Setup**

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

5. **Run Development Servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the Application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Admin Panel: http://localhost:3000/admin

### Docker Deployment (Optional)

```bash
docker-compose up -d
```

---

## 🎥 Demo Script

### 1️⃣ Introduction (20 seconds)

> "Malaysia has a major problem: every bantuan program asks for income documents again and again. Citizens face friction, and government faces fraud. **Our solution: MyFamilyLink**, Malaysia's first tap-to-verify eligibility system using Zero-Knowledge Proofs."

### 2️⃣ Tap-to-Verify Demo (30 seconds)

**Demo Steps:**
1. Open the MyFamilyLink app
2. Show "Tap your MyKad to begin" screen
3. Tap MyKad on phone (NFC)
4. App instantly displays results:
   - ✅ Eligible for STR Cash Aid
   - ✅ Eligible for Fuel Subsidy
   - ❌ Not Eligible for University Scholarship

> "This proof is verified **without revealing the person's income**. The government only knows 'Yes' or 'No', never the actual salary amount."

### 3️⃣ Zero-Knowledge Proof Explanation (20 seconds)

**Visual Animation:**
```
Traditional System:
Government: "What is your income?"
Citizen: "RM 3,200" ❌ Privacy Lost

MyFamilyLink ZKP:
Government: "Is your income below RM 4,850?"
Citizen: "✓ Proven (without revealing RM 3,200)" ✅ Privacy Preserved
```

> "Our engine verifies eligibility rules **without ever seeing raw data** like salary or bank balance."

### 4️⃣ Dashboard View (20 seconds)

**Show:**
- Breakdown of eligible subsidies (RM amounts, percentages used)
- Transparent explanation of why certain aids were approved/denied
- Household link view (family members)

> "Citizens get **full transparency** - they see exactly what they qualify for and why."

### 5️⃣ Auto Distribution (20 seconds)

**Mock Transfer Animation:**
1. Show approved aid: "STR Cash Aid - RM 2,500"
2. Select distribution method: "Bank Transfer"
3. Confirmation: "Funds deposited to Maybank ****4567"

> "Aid is **automatically disbursed** to their verified bank or e-wallet. No queues, no paperwork."

### 6️⃣ Admin Panel Overview (20 seconds)

**Show:**
- Real-time statistics (156 pending, 2,847 approved)
- Approve/Reject workflow
- Audit trail and activity logs

> "Government administrators get **complete oversight** with fraud prevention built-in."

### 7️⃣ Closing (10 seconds)

> "Built by **BlockNexa Labs**, MyFamilyLink brings **fairness, transparency, and privacy** to Malaysia's bantuan ecosystem. Rakyat wins. Government wins. Malaysia wins."



## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow conventional commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Malaysian Government Agencies** - For inspiration and problem validation
- **ZK Research Community** - For cryptographic primitives
- **Open Source Contributors** - For tools and libraries

---

## 👥 Team

### GodamLah2.0 Hackathon - BlockNexa Labs

This project was built for the **GodamLah2.0 Hackathon** by a passionate team of developers committed to solving real-world problems in Malaysia's aid distribution system.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/samsuzzoha404.png" width="100px;" alt="Md Samsuzzoha Mondal"/>
      <br />
      <sub><b>Md Samsuzzoha Mondal</b></sub>
      <br />
      <a href="https://github.com/samsuzzoha404">GitHub</a>
    </td>
    <td align="center">
      <img src="https://via.placeholder.com/100/3B82F6/FFFFFF?text=EA" width="100px;" alt="Easin Arafat"/>
      <br />
      <sub><b>Easin Arafat</b></sub>
      <br />
      <a href="#">GitHub</a>
    </td>
    <td align="center">
      <img src="https://via.placeholder.com/100/3B82F6/FFFFFF?text=YM" width="100px;" alt="Youssef Mabrouk"/>
      <br />
      <sub><b>Youssef Mabrouk</b></sub>
      <br />
      <a href="#">GitHub</a>
    </td>
    <td align="center">
      <img src="https://via.placeholder.com/100/3B82F6/FFFFFF?text=MA" width="100px;" alt="Muhammad Affan"/>
      <br />
      <sub><b>Muhammad Affan</b></sub>
      <br />
      <a href="#">GitHub</a>
    </td>
  </tr>
</table>

### Roles & Contributions

- **Md Samsuzzoha Mondal** - Full Stack Development, ZKP Implementation
- **Easin Arafat** - Backend Architecture, Database Design
- **Youssef Mabrouk** - UI/UX Design
- **Muhammad Affan** - System Architecture, Integration & Testing

---

## 📞 Contact

**Project Repository:** [MyFamilyLink](https://github.com/samsuzzoha404/MyFamilyLink)

**For inquiries:** samsuzzoha404@github.com

---

<div align="center">

### Built with ❤️ for Malaysia 🇲🇾

**Privacy-First. Citizen-Centric. Government-Approved.**

</div>
