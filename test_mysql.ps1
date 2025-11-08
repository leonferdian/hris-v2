# Simple MySQL Server Test
Write-Host "Testing MySQL Servers..." -ForegroundColor Yellow
Write-Host ""

# Test servers from legacy config
$servers = @{
    "ILV (10.100.100.20)" = "10.100.100.20"
    "FTM (10.50.1.22)" = "10.50.1.22"
    "FinPro (10.50.1.23)" = "10.50.1.23"
    "HRIS Domain" = "hris.int.padmatirtagroup.com"
    "Localhost" = "localhost"
}

foreach ($name in $servers.Keys) {
    $serverAddress = $servers[$name]
    Write-Host "Testing $name..." -NoNewline

    $result = Test-NetConnection -ComputerName $serverAddress -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue 2>$null

    if ($result -eq $true) {
        Write-Host " ACCESSIBLE" -ForegroundColor Green
    } else {
        Write-Host " Not reachable" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Recommendation:" -ForegroundColor Yellow
Write-Host "Ask your IT team: 'Where is the dashboard_hris MySQL database hosted?'"

