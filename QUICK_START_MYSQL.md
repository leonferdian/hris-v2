# 🚀 Quick Start: Get MySQL Running

## 🎯 Simple 3-Step Solution

Your app is running perfectly, but MySQL needs to be started!

---

## Step 1: Open XAMPP Control Panel

**Find and open:** `C:\xampp\xampp-control.exe`

Or search "XAMPP" in Windows Start menu

---

## Step 2: Start MySQL

1. Look for **MySQL** in the list
2. Click the **Start** button next to it
3. Wait a few seconds
4. It should show **green** and say "Running"

**Visual Guide:**
```
Module  | Status  | Actions
--------|---------|----------
Apache  | ...     | ...
MySQL   | [START] | Config | Logs  ← Click "Start" here!
```

After starting:
```
Module  | Status         | Actions
--------|----------------|----------
Apache  | ...            | ...
MySQL   | Running (3306) | [Stop] Config Logs  ← Should look like this!
```

---

## Step 3: Refresh Your Browser

1. Go back to http://localhost:3000
2. Press `F5` to refresh
3. Try logging in again

**That's it!** No need to restart your Next.js server.

---

## ✅ What to Expect

### If MySQL Started Successfully:
- Login page will try to connect
- You might see different error (like "user not found")
- This is GOOD! It means database is connecting now

### If Still Seeing ECONNREFUSED:
- Check Step 2 again - MySQL must show "Running"
- Verify port 3306 is shown
- Try closing and reopening XAMPP Control Panel

---

## 🔍 Quick Check: Is MySQL Running?

Open PowerShell and run:
```powershell
netstat -ano | findstr :3306
```

**Should see something like:**
```
TCP    0.0.0.0:3306     0.0.0.0:0     LISTENING     12345
```

**If you see nothing:** MySQL is not running. Go back to Step 1.

---

## 💡 Pro Tip

**Make MySQL start automatically:**

In XAMPP Control Panel:
1. Find MySQL row
2. Check the box next to "Svc" (Service)
3. MySQL will start with Windows automatically

---

## 🆘 Troubleshooting

### "Port 3306 already in use"

Someone else is using that port. Run:
```powershell
netstat -ano | findstr :3306
# Note the PID number, then:
taskkill /PID <PID_NUMBER> /F
```

Then start MySQL in XAMPP again.

### "MySQL Stopped Unexpectedly"

1. Click "Logs" button in XAMPP
2. Look for error messages
3. Common fix: Delete `ibdata1` file (backup first!)

### XAMPP Not Installed?

Download from: https://www.apachefriends.org/

Or use MySQL directly:
```powershell
Start-Service MySQL80
```

---

## ✅ You're Done When...

- [ ] XAMPP shows MySQL as "Running" with green status
- [ ] Port 3306 is listening
- [ ] Browser doesn't show ECONNREFUSED error
- [ ] Login attempts reach the database

---

**Now go start MySQL and try again!** 🚀

---

*Quick MySQL Start Guide*  
*HRIS v2*

