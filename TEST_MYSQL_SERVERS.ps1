# Test MySQL Server Connectivity
# Run this to find where your MySQL server is

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MySQL Server Connection Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define servers from legacy PHP config
$servers = @(
    @{
        Name = "ILV Server"
        Host = "10.100.100.20"
        Port = 3306
        Database = "dashboard_ilv"
        User = "iwan"
    },
    @{
        Name = "FTM Server"
        Host = "10.50.1.22"
        Port = 3306
        Database = "ftm"
        User = "it"
    },
    @{
        Name = "Finance Pro Server"
        Host = "10.50.1.23"
        Port = 3308
        Database = "fin_pro"
        User = "it"
    },
    @{
        Name = "HRIS Domain"
        Host = "hris.int.padmatirtagroup.com"
        Port = 3306
        Database = "dashboard_hris"
        User = "it"
    },
    @{
        Name = "Localhost"
        Host = "localhost"
        Port = 3306
        Database = "dashboard_hris"
        User = "it"
    }
)

Write-Host "Testing MySQL servers from legacy configuration..." -ForegroundColor Yellow
Write-Host ""

$accessible = @()

foreach ($server in $servers) {
    Write-Host "Testing: $($server.Name)" -ForegroundColor White
    Write-Host "  Host: $($server.Host):$($server.Port)" -ForegroundColor Gray
    Write-Host "  Database: $($server.Database)" -ForegroundColor Gray
    Write-Host "  Checking..." -NoNewline
    
    try {
        $result = Test-NetConnection -ComputerName $server.Host -Port $server.Port -InformationLevel Quiet -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
        
        if ($result) {
            Write-Host " ACCESSIBLE!" -ForegroundColor Green
            $accessible += $server
        } else {
            Write-Host " Not reachable" -ForegroundColor Red
        }
    } catch {
        Write-Host " Error testing" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Results Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($accessible.Count -gt 0) {
    Write-Host "✓ Found $($accessible.Count) accessible MySQL server(s):" -ForegroundColor Green
    Write-Host ""
    
    foreach ($server in $accessible) {
        Write-Host "  ✓ $($server.Name)" -ForegroundColor Green
        Write-Host "    Host: $($server.Host)" -ForegroundColor Gray
        Write-Host "    Port: $($server.Port)" -ForegroundColor Gray
        Write-Host "    Database: $($server.Database)" -ForegroundColor Gray
        Write-Host "    User: $($server.User)" -ForegroundColor Gray
        Write-Host ""
    }
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Recommended Action" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    $recommended = $accessible | Where-Object { $_.Database -eq "dashboard_hris" } | Select-Object -First 1
    
    if ($recommended) {
        Write-Host "✓ Found HRIS database server!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Update your .env.local file with:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "MYSQL_HOST=$($recommended.Host)" -ForegroundColor White
        Write-Host "MYSQL_PORT=$($recommended.Port)" -ForegroundColor White
        Write-Host "MYSQL_DB=$($recommended.Database)" -ForegroundColor White
        Write-Host "MYSQL_USER=$($recommended.User)" -ForegroundColor White
        Write-Host "MYSQL_PASSWORD=padm4.4" -ForegroundColor White
    } else {
        Write-Host "Note: Accessible servers found, but none have 'dashboard_hris' database." -ForegroundColor Yellow
        Write-Host "You may need to:" -ForegroundColor Yellow
        Write-Host "  1. Ask IT team which server has the dashboard_hris database" -ForegroundColor White
        Write-Host "  2. Or create the database on one of these servers" -ForegroundColor White
        Write-Host ""
        Write-Host "First accessible server:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "MYSQL_HOST=$($accessible[0].Host)" -ForegroundColor White
        Write-Host "MYSQL_PORT=$($accessible[0].Port)" -ForegroundColor White
        Write-Host "MYSQL_DB=$($accessible[0].Database)" -ForegroundColor White
        Write-Host "MYSQL_USER=$($accessible[0].User)" -ForegroundColor White
        Write-Host "MYSQL_PASSWORD=<ask IT team>" -ForegroundColor White
    }
} else {
    Write-Host "✗ No MySQL servers are accessible from this machine." -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "  1. MySQL servers are not running" -ForegroundColor White
    Write-Host "  2. Network firewall blocking connections" -ForegroundColor White
    Write-Host "  3. This server doesn't have network access to those IPs" -ForegroundColor White
    Write-Host ""
    Write-Host "Recommended actions:" -ForegroundColor Yellow
    Write-Host "  1. Ask IT team where the MySQL dashboard_hris database is hosted" -ForegroundColor White
    Write-Host "  2. Install MySQL locally if this is the intended HRIS server" -ForegroundColor White
    Write-Host "  3. Check network connectivity and firewall rules" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

