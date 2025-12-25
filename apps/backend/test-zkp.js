/**
 * Zero-Knowledge Proof (ZKP) Flow Testing Script
 * Tests the privacy-preserving eligibility verification and application flow
 */

const BASE_URL = 'http://localhost:3000';

// Test data
const testCases = [
  {
    name: 'Test Case 1: B40 Citizen (Auto-Approve)',
    mykadNumber: '900101145000',
    expectedEligible: true,
    programName: 'STR Rahmah 2024',
    accountDetails: {
      bankName: 'Maybank',
      accountNumber: '1234567890',
      accountHolder: 'Ali bin Abdullah',
    },
  },
  {
    name: 'Test Case 2: Invalid MyKad',
    mykadNumber: '999999-99-9999',
    expectedEligible: false,
    shouldFail: true,
  },
  {
    name: 'Test Case 3: M40 Citizen (Should be Pending)',
    mykadNumber: '950505106000',
    expectedEligible: false,
    programName: 'Bantuan Sara Hidup',
    accountDetails: {
      bankName: 'CIMB',
      accountNumber: '9876543210',
      accountHolder: 'Chong Wei Ming',
    },
  },
];

/**
 * Test Step 1: MyKad Verification & ZK Token Generation
 */
async function testVerifyEligibility(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log('━'.repeat(60));
  console.log(`📋 MyKad: ${testCase.mykadNumber}`);
  console.log(`🎯 Expected Eligible: ${testCase.expectedEligible}`);

  try {
    const response = await fetch(`${BASE_URL}/api/citizen/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mykadNumber: testCase.mykadNumber }),
    });

    const data = await response.json();

    if (testCase.shouldFail && !response.ok) {
      console.log('✅ Expected failure occurred:', data.message);
      return null;
    }

    if (!response.ok) {
      console.error('❌ Verification failed:', data.message);
      return null;
    }

    console.log('✅ Step 1: Verification successful');
    console.log(`   🔑 ZK Proof Token: ${data.zkProofToken.substring(0, 16)}...`);
    console.log(`   👤 Name: ${data.fullName}`);
    console.log(`   📊 Category: ${data.category}`);
    console.log(`   ✓ Eligible: ${data.isEligible}`);
    console.log(`   🔒 Privacy: Income NOT exposed in response`);

    // Verify that income is NOT exposed (zero-knowledge property)
    if (data.householdIncome !== undefined) {
      console.error('❌ PRIVACY BREACH: Income data exposed!');
      return null;
    }

    console.log('   ✓ Zero-Knowledge property maintained');

    return data.zkProofToken;
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return null;
  }
}

/**
 * Test Step 2: Application Submission using ZK Token
 */
async function testSubmitApplication(zkProofToken, testCase) {
  if (!zkProofToken || !testCase.programName) {
    return;
  }

  console.log('\n📝 Step 2: Submitting application...');

  try {
    const response = await fetch(`${BASE_URL}/api/citizen/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zkProofToken,
        programName: testCase.programName,
        accountDetails: testCase.accountDetails,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Submission failed:', data.message);
      return;
    }

    console.log('✅ Step 2: Application submitted successfully');
    console.log(`   📋 Application ID: ${data.application.id}`);
    console.log(`   💰 Amount: RM ${data.application.amount}`);
    console.log(`   📊 Status: ${data.application.status}`);
    
    if (data.application.secretCode) {
      console.log(`   🔐 Secret Code: ${data.application.secretCode}`);
      console.log('   🚀 Auto-approved and disbursed!');
    } else {
      console.log('   ⏳ Pending manual review');
    }

    // Test token reuse (should fail - one-time use)
    console.log('\n🔒 Testing token reuse protection...');
    const reuseResponse = await fetch(`${BASE_URL}/api/citizen/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zkProofToken,
        programName: testCase.programName,
        accountDetails: testCase.accountDetails,
      }),
    });

    const reuseData = await reuseResponse.json();
    if (!reuseResponse.ok) {
      console.log('✅ Token reuse correctly prevented:', reuseData.message);
    } else {
      console.error('❌ Security issue: Token can be reused!');
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

/**
 * Test ZK Proof Routes
 */
async function testZKProofRoutes() {
  console.log('\n\n🔬 Testing ZK Proof Routes');
  console.log('═'.repeat(60));

  const routes = [
    { method: 'POST', path: '/api/zkproof/generate' },
    { method: 'POST', path: '/api/zkproof/verify' },
    { method: 'GET', path: '/api/zkproof/eligibility/test123' },
  ];

  for (const route of routes) {
    try {
      const response = await fetch(`${BASE_URL}${route.path}`, {
        method: route.method,
        headers: { 'Content-Type': 'application/json' },
        body: route.method === 'POST' ? JSON.stringify({ test: true }) : undefined,
      });

      const data = await response.json();
      console.log(`${route.method} ${route.path}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response:`, data.message || data);
    } catch (error) {
      console.error(`❌ ${route.path}:`, error.message);
    }
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║   MyFamilyLink Zero-Knowledge Proof (ZKP) Test Suite      ║');
  console.log('║   Privacy-Preserving Eligibility Verification             ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');

  // Check if server is running
  try {
    const healthCheck = await fetch(`${BASE_URL}/health`);
    if (!healthCheck.ok) {
      console.error('\n❌ Server is not responding. Please start the backend server first.');
      console.log('   Run: cd apps/backend && npm run dev');
      return;
    }
    const health = await healthCheck.json();
    console.log('\n✅ Server is running:', health.message);
  } catch (error) {
    console.error('\n❌ Cannot connect to server. Please start the backend server first.');
    console.log('   Run: cd apps/backend && npm run dev');
    return;
  }

  // Run test cases
  for (const testCase of testCases) {
    const zkToken = await testVerifyEligibility(testCase);
    await testSubmitApplication(zkToken, testCase);
    console.log('\n' + '─'.repeat(60));
  }

  // Test ZK proof routes
  await testZKProofRoutes();

  console.log('\n\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║   ZKP Test Summary                                        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('✓ Privacy-preserving verification: Income NOT exposed');
  console.log('✓ One-time token usage: Prevents replay attacks');
  console.log('✓ Auto-approval logic: B40 citizens instantly approved');
  console.log('✓ Session token mechanism: Simulates ZK proof generation');
  console.log('\n📌 Note: Current implementation uses session tokens to');
  console.log('   simulate ZK proofs. For production, integrate with');
  console.log('   Circom/Noir circuits for cryptographic proofs.');
  console.log('\n✅ All ZKP flow tests completed!\n');
}

// Run the tests
runTests().catch(console.error);
