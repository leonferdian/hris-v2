# 🔧 MySQL Connection Fix - Organizational Policy Compliant

## ✅ Current Setup is CORRECT!

Your authentication is already configured to use **MySQL** (not MSSQL):
- File: `apps/web/lib/auth.ts` - Uses MySQL for users ✓
- File: `apps/web/lib/db/mysql.ts` - MySQL connection pool ✓
- Users table location: MySQL `dashboard_hris` database ✓

**This complies with your organizational policy!**

---

## ❌ The Problem

**MySQL server is not running on this Windows Server.**

Diagnostic results:
- ❌ No MySQL service found
- ❌ Port 3306 not listening  
- ❌ XAMPP MySQL not installed
- ❌ MySQL not in Program Files

---

## 🎯 Solutions (Pick One)

### Option 1: Connect to Remote MySQL Server (RECOMMENDED)

Based on your legacy config, MySQL might be running on a different server.

**Check with your IT team where the MySQL `dashboard_hris` database is hosted:**

Possible locations from legacy config:
- `hris.int.padmatirtagroup.com` (mentioned in PHP config)
- `10.100.100.20` (ILV server - has MySQL)
- `10.50.1.22` (FTM server - has MySQL)
- Another internal server

**Once you know the correct MySQL server:**

Update `.env.local`:
```env
# Replace localhost with actual MySQL server
MYSQL_HOST=hris.int.padmatirtagroup.com  # or IP address
MYSQL_PORT=3306
MYSQL_DB=dashboard_hris
MYSQL_USER=it
MYSQL_PASSWORD=padm4.4
```

---

### Option 2: Install MySQL Locally

If MySQL should run on this server:

#### A. Install MySQL Server:
1. Download: https://dev.mysql.com/downloads/installer/
2. Install MySQL Server
3. Set root password
4. Start MySQL service

#### B. Or Install XAMPP:
1. Download: https://www.apachefriends.org/
2. Install with MySQL component
3. Start MySQL from control panel

---

### Option 3: Test Connection to Legacy Server

Let's test if you can reach the MySQL servers from legacy config:

```powershell
# Test connection to port 3306 on different servers
Test-NetConnection -ComputerName 10.100.100.20 -Port 3306
Test-NetConnection -ComputerName 10.50.1.22 -Port 3306
Test-NetConnection -ComputerName hris.int.padmatirtagroup.com -Port 3306
```

If any respond, you can use that server!

---

## 🔍 Quick Diagnostic Script

Run this to find your MySQL server:

```powershell
# Test legacy MySQL servers
Write-Host "Testing MySQL Connections..." -ForegroundColor Yellow
Write-Host ""

$servers = @(
    @{Name="ILV Server"; Host="10.100.100.20"; Port=3306},
    @{Name="FTM Server"; Host="10.50.1.22"; Port=3306},
    @{Name="HRIS Domain"; Host="hris.int.padmatirtagroup.com"; Port=3306},
    @{Name="Localhost"; Host="localhost"; Port=3306}
)

foreach ($server in $servers) {
    Write-Host "Testing $($server.Name) ($($server.Host):$($server.Port))..." -NoNewline
    $result = Test-NetConnection -ComputerName $server.Host -Port $server.Port -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($result) {
        Write-Host " ✓ ACCESSIBLE" -ForegroundColor Green
    } else {
        Write-Host " ✗ Not accessible" -ForegroundColor Red
    }
}
```

---

## 📝 Recommended: Ask Your IT Team

**Questions to ask:**

1. "Where is the MySQL `dashboard_hris` database hosted?"
2. "What is the IP address or hostname of the MySQL server?"
3. "Can this Windows Server connect to that MySQL server?"
4. "What are the correct MySQL credentials for the HRIS application?"
5. "Should I install MySQL locally or use a remote server?"

---

## 🎯 Based on Legacy Config

Your PHP legacy system uses:
```
'mysql_hris' => array(
    'host' => 'localhost',  // OR 'hris.int.padmatirtagroup.com'
    'port' => '3306',
    'database' => 'dashboard_hris',
    'username' => 'it',
    'password' => 'padm4.4',
)
```

**This suggests two possibilities:**

1. **If legacy PHP runs on THIS server** → Install MySQL locally
2. **If legacy PHP runs on ANOTHER server** → Use remote MySQL connection

---

## ✅ Once MySQL is Accessible

After you connect to the correct MySQL server:

1. **Run the setup script:**
```powershell
mysql -h YOUR_MYSQL_HOST -u it -p dashboard_hris < setup_database.sql
```

2. **Restart your Next.js app** (Ctrl+C, then `npm run dev`)

3. **Test login** at http://localhost:3000
   - Username: admin
   - Password: admin123

---

## 🔒 Security Note

Your configuration is **CORRECT** for organizational policy:
- ✅ Users are in MySQL (NOT in MSSQL)
- ✅ MSSQL is only for legacy HRIS data
- ✅ Authentication uses MySQL
- ✅ User table in `dashboard_hris` (MySQL)

**This complies with your requirements!**

---

## 🚀 Next Steps for You

1. **Find out where MySQL is hosted** (ask IT team or check where legacy PHP connects)
2. **Update `.env.local`** with correct MySQL host
3. **Test connection** to MySQL server
4. **Run setup script** on that MySQL server
5. **Login should work!**

---

**The configuration is correct - we just need to connect to the right MySQL server!**

---

*MySQL Connection Fix Guide*  
*HRIS v2 - Organizational Policy Compliant*  
*November 4, 2025*

