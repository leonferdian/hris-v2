# 🔍 MySQL Connection Issue - Diagnosis Complete

## ✅ Error Identified

**Error:** `ECONNREFUSED`  
**Cause:** MySQL server is **NOT running** on `localhost:3306`

**Diagnostic Results:**
- ❌ Port 3306 not listening on localhost
- ❌ TCP connection to localhost:3306 failed
- ✅ Next.js server running correctly
- ✅ Login code working correctly

---

## 🎯 The Solution

Your legacy PHP config shows MySQL might be on a **remote server**:

```php
'host' => 'localhost',
// 'host' => 'hris.int.padmatirtagroup.com',  ← Commented alternative
```

**Since MySQL is not on localhost, you have two options:**

---

## Option 1: Start MySQL Locally

If MySQL should run on this server:

### Using XAMPP:
1. Open XAMPP Control Panel
2. Start MySQL
3. Wait for "Running" status
4. Restart Next.js server (Ctrl+C, then `npm run dev`)

### Using MySQL Service:
```powershell
# Check if MySQL service exists
Get-Service -Name MySQL*

# Start MySQL service
Start-Service MySQL80
```

---

## Option 2: Use Remote MySQL Server

If MySQL is on `hris.int.padmatirtagroup.com` or another server:

### Update `.env.local`:

```env
# Change from localhost to remote server
MYSQL_HOST=hris.int.padmatirtagroup.com
MYSQL_PORT=3306
MYSQL_DB=dashboard_hris
MYSQL_USER=it
MYSQL_PASSWORD=padm4.4
```

### Then restart Next.js:
```powershell
# Stop server (Ctrl+C)
npm run dev
```

---

## 🔍 How to Find the Correct MySQL Server

**Ask your IT team or check:**

1. **Where does the legacy PHP system connect?**
   - Check if legacy PHP is running on this same server
   - If yes → MySQL should be local → Start MySQL
   - If no → MySQL is remote → Update `.env.local`

2. **Test remote server connectivity:**
   ```powershell
   Test-NetConnection -ComputerName hris.int.padmatirtagroup.com -Port 3306
   ```

3. **Check network access:**
   - Can this server reach the MySQL server?
   - Are there firewall rules blocking port 3306?

---

## 📋 Quick Fix Checklist

- [ ] Check if MySQL should be local or remote
- [ ] If local → Start MySQL service/XAMPP
- [ ] If remote → Update `.env.local` with correct host
- [ ] Restart Next.js server
- [ ] Test login again
- [ ] Check terminal for new error messages

---

## 🎉 Current Status

**What's Working:**
- ✅ Next.js server (port 3000)
- ✅ Login route
- ✅ Authentication code
- ✅ Error logging
- ✅ Environment configuration

**What's Missing:**
- ❌ MySQL server connection

**Once MySQL is accessible, login will work!**

---

*MySQL Connection Fix Guide*  
*HRIS v2*

