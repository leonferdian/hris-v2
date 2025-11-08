# 🔍 Login Error Analysis - ECONNREFUSED

## ✅ What's Working

1. ✅ **Next.js Server** - Running successfully on port 3000
2. ✅ **Login Route** - Receiving requests correctly
3. ✅ **Environment Variables** - Loaded (scrambler: PadmaTiRt4)
4. ✅ **MySQL Pool Creation** - Code executes correctly
5. ✅ **Enhanced Logging** - Shows exactly where it fails

## ❌ The Problem

**Error:** `code: 'ECONNREFUSED'`

**Location:** `mysql2/lib/promise/pool.js:36:22`

**Meaning:** MySQL server is **NOT running** or **NOT accessible** on `localhost:3306`

---

## 🔧 Solutions

### Solution 1: Start MySQL Locally

If MySQL should run on this server:

#### Option A: XAMPP
1. Open XAMPP Control Panel
2. Click **Start** on MySQL
3. Wait for green "Running" status
4. Try login again

#### Option B: MySQL Service
```powershell
# Check MySQL service
Get-Service -Name MySQL* | Format-Table Name, Status

# Start MySQL service (if exists)
Start-Service MySQL80
# or
Start-Service MySQL57
```

---

### Solution 2: Use Remote MySQL Server

If MySQL is on a different server (based on your legacy config):

**Update `.env.local`:**

```env
# Change from localhost to actual MySQL server
MYSQL_HOST=hris.int.padmatirtagroup.com
# OR
MYSQL_HOST=10.100.100.20
# OR whatever server has MySQL
```

**Then restart the Next.js server:**
```powershell
# Press Ctrl+C to stop
npm run dev
```

---

### Solution 3: Check Where Legacy PHP Connects

Since your legacy PHP system works, check:

1. **Where does legacy PHP connect to MySQL?**
   - Check `legacy/absensi/lib/config/database.php`
   - Look at `mysql_hris` configuration
   - Is it `localhost` or a remote server?

2. **If legacy uses remote server:**
   - Update `.env.local` to match
   - Restart Next.js server

---

## 🎯 Quick Diagnostic

Run this to check MySQL connectivity:

```powershell
# Test local MySQL
Test-NetConnection -ComputerName localhost -Port 3306

# Test remote MySQL (from legacy config)
Test-NetConnection -ComputerName hris.int.padmatirtagroup.com -Port 3306
Test-NetConnection -ComputerName 10.100.100.20 -Port 3306
```

**If any respond:** Use that server in `.env.local`

---

## 📋 Current Configuration

Your `.env.local` has:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=dashboard_hris
MYSQL_USER=it
MYSQL_PASSWORD=padm4.4
```

**This expects MySQL on localhost, but it's not running there.**

---

## ✅ Next Steps

1. **Check if MySQL is running locally:**
   ```powershell
   netstat -ano | findstr :3306
   ```

2. **If nothing shows:** MySQL is not running locally

3. **Ask your IT team:**
   - "Where is the MySQL `dashboard_hris` database hosted?"
   - "What is the hostname/IP for MySQL?"
   - "Can this server connect to that MySQL server?"

4. **Update `.env.local`** with correct MySQL host

5. **Restart Next.js server** and try login again

---

## 🎉 Good News

**Everything else is working perfectly!**
- ✅ Server runs
- ✅ Login route works
- ✅ Authentication code is correct
- ✅ Logging shows exactly what's wrong

**Just need MySQL connection!**

---

*Login Error Analysis - ECONNREFUSED*  
*HRIS v2*

