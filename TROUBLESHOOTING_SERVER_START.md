# 🔧 Troubleshooting: Dev Server Won't Start

## Problem Identified

The Next.js development server is not starting properly. This can be caused by several issues.

---

## ✅ Step-by-Step Solution

### Step 1: Open a Fresh Terminal Window

1. Close ALL existing terminal windows
2. Open a NEW PowerShell window
3. This ensures no cached processes are interfering

### Step 2: Navigate to Correct Directory

```powershell
cd C:\Users\leo\lab\hris-v2\apps\web
```

### Step 3: Verify You're in the Right Place

```powershell
# Should return: True
Test-Path package.json

# Should show the web app directory
Get-Location
```

Expected output:
```
Path
----
C:\Users\leo\lab\hris-v2\apps\web
```

### Step 4: Kill Any Existing Node Processes

```powershell
# Kill all Node processes
Stop-Process -Name node -Force -ErrorAction SilentlyContinue

# Verify they're gone
Get-Process -Name node -ErrorAction SilentlyContinue
# Should return nothing
```

### Step 5: Clean Build Artifacts

```powershell
# Remove Next.js cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Remove TypeScript build info
Remove-Item -Force tsconfig.tsbuildinfo -ErrorAction SilentlyContinue
```

### Step 6: Start Dev Server (FOREGROUND - to see errors)

```powershell
npm run dev
```

**IMPORTANT**: Run this WITHOUT background flag so you can see what's happening!

---

## 🔍 What to Look For

### ✅ Success Looks Like This:

```
> hris-web@0.1.0 dev
> next dev

  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Compiled in 2.5s
 ✓ Ready in 3s
```

### ❌ Common Error Messages

#### Error 1: "Cannot find module"
```
Error: Cannot find module '@/components/providers'
```

**Solution:**
```powershell
# Missing file - create it
# (I already created this, but verify it exists)
Test-Path components\providers.tsx
# Should return True
```

#### Error 2: "Port 3000 is already in use"
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```powershell
# Find and kill process on port 3000
netstat -ano | findstr :3000
# Note the PID (last column), then:
taskkill /PID <PID_NUMBER> /F

# Or use different port:
$env:PORT=3001
npm run dev
```

#### Error 3: Compilation Errors
```
./app/layout.tsx
Error: Module not found
```

**Solution:**
Check the terminal output for the specific file/module causing issues.

#### Error 4: TypeScript Errors
```
Type error: Property 'X' does not exist
```

**Solution:**
These might prevent compilation. Check the error message for details.

---

## 🛠️ Advanced Troubleshooting

### If Still Not Working: Full Clean Reinstall

```powershell
cd C:\Users\leo\lab\hris-v2\apps\web

# 1. Remove all build artifacts
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force tsconfig.tsbuildinfo -ErrorAction SilentlyContinue

# 2. Clean npm cache
npm cache clean --force

# 3. Reinstall dependencies
npm install

# 4. Start dev server
npm run dev
```

---

## 📝 Manual Startup Instructions for You

Since the automated startup didn't work, here's what you should do:

### 1. Open PowerShell Manually

- Press `Windows + X`
- Choose "Windows PowerShell" or "Terminal"

### 2. Navigate and Start

```powershell
# Go to the correct directory
cd C:\Users\leo\lab\hris-v2\apps\web

# Start the server (keep terminal open!)
npm run dev
```

### 3. Watch Terminal Output

- DON'T close the terminal
- Look for "Ready in X.Xs" message
- If you see errors, read them carefully
- Take a screenshot if needed

### 4. Open Browser

Once you see "Ready" message:
```
http://localhost:3000
```

---

## 🔍 Diagnostic Commands

Run these to gather information if still having issues:

```powershell
# Check Node version
node --version
# Should show v24.11.0 or similar

# Check npm version
npm --version
# Should show 11.6.1 or similar

# Check if package.json exists
Test-Path package.json
# Should return True

# List key files
Get-ChildItem -Filter "*.json" | Select-Object Name
# Should show package.json, tsconfig.json

# Check environment file
Test-Path .env.local
# Should return True

# Show Next.js info
npx next info
```

---

## 💡 Common Causes

1. **Wrong Directory**: Must be in `apps/web`, not root
2. **Port Conflict**: Another app using port 3000
3. **Missing Files**: providers.tsx or jwt.ts missing
4. **Corrupted Cache**: `.next` folder causing issues
5. **Module Errors**: Missing dependencies
6. **TypeScript Errors**: Type checking failures

---

## 🎯 What Worked in My Testing

The files are all in place. The most likely issues are:

1. **Background process not showing output** - Run in foreground to see errors
2. **Port already in use** - Kill existing processes
3. **Build cache** - Clear `.next` directory

---

## ✅ Success Checklist

Once running, you should see:
- [ ] Terminal shows "Ready in X.Xs"
- [ ] No error messages in terminal
- [ ] Browser opens to http://localhost:3000
- [ ] Page loads (even if showing login/auth screen)
- [ ] No "Can't reach this page" error

---

## 📞 If You Get Stuck

1. Take a screenshot of the terminal output
2. Look for the FIRST error message
3. Copy the exact error text
4. Check the error message against the common errors above

---

## 🚀 Quick Troubleshooting Script

Copy and run this entire block:

```powershell
# Quick fix script
cd C:\Users\leo\lab\hris-v2\apps\web
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Write-Host "Starting dev server..." -ForegroundColor Green
npm run dev
```

---

*Last Updated: November 4, 2025*  
*HRIS v2 Server Troubleshooting Guide*

