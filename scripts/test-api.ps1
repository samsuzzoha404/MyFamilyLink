# MyFamilyLink API Test Script (PowerShell)
# This script tests all the key API endpoints

$API_URL = "http://localhost:5001/api"

Write-Host "🧪 Testing MyFamilyLink API" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Verify Ali (B40 - should auto-approve)
Write-Host "1️⃣  Testing Ali (B40) - Should Auto-Approve" -ForegroundColor Yellow
Write-Host "-------------------------------------------" -ForegroundColor Yellow

$body1 = @{
    mykadNumber = "900101145000"
} | ConvertTo-Json

$response1 = Invoke-RestMethod -Uri "$API_URL/citizen/verify" -Method Post -Body $body1 -ContentType "application/json"
Write-Host "Response: $($response1 | ConvertTo-Json)" -ForegroundColor Green
$token1 = $response1.zkProofToken
Write-Host "Token: $token1" -ForegroundColor Magenta
Write-Host ""

# Test 2: Submit Ali's application
Write-Host "2️⃣  Submitting Ali's Application" -ForegroundColor Yellow
Write-Host "-------------------------------------------" -ForegroundColor Yellow

$body2 = @{
    zkProofToken = $token1
    programName = "Cash Assistance (STR)"
    accountDetails = @{
        bankName = "Maybank"
        accountNumber = "1234567890"
    }
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "$API_URL/citizen/submit" -Method Post -Body $body2 -ContentType "application/json"
    Write-Host "✅ Ali's Application Submitted" -ForegroundColor Green
    Write-Host "Status: $($response2.application.status)" -ForegroundColor Green
    if ($response2.application.secretCode) {
        Write-Host "Secret Code: $($response2.application.secretCode)" -ForegroundColor Magenta
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Verify Chong (M40 - should require manual approval)
Write-Host "3️⃣  Testing Chong (M40) - Should Require Manual Review" -ForegroundColor Yellow
Write-Host "-------------------------------------------" -ForegroundColor Yellow

$body3 = @{
    mykadNumber = "950505106000"
} | ConvertTo-Json

$response3 = Invoke-RestMethod -Uri "$API_URL/citizen/verify" -Method Post -Body $body3 -ContentType "application/json"
Write-Host "Response: $($response3 | ConvertTo-Json)" -ForegroundColor Green
$token2 = $response3.zkProofToken
Write-Host ""

# Test 4: Submit Chong's application
Write-Host "4️⃣  Submitting Chong's Application" -ForegroundColor Yellow
Write-Host "-------------------------------------------" -ForegroundColor Yellow

$body4 = @{
    zkProofToken = $token2
    programName = "Cash Assistance (STR)"
    accountDetails = @{
        bankName = "CIMB"
        accountNumber = "0987654321"
    }
} | ConvertTo-Json

try {
    $response4 = Invoke-RestMethod -Uri "$API_URL/citizen/submit" -Method Post -Body $body4 -ContentType "application/json"
    Write-Host "✅ Chong's Application Submitted" -ForegroundColor Green
    Write-Host "Status: $($response4.application.status)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Verify Subra (T20 - should be rejected)
Write-Host "5️⃣  Testing Subra (T20) - Should Be Not Eligible" -ForegroundColor Yellow
Write-Host "-------------------------------------------" -ForegroundColor Yellow

$body5 = @{
    mykadNumber = "881212147000"
} | ConvertTo-Json

try {
    $response5 = Invoke-RestMethod -Uri "$API_URL/citizen/verify" -Method Post -Body $body5 -ContentType "application/json"
    Write-Host "Eligible: $($response5.isEligible)" -ForegroundColor $(if ($response5.isEligible) { "Green" } else { "Red" })
    Write-Host "Category: $($response5.category)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 6: Get all applications (Admin)
Write-Host "6️⃣  Getting All Applications (Admin View)" -ForegroundColor Yellow
Write-Host "-------------------------------------------" -ForegroundColor Yellow

try {
    $apps = Invoke-RestMethod -Uri "$API_URL/admin/applications" -Method Get
    Write-Host "✅ Found $($apps.count) applications" -ForegroundColor Green
    foreach ($app in $apps.applications) {
        Write-Host "  - $($app.applicantName): $($app.status) (RM $($app.amount))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ API Test Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Check admin dashboard at http://localhost:5174" -ForegroundColor White
Write-Host "2. You should see Chong's application as 'Pending'" -ForegroundColor White
Write-Host "3. Ali's application should be 'Disbursed'" -ForegroundColor White
