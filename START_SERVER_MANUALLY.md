# 🚀 Start Server Manually - Simple Instructions

## ❗ Important

The automated startup didn't work. Please follow these manual steps:

---

## 📝 Simple 5-Step Process

### Step 1: Open PowerShell
- Press `Windows + X` on your keyboard
- Click "Windows PowerShell" or "Terminal"

### Step 2: Go to the Right Folder
Copy and paste this command, then press Enter:
```powershell
cd C:\Users\leo\lab\hris-v2\apps\web
```

### Step 3: Clean Up Old Processes
Copy and paste this command, then press Enter:
```powershell
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
```

### Step 4: Start the Server
Copy and paste this command, then press Enter:
```powershell
npm run dev
```

### Step 5: Wait and Watch
- Keep the terminal window open
- Watch for messages
- Look for "✓ Ready in X.Xs"
- When you see "Ready", go to: **http://localhost:3000**

---

## ✅ What You Should See

### In Terminal:
```
> hris-web@0.1.0 dev
> next dev

  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
  
 ✓ Compiled
 ✓ Ready in 3s
```

### In Browser:
- Open http://localhost:3000
- You should see your HRIS application
- NOT the "Can't reach this page" error

---

## ❌ If You See Errors

### Error: "Cannot find package.json"
**You're in wrong folder!** Go back to Step 2.

### Error: "Port 3000 already in use"
Run this command first:
```powershell
Stop-Process -Name node -Force
```
Then try Step 4 again.

### Error: "Cannot find module"
Run this command:
```powershell
npm install
```
Wait for it to finish, then try Step 4 again.

---

## 🎯 Quick Reference

| Step | Command | What It Does |
|------|---------|--------------|
| 1 | Open PowerShell | Gets you a terminal |
| 2 | `cd C:\Users\leo\lab\hris-v2\apps\web` | Goes to app folder |
| 3 | `Stop-Process -Name node -Force` | Kills old processes |
| 4 | `npm run dev` | Starts the server |
| 5 | Open http://localhost:3000 | Opens your app |

---

## 💡 Tips

1. **Don't close the terminal** - The server runs there
2. **Keep terminal visible** - You'll see useful messages
3. **Wait 10-30 seconds** - Server needs time to start
4. **Refresh browser** if page doesn't load immediately

---

## ✅ You'll Know It's Working When:

1. Terminal says "Ready in X.Xs"
2. Browser shows your app (not an error)
3. No error messages in terminal
4. Port 3000 is responding

---

## 🆘 Still Not Working?

If after following these steps it still doesn't work:

1. Take a screenshot of the terminal (what it says after Step 4)
2. Take a screenshot of the browser error (if any)
3. Share those screenshots

Common issues are usually:
- Wrong folder (Step 2)
- Missing dependencies (run `npm install`)
- Port conflict (kill Node processes)

---

**That's it! Follow the 5 steps and you should be up and running!**

---

*Simple Manual Startup Guide*  
*HRIS v2 Development Server*  
*November 4, 2025*

