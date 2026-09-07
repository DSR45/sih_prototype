"# Test the generate-medical-questions function

$headers = @{
    'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdodHBpeG9rcWpidnBobGJpd3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzOTU5MjUsImV4cCI6MjEwMzk3MTkyNX0.YD9kiwYRW12z5SRJqgDeikLn23ctIwHfUASm-F477uQ'
    'Content-Type' = 'application/json'
}

$body = @{
    chiefComplaint = 'chest pain'
    questionCount = 5
} | ConvertTo-Json

Write-Host 'Testing function...' -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod `
        -Uri 'https://ghtpixokqjbvphlbiwsr.supabase.co/functions/v1/generate-medical-questions' `
        -Method POST `
        -Headers $headers `
        -Body $body
    
    Write-Host 'Success!' -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
}
catch {
    Write-Host 'Error occurred:' -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        Write-Host 'Details:' -ForegroundColor Yellow
        $_.ErrorDetails.Message
    }
}
"