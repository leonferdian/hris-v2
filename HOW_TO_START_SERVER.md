# 🚀 How to Start the Development Server

## ❌ Common Error: Wrong Directory

### The Problem
If you see this error:
```
npm error path C:\Users\leo\lab\hris-v2\package.json
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
```

**You're in the wrong directory!**

---

## ✅ Correct Way to Start the Server

### Step 1: Navigate to the Correct Directory
```bash
cd C:\Users\leo\lab\hris-v2\apps\web
```

### Step 2: Start the Development Server
```bash
npm run dev
```

### Step 3: Open Browser
```
http://localhost:3000
```

---

## 📁 Directory Structure Explanation

```
C:\Users\leo\lab\hris-v2\              ← Root (NO package.json here)
├── apps/
│   └── web/                           ← Next.js App (package.json HERE!)
│       ├── package.json               ← This is what npm needs
│       ├── app/                       ← Your application code
│       ├── components/                ← Your components
│       └── lib/                       ← Your libraries
├── legacy/                            ← Old PHP code (reference)
├── database/                          ← SQL migrations
└── [documentation files]              ← .md guides
```

**Important**: The Next.js application lives in `apps/web/`, not in the root directory!

---

## 🔧 Quick Commands Reference

### Start Server (Correct Way)
```bash
# Always run from apps/web directory
cd C:\Users\leo\lab\hris-v2\apps\web
npm run dev
```

### Stop Server
```bash
# Press Ctrl+C in the terminal
# OR kill all node processes:
Stop-Process -Name node -Force
```

### Restart Server
```bash
# Stop the server first (Ctrl+C)
# Then start again:
npm run dev
```

### Check if Server is Running
```bash
# Check for node processes
Get-Process -Name node

# Check port 3000
netstat -ano | findstr :3000
```

---

## 🎯 Server Status Indicators

### ✅ Server Running Successfully
You should see output like:
```
  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.5s
```

### ❌ Server Failed to Start
Common issues:
1. **Wrong directory** - Navigate to `apps/web` first
2. **Port in use** - Kill existing process or use different port
3. **Missing dependencies** - Run `npm install`
4. **Syntax errors** - Check terminal for error messages

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"
```bash
# Reinstall dependencies
cd C:\Users\leo\lab\hris-v2\apps\web
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue: "Port 3000 already in use"
```bash
# Option 1: Kill process on port 3000
netstat -ano | findstr :3000
# Note the PID number, then:
taskkill /PID <PID_NUMBER> /F

# Option 2: Use different port
$env:PORT=3001
npm run dev
```

### Issue: "ENOENT: no such file or directory"
```bash
# Make sure you're in the correct directory
cd C:\Users\leo\lab\hris-v2\apps\web
# Verify package.json exists:
Test-Path package.json
# Should return: True
```

### Issue: Browser shows "Can't reach this page"
**Possible causes:**
1. Server not started yet (wait 10-20 seconds)
2. Server crashed (check terminal for errors)
3. Wrong URL (use `http://localhost:3000`)

**Solution:**
```bash
# Check if server is running
netstat -ano | findstr :3000

# If nothing shows, server is not running
# Start it again:
cd C:\Users\leo\lab\hris-v2\apps\web
npm run dev
```

---

## 📝 Step-by-Step First Time Setup

### 1. Open PowerShell/Terminal

### 2. Navigate to Project
```bash
cd C:\Users\leo\lab\hris-v2
```

### 3. Navigate to Web App
```bash
cd apps\web
```

### 4. Verify You're in Right Place
```bash
# Should show: True
Test-Path package.json
```

### 5. Install Dependencies (if not done)
```bash
npm install
```

### 6. Start Development Server
```bash
npm run dev
```

### 7. Wait for "Ready" Message
Look for:
```
✓ Ready in X.Xs
```

### 8. Open Browser
```
http://localhost:3000
```

---

## 🎨 What You Should See

### Terminal Output
```
PS C:\Users\leo\lab\hris-v2\apps\web> npm run dev

> hris-web@0.1.0 dev
> next dev

  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.5s
```

### Browser
- Modern, clean interface
- Sidebar navigation (if implemented)
- Dashboard or landing page
- No "Can't reach this page" error

---

## 💡 Pro Tips

### Tip 1: Keep Terminal Open
Don't close the terminal window - the server runs there and shows useful logs.

### Tip 2: Watch for Errors
The terminal will show compilation errors and warnings. Read them!

### Tip 3: Auto-Reload is Enabled
Save any file → Browser automatically refreshes. No need to restart server.

### Tip 4: Check .env.local
If you see database connection errors, check your `.env.local` file has correct credentials.

### Tip 5: Use Multiple Terminals
- Terminal 1: Run dev server (`npm run dev`)
- Terminal 2: Run other commands (git, npm install, etc.)

---

## 🚀 Quick Start Checklist

Every time you want to start working:

- [ ] Open terminal
- [ ] `cd C:\Users\leo\lab\hris-v2\apps\web`
- [ ] `npm run dev`
- [ ] Wait for "Ready" message
- [ ] Open `http://localhost:3000`
- [ ] Start coding!

---

## 📞 Still Having Issues?

### Check These Files
1. `apps/web/package.json` - Should exist
2. `apps/web/.env.local` - Should exist
3. `apps/web/node_modules/` - Should exist (if not, run `npm install`)

### Verify Installation
```bash
cd C:\Users\leo\lab\hris-v2\apps\web

# Check Node version
node --version
# Should show: v24.11.0 or similar

# Check npm version  
npm --version
# Should show: 11.6.1 or similar

# List installed packages
npm list --depth=0
# Should show 504 packages
```

### Last Resort: Clean Install
```bash
cd C:\Users\leo\lab\hris-v2\apps\web

# Remove everything
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item package-lock.json

# Reinstall
npm install

# Start server
npm run dev
```

---

## ✅ Success Indicators

You know everything is working when:
1. ✅ Terminal shows "Ready in X.Xs"
2. ✅ `netstat -ano | findstr :3000` shows listening process
3. ✅ Browser shows your application (not error page)
4. ✅ No error messages in terminal
5. ✅ Changes to files trigger auto-reload

---

## 🎉 You're Ready!

Once you see the "Ready" message and the browser shows your app, you're all set to develop!

**Remember**: Always run `npm run dev` from `C:\Users\leo\lab\hris-v2\apps\web` directory!

---

*Quick Reference Guide*  
*HRIS v2 Development Server*  
*Updated: November 4, 2025*

