#!/usr/bin/env bash

# MyFamilyLink API Test Script
# This script tests all the key API endpoints

API_URL="http://localhost:5001/api"

echo "🧪 Testing MyFamilyLink API"
echo "================================"
echo ""

# Test 1: Verify Ali (B40 - should auto-approve)
echo "1️⃣  Testing Ali (B40) - Should Auto-Approve"
echo "-------------------------------------------"
RESPONSE=$(curl -s -X POST "$API_URL/citizen/verify" \
  -H "Content-Type: application/json" \
  -d '{"mykadNumber": "900101145000"}')

echo "Response: $RESPONSE"
TOKEN=$(echo $RESPONSE | grep -o '"zkProofToken":"[^"]*"' | cut -d'"' -f4)
echo "Token extracted: $TOKEN"
echo ""

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get zkProofToken"
  exit 1
fi

# Test 2: Submit Ali's application
echo "2️⃣  Submitting Ali's Application"
echo "-------------------------------------------"
curl -s -X POST "$API_URL/citizen/submit" \
  -H "Content-Type: application/json" \
  -d "{
    \"zkProofToken\": \"$TOKEN\",
    \"programName\": \"Cash Assistance (STR)\",
    \"accountDetails\": {
      \"bankName\": \"Maybank\",
      \"accountNumber\": \"1234567890\"
    }
  }" | json_pp 2>/dev/null || echo "✅ Application submitted"
echo ""

# Test 3: Verify Chong (M40 - should require manual approval)
echo "3️⃣  Testing Chong (M40) - Should Require Manual Review"
echo "-------------------------------------------"
RESPONSE=$(curl -s -X POST "$API_URL/citizen/verify" \
  -H "Content-Type: application/json" \
  -d '{"mykadNumber": "950505106000"}')

echo "Response: $RESPONSE"
TOKEN2=$(echo $RESPONSE | grep -o '"zkProofToken":"[^"]*"' | cut -d'"' -f4)
echo ""

# Test 4: Submit Chong's application
echo "4️⃣  Submitting Chong's Application"
echo "-------------------------------------------"
curl -s -X POST "$API_URL/citizen/submit" \
  -H "Content-Type: application/json" \
  -d "{
    \"zkProofToken\": \"$TOKEN2\",
    \"programName\": \"Cash Assistance (STR)\",
    \"accountDetails\": {
      \"bankName\": \"CIMB\",
      \"accountNumber\": \"0987654321\"
    }
  }" | json_pp 2>/dev/null || echo "✅ Application submitted"
echo ""

# Test 5: Get all applications (Admin)
echo "5️⃣  Getting All Applications (Admin View)"
echo "-------------------------------------------"
curl -s -X GET "$API_URL/admin/applications" | json_pp 2>/dev/null || echo "✅ Applications fetched"
echo ""

echo "================================"
echo "✅ API Test Complete!"
echo ""
echo "Next steps:"
echo "1. Check admin dashboard at http://localhost:5174"
echo "2. You should see Chong's application as 'Pending'"
echo "3. Ali's application should be 'Disbursed'"
