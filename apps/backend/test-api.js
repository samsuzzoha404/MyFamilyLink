// Test Script - MyFamilyLink Backend API
// Run with: node test-api.js (or use VS Code REST Client extension)

// ============================================
// TEST 1: Verify Eligibility (Ali - B40)
// ============================================

/*
POST http://localhost:3000/api/citizen/verify
Content-Type: application/json

{
  "mykadNumber": "900101145000"
}

Expected Response:
{
  "success": true,
  "zkProofToken": "abc123...", 
  "isEligible": true,
  "fullName": "Ali bin Abdullah",
  "category": "B40"
}
*/

// ============================================
// TEST 2: Submit Application (Auto-Approve)
// ============================================

/*
POST http://localhost:3000/api/citizen/submit
Content-Type: application/json

{
  "zkProofToken": "<TOKEN_FROM_TEST_1>",
  "programName": "STR",
  "accountDetails": {
    "bankName": "Maybank",
    "accountNumber": "1234567890"
  }
}

Expected Response:
{
  "success": true,
  "message": "Application auto-approved and disbursed!",
  "application": {
    "id": "...",
    "status": "Disbursed",
    "secretCode": "STR-1234567890-ABCD",
    "amount": 100,
    "programName": "STR"
  }
}
*/

// ============================================
// TEST 3: Verify Eligibility (Chong - M40)
// ============================================

/*
POST http://localhost:3000/api/citizen/verify
Content-Type: application/json

{
  "mykadNumber": "950505106000"
}

Expected Response:
{
  "success": true,
  "zkProofToken": "xyz789...",
  "isEligible": false,
  "fullName": "Chong Wei Ming",
  "category": "M40"
}
*/

// ============================================
// TEST 4: Submit Application (Manual Review)
// ============================================

/*
POST http://localhost:3000/api/citizen/submit
Content-Type: application/json

{
  "zkProofToken": "<TOKEN_FROM_TEST_3>",
  "programName": "Sara Hidup",
  "accountDetails": {
    "bankName": "Hong Leong Bank",
    "accountNumber": "9876543210"
  }
}

Expected Response:
{
  "success": true,
  "message": "Application submitted for review",
  "application": {
    "id": "...",
    "status": "Pending",
    "secretCode": null,
    "amount": 350,
    "programName": "Sara Hidup"
  }
}
*/

// ============================================
// TEST 5: Admin - Get All Applications
// ============================================

/*
GET http://localhost:3000/api/admin/applications

Expected Response:
{
  "success": true,
  "count": 2,
  "applications": [...]
}
*/

// ============================================
// TEST 6: Admin - Approve Pending Application
// ============================================

/*
PATCH http://localhost:3000/api/admin/application/<APPLICATION_ID>/approve

Expected Response:
{
  "success": true,
  "message": "Application approved and disbursed successfully",
  "application": {
    "id": "...",
    "applicantName": "Chong Wei Ming",
    "programName": "Sara Hidup",
    "amount": 350,
    "status": "Disbursed",
    "secretCode": "STR-1234567890-XYZ1"
  }
}
*/

// ============================================
// TEST 7: Health Check
// ============================================

/*
GET http://localhost:3000/health

Expected Response:
{
  "status": "ok",
  "timestamp": "2025-12-25T10:30:45.000Z",
  "message": "MyFamilyLink Privacy-Preserving Aid Distribution Engine"
}
*/

console.log('✅ Use these endpoints to test the API');
console.log('📝 Copy the requests above into VS Code REST Client or Postman');
console.log('🎯 Demo MyKad numbers:');
console.log('   • Ali (B40, Auto-Approve): 900101145000');
console.log('   • Chong (M40, Manual Review): 950505106000');
console.log('   • Subra (T20, Not Eligible): 881212147000');
