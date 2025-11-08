# 🔴 Database Connection Error - ECONNREFUSED

## 📊 Error Analysis

Your terminal shows:
```
⨯ Error at PromisePool.query
code: 'ECONNREFUSED'
POST /api/auth/login 500 in 10969ms
```

**This means:** The MySQL database server is **not running** or **not accessible**.

---

## ✅ Solutions (Try in Order)

### Solution 1: Start MySQL Server

#### If using XAMPP:
1. Open **XAMPP Control Panel**
2. Find **MySQL** in the list
3. Click **Start** button next to MySQL
4. Wait for it to show green "Running" status

#### If using standalone MySQL:
```powershell
# Check if MySQL service exists
Get-Service -Name MySQL* | Select-Object Name, Status

# Start MySQL service
Start-Service -Name MySQL80  # or MySQL57, check your version
```

#### Verify MySQL is Running:
```powershell
# Test MySQL connection
mysql -u it -p dashboard_hris
# Enter password: padm4.4
```

---

### Solution 2: Check MySQL Credentials

The `.env.local` file has:
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=dashboard_hris
MYSQL_USER=it
MYSQL_PASSWORD=padm4.4
```

**Verify these are correct:**

1. Open MySQL Workbench or phpMyAdmin
2. Try connecting with username: `it` and password: `padm4.4`
3. Check if database `dashboard_hris` exists

---

### Solution 3: Create Database if Missing

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE IF NOT EXISTS dashboard_hris;

-- Create user if doesn't exist
CREATE USER IF NOT EXISTS 'it'@'localhost' IDENTIFIED BY 'padm4.4';

-- Grant permissions
GRANT ALL PRIVILEGES ON dashboard_hris.* TO 'it'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
USE dashboard_hris;
```

---

### Solution 4: Bypass Database for Now (Quick Fix)

If you want to see the app working without database setup, I can create a mock authentication that doesn't require MySQL.

---

## 🔍 Diagnostic Commands

Run these to identify the issue:

### Check if MySQL is Running:
```powershell
# Check MySQL service
Get-Service -Name MySQL* | Format-Table Name, Status, DisplayName -AutoSize

# Check if port 3306 is listening
netstat -ano | findstr :3306
```

### Test MySQL Connection:
```powershell
# Try connecting via command line
mysql -h localhost -P 3306 -u it -ppadm4.4 dashboard_hris
```

### Check XAMPP Status:
```powershell
# If using XAMPP, check if it's installed
Test-Path "C:\xampp\mysql\bin\mysqld.exe"
```

---

## 🎯 Most Likely Cause

Based on the error, the most common causes are:

1. **MySQL not running** (80% likely) ← Check this first!
2. **Wrong credentials** (15% likely)
3. **Database doesn't exist** (5% likely)

---

## ✅ Quick Fix Steps

### Step 1: Start MySQL
```
Open XAMPP Control Panel → Start MySQL
```

### Step 2: Verify It's Running
```powershell
netstat -ano | findstr :3306
# Should show a listening process
```

### Step 3: Test Connection
```powershell
mysql -u it -p
# Enter password: padm4.4
# If successful, you'll see: mysql>
```

### Step 4: Create Database (if needed)
```sql
CREATE DATABASE dashboard_hris;
exit;
```

### Step 5: Restart Your App
```powershell
# In your app terminal, press Ctrl+C
npm run dev
```

### Step 6: Try Login Again
- Go to http://localhost:3000
- Try to login

---

## 🚀 Alternative: Use Mock Auth (No Database)

If you want to quickly see the app working without setting up MySQL, I can:

1. Create a mock authentication module
2. Bypass database login
3. Use hardcoded credentials temporarily

This lets you explore the UI while setting up the database separately.

---

## 📝 Current Status

✅ **Server Running** - Next.js on port 3000  
✅ **Environment Variables** - Configured  
✅ **Login Page** - Loads correctly  
❌ **MySQL Connection** - FAILED (ECONNREFUSED)  
⏳ **Database Setup** - Required  

---

## 💡 What Happens After MySQL Starts

Once MySQL is running, the login will:
1. Connect to database ✅
2. Query user table ✅
3. Verify credentials ✅
4. Create session ✅
5. Redirect to dashboard ✅

---

## 🆘 If MySQL Won't Start

### XAMPP MySQL Issues:
```powershell
# Check if port 3306 is already in use
netstat -ano | findstr :3306

# If something else is using it, kill that process:
taskkill /PID <PID_NUMBER> /F

# Then start MySQL in XAMPP again
```

### Check MySQL Error Log:
```
C:\xampp\mysql\data\mysql_error.log
```

---

## ✅ Success Indicators

You'll know MySQL is working when:
- [ ] XAMPP shows MySQL with green "Running" status
- [ ] `netstat -ano | findstr :3306` shows listening process
- [ ] `mysql -u it -p` connects successfully
- [ ] Login page connects without ECONNREFUSED error

---

## 🎯 Next Step for You

**RIGHT NOW:**
1. Open XAMPP Control Panel
2. Click "Start" on MySQL
3. Wait for green "Running" status
4. Refresh your browser (http://localhost:3000)
5. Try logging in again

The app server is already running correctly - we just need MySQL!

---

*Database Connection Troubleshooting*  
*Updated: November 4, 2025*

