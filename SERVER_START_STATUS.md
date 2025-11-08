# ✅ Server Starting Instructions

## Current Status

You're already in the correct directory: `C:\Users\leo\lab\hris-v2\apps\web`

The `npm run dev` command has been started in the background.

---

## 🔍 What to Do Now

### Option 1: Check if Server Started
Wait 30 seconds, then:
1. Open browser: http://localhost:3000
2. If page loads → Server is running! ✅
3. Try logging in and watch terminal for errors

### Option 2: Start Server Manually (to see output)
If you want to see the server output:

1. **Open a NEW PowerShell window**
2. **Run these commands:**
   ```powershell
   cd C:\Users\leo\lab\hris-v2\apps\web
   npm run dev
   ```
3. **Keep this window open** - you'll see all logs here
4. **Try logging in** at http://localhost:3000
5. **Watch the terminal** for detailed login logs

---

## 📊 What You'll See When Login Fails

The enhanced logging will show:

### MySQL Connection Error:
```
🔐 Login attempt: { identifier: 'admin', hasPassword: true }
🔍 Verifying user credentials...
🔍 Searching for user: admin
📊 MySQL Pool created, querying database...
❌ Database error in findLegacyUser: Error: connect ECONNREFUSED 127.0.0.1:3306
```

### User Not Found:
```
✅ Query executed, rows found: 0
❌ User not found: admin
❌ Invalid credentials for: admin
```

### Password Mismatch:
```
✅ User found: { id: 1, username: 'admin' }
🔐 Password verification: { match: false }
❌ Invalid credentials for: admin
```

---

## 🎯 Next Steps

1. **Check if server is running:** http://localhost:3000
2. **If running:** Try to login and share terminal output
3. **If not running:** Start manually in new terminal window

The server should be starting now. Once it's ready, try logging in and share what you see in the terminal!

---

*Server Start Guide*  
*HRIS v2*

