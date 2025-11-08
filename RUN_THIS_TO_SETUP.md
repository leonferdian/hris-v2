# 🚀 Complete Database Setup Instructions

## 📋 What You Need to Do

Follow these steps in order:

---

## Step 1: Start MySQL in XAMPP

1. Open **XAMPP Control Panel**
2. Click **Start** on MySQL
3. Wait for green "Running" status

---

## Step 2: Run Database Setup Script

### Option A: Using MySQL Command Line

```powershell
# Navigate to project root
cd C:\Users\leo\lab\hris-v2

# Run the setup script
mysql -u root -p < setup_database.sql

# When prompted for password, press Enter (or enter your MySQL root password)
```

### Option B: Using phpMyAdmin

1. Open http://localhost/phpmyadmin
2. Click "Import" tab
3. Choose file: `C:\Users\leo\lab\hris-v2\setup_database.sql`
4. Click "Go" button
5. Wait for success message

### Option C: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to localhost
3. File → Run SQL Script
4. Select `setup_database.sql`
5. Click "Run"

---

## Step 3: Verify Database Setup

```powershell
# Connect to MySQL
mysql -u root -p

# Switch to database
USE dashboard_hris;

# Check if user table exists
SHOW TABLES;

# Verify test user was created
SELECT username, nama, email FROM user;

# You should see:
# username: admin
# nama: Administrator
# email: admin@hris.local

# Exit
exit;
```

---

## Step 4: Test Login

1. Go to http://localhost:3000
2. **Username:** `admin`
3. **Password:** `admin123`
4. Click "Sign In"
5. Should redirect to dashboard! 🎉

---

## ✅ What the Script Does

The `setup_database.sql` script will:

1. ✅ Create `dashboard_hris` database
2. ✅ Create `user` table for authentication
3. ✅ Create menu system tables
4. ✅ Insert test user (username: admin, password: admin123)
5. ✅ Insert sample menu structure
6. ✅ Grant full menu access to admin user

---

## 🔍 Troubleshooting

### Error: "Access denied for user"

Try:
```powershell
mysql -u root < setup_database.sql
# No password, just press Enter
```

### Error: "MySQL command not found"

Add MySQL to PATH or use full path:
```powershell
C:\xampp\mysql\bin\mysql -u root -p < setup_database.sql
```

### Error: "Can't connect to MySQL server"

- Make sure MySQL is running in XAMPP (green status)
- Check port 3306 is listening: `netstat -ano | findstr :3306`

---

## 📊 Database Structure Created

### Tables:
- `user` - User authentication
- `tbl_webpages` - Main menu pages
- `tbl_mainmenu` - Main menu items
- `tbl_submenu` - Submenu items
- `tbl_hakmenu_webpage` - User page access
- `tbl_hakmenu_mainmenu` - User main menu access
- `tbl_hakmenu_submenu` - User submenu access

### Test Users:
| Username | Password | Email | Role |
|----------|----------|-------|------|
| admin | admin123 | admin@hris.local | Administrator |
| leonard.ferdian@padmatirtagroup.com | password | leonard.ferdian@padmatirtagroup.com | Administrator |

---

## 🎯 After Setup Complete

1. ✅ MySQL is running
2. ✅ Database created
3. ✅ Tables created
4. ✅ Test user added
5. ✅ Menu structure ready

**Now you can login!**

Go to: http://localhost:3000
- Username: `admin`
- Password: `admin123`

---

## 💡 Quick Command Summary

```powershell
# 1. Start from project root
cd C:\Users\leo\lab\hris-v2

# 2. Run setup (Option 1: no password)
C:\xampp\mysql\bin\mysql -u root < setup_database.sql

# 2. OR Run setup (Option 2: with password)
C:\xampp\mysql\bin\mysql -u root -p < setup_database.sql

# 3. Verify it worked
C:\xampp\mysql\bin\mysql -u root -e "USE dashboard_hris; SELECT * FROM user;"

# 4. Your app is already running - just refresh browser!
```

---

## 🎉 Success Indicators

You'll know it worked when:
- [ ] Script runs without errors
- [ ] You see "Database setup complete!" message
- [ ] Login page accepts admin/admin123
- [ ] You're redirected to dashboard
- [ ] No more ECONNREFUSED errors

---

## 🆘 Still Having Issues?

**Most Common Problems:**

1. **MySQL not running** → Check XAMPP, start MySQL
2. **Wrong MySQL path** → Use full path: `C:\xampp\mysql\bin\mysql`
3. **Permission denied** → Run as administrator
4. **Port 3306 in use** → Stop other MySQL instances

---

**Run the setup script now and then try logging in!** 🚀

---

*Complete Database Setup Guide*  
*HRIS v2 - November 4, 2025*

