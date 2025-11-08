# ❌ WRONG DIRECTORY ERROR - FIX THIS NOW!

## 🚨 The Problem You're Having

You're seeing this error:
```
PS C:\Users\leo\lab\hris-v2> npm run dev
npm error code ENOENT
npm error path C:\Users\leo\lab\hris-v2\package.json
npm error enoent Could not read package.json
```

## 🎯 The Exact Issue

Look at your terminal prompt:
```
PS C:\Users\leo\lab\hris-v2>     ← YOU ARE HERE (WRONG!)
```

You need to be here:
```
PS C:\Users\leo\lab\hris-v2\apps\web>     ← YOU NEED TO BE HERE!
```

---

## ✅ THE FIX (Copy These Commands Exactly)

### In your PowerShell, type this FIRST:

```powershell
cd apps\web
```

Then press Enter. Your prompt should change to:
```
PS C:\Users\leo\lab\hris-v2\apps\web>
```

### NOW run:

```powershell
npm run dev
```

---

## 📁 Visual Guide

```
C:\Users\leo\lab\hris-v2\           ← YOU ARE HERE (wrong!)
│
├── apps\
│   └── web\                        ← YOU NEED TO BE HERE!
│       ├── package.json            ← This is what npm is looking for
│       ├── app\
│       ├── components\
│       └── lib\
│
├── legacy\
└── database\
```

---

## 🔍 How to Know You're in the Right Place

After running `cd apps\web`, check:

```powershell
# Your prompt should show:
PS C:\Users\leo\lab\hris-v2\apps\web>

# Test it:
Test-Path package.json
# Should return: True
```

---

## 📝 Complete Step-by-Step

1. **Look at your terminal prompt right now:**
   ```
   PS C:\Users\leo\lab\hris-v2>
   ```

2. **Type this command:**
   ```powershell
   cd apps\web
   ```

3. **Press Enter**

4. **Your prompt should NOW show:**
   ```
   PS C:\Users\leo\lab\hris-v2\apps\web>
   ```

5. **NOW type:**
   ```powershell
   npm run dev
   ```

6. **Press Enter**

7. **Wait for "Ready" message** (10-30 seconds)

8. **Open browser:** http://localhost:3000

---

## 🎬 What You'll See When It Works

### Terminal:
```
PS C:\Users\leo\lab\hris-v2\apps\web> npm run dev

> hris-web@0.1.0 dev
> next dev

  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Compiled
 ✓ Ready in 3s
```

### Browser:
- Go to http://localhost:3000
- You'll see your HRIS application!

---

## ⚠️ Common Mistakes

### Mistake 1: Forgetting to Change Directory
```powershell
# WRONG - Still in root directory
PS C:\Users\leo\lab\hris-v2> npm run dev
❌ Error: Cannot find package.json
```

```powershell
# RIGHT - Changed to web directory first
PS C:\Users\leo\lab\hris-v2> cd apps\web
PS C:\Users\leo\lab\hris-v2\apps\web> npm run dev
✅ Server starts!
```

### Mistake 2: Wrong Path
```powershell
# WRONG
cd web                    ❌
cd app\web               ❌
cd hris-v2\apps\web      ❌
```

```powershell
# RIGHT (from root directory)
cd apps\web              ✅
```

---

## 🆘 Still Having Issues?

### If you see "directory does not exist":

Make sure you're starting from the root:
```powershell
cd C:\Users\leo\lab\hris-v2
cd apps\web
```

### If you see "cannot find path":

Use the full path:
```powershell
cd C:\Users\leo\lab\hris-v2\apps\web
```

---

## ✅ Quick Command to Fix Everything

Copy and paste this ENTIRE block into PowerShell:

```powershell
# Go to correct directory
cd C:\Users\leo\lab\hris-v2\apps\web

# Verify you're in the right place
Write-Host "Current directory:" -ForegroundColor Yellow
Get-Location
Write-Host ""

# Check if package.json exists
if (Test-Path package.json) {
    Write-Host "✓ package.json found!" -ForegroundColor Green
    Write-Host "Starting dev server..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host "✗ package.json NOT found - You're in the wrong directory!" -ForegroundColor Red
}
```

---

## 🎯 Remember This Simple Rule

**ALWAYS start the server from `apps\web` directory!**

```
Wrong: C:\Users\leo\lab\hris-v2>
Right: C:\Users\leo\lab\hris-v2\apps\web>
```

---

*Fix Directory Error Guide*  
*November 4, 2025*

