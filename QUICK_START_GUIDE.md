# 🚀 HRIS v2 - Quick Start Guide

## ✅ Setup Complete!

Your HRIS Next.js application is now set up and ready to run!

---

## 📋 What Was Just Done

### 1. ✅ Dependencies Installed
```
✓ Installed 44 new packages
✓ Total: 504 packages
✓ Including: Radix UI Select, Checkbox, Lucide React icons
```

### 2. ✅ Environment Configured
```
✓ Created .env.local from template
✓ Database credentials pre-filled from legacy config
✓ Ready for customization
```

### 3. ✅ Development Server Started
```
✓ Next.js dev server running in background
✓ Should be available at: http://localhost:3000
```

---

## 🌐 Access Your Application

### Open in Browser
```
http://localhost:3000
```

You should see your Next.js application running!

---

## 🗄️ Database Setup (Required Next)

### Step 1: Create Menu System Tables

#### For MySQL:
```bash
# Open MySQL client
mysql -u root -p

# Select database
USE dashboard_hris;

# Run migration (from project root)
source database/migrations/menu_system.sql;

# Verify tables created
SHOW TABLES;
```

#### Expected Tables:
- `tbl_webpages` - Main menu pages
- `tbl_mainmenu` - Main menu items
- `tbl_submenu` - Submenu items
- `tbl_hakmenu_webpage` - User page access
- `tbl_hakmenu_mainmenu` - User main menu access
- `tbl_hakmenu_submenu` - User submenu access

### Step 2: Insert Sample Menu Data

```sql
-- Insert sample webpage
INSERT INTO tbl_webpages (webpage_display, webpage_icon, webpage_link, web_page_case, webpage_acces, web_page_order) 
VALUES ('Dashboard', 'fa fa-dashboard', '/?page=dashboard', 'dashboard', 1, 1);

-- Insert sample main menu
INSERT INTO tbl_mainmenu (id_webpage, mainmenu_display, mainmenu_link, mainmenu_acces, mainmenu_order) 
VALUES (1, 'Master Data', '/?page=master', 1, 1);

-- Insert sample submenu
INSERT INTO tbl_submenu (id_mainmenu, submenu_display, submenu_link, submenu_access, submenu_order) 
VALUES (1, 'Bagian', '/?page=master&module=bagian', 1, 1);
```

### Step 3: Create Test User Access

```sql
-- Grant access to all menus for user ID 1
INSERT INTO tbl_hakmenu_webpage (id_user, id_webpage) 
SELECT 1, id_webpages FROM tbl_webpages;

INSERT INTO tbl_hakmenu_mainmenu (id_user, id_mainmenu) 
SELECT 1, idmain_menu FROM tbl_mainmenu;

INSERT INTO tbl_hakmenu_submenu (id_user, id_submenu) 
SELECT 1, id_submenu FROM tbl_submenu;
```

---

## 🔑 Environment Variables

Your `.env.local` file is already created. **Update these values** with your actual credentials:

```env
# SQL Server - HRIS
DB_HRIS_HOST=localhost          # Change if remote
DB_HRIS_PORT=1433
DB_HRIS_DATABASE=db_hris
DB_HRIS_USERNAME=hris1          # Your SQL Server username
DB_HRIS_PASSWORD=P4dma_hris     # Your SQL Server password

# MySQL - HRIS Dashboard
DB_MYSQL_HRIS_HOST=localhost    # Change if remote
DB_MYSQL_HRIS_PORT=3306
DB_MYSQL_HRIS_DATABASE=dashboard_hris
DB_MYSQL_HRIS_USERNAME=it       # Your MySQL username
DB_MYSQL_HRIS_PASSWORD=padm4.4  # Your MySQL password

# JWT Secret (CHANGE THIS!)
JWT_SECRET=generate-a-secure-random-string-here

# NextAuth Secret (CHANGE THIS!)
NEXTAUTH_SECRET=generate-another-secure-random-string-here
```

### Generate Secure Secrets

**PowerShell:**
```powershell
# Generate random secrets
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

**Online Tool:**
```
https://generate-secret.vercel.app/32
```

---

## 🧪 Test the Application

### 1. Check Development Server
```
Open: http://localhost:3000
```

### 2. Test Available Routes

#### Dashboard
```
http://localhost:3000/dashboard
```

#### Master Data (12 modules)
```
http://localhost:3000/master/bagian
http://localhost:3000/master/departemen
http://localhost:3000/master/jabatan
... (and 9 more)
```

#### Employee Management
```
http://localhost:3000/karyawan/list
http://localhost:3000/karyawan/tambah
http://localhost:3000/karyawan/detail/[id]
```

#### Attendance
```
http://localhost:3000/absensi/list
http://localhost:3000/absensi/checkin-checkout
http://localhost:3000/absensi/validasi
```

#### Leave Management
```
http://localhost:3000/cuti/pengajuan
http://localhost:3000/cuti/approval
```

#### Recruitment
```
http://localhost:3000/recruitment/applicants
http://localhost:3000/recruitment/process
```

#### Performance
```
http://localhost:3000/performance/assessment
```

#### Reports
```
http://localhost:3000/report/attendance
http://localhost:3000/report/leave
```

#### Administration
```
http://localhost:3000/admin/users
http://localhost:3000/admin/menu-access
```

#### Activity
```
http://localhost:3000/activity/tasks
```

#### Payroll
```
http://localhost:3000/payroll
http://localhost:3000/payroll/create-payroll
http://localhost:3000/payroll/master-komponen-gaji
... (and 8 more)
```

---

## 🔧 Common Commands

### Development
```bash
# Start dev server
cd apps/web
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

### Check Server Status
```bash
# See running processes
Get-Process -Name node

# Kill dev server (if needed)
Stop-Process -Name node -Force
```

---

## 🐛 Troubleshooting

### Dev Server Not Starting
```bash
# Kill existing node processes
Stop-Process -Name node -Force

# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install

# Restart dev server
npm run dev
```

### Port 3000 Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or start on different port
$env:PORT=3001; npm run dev
```

### Database Connection Issues
```bash
# Test SQL Server connection
sqlcmd -S localhost -U hris1 -P P4dma_hris

# Test MySQL connection
mysql -h localhost -u it -p dashboard_hris
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 📚 Next Steps

### 1. Implement Authentication ⚠️ IMPORTANT
Currently, the application has no authentication. You need to implement:

#### Option A: NextAuth.js (Recommended)
```bash
cd apps/web
npm install next-auth

# Create auth configuration
# File: app/api/auth/[...nextauth]/route.ts
```

#### Option B: Custom Auth
```bash
# Create login page
# File: app/login/page.tsx

# Create middleware
# File: middleware.ts

# Protect routes
# Add authentication checks
```

### 2. Connect API Routes to Database
Each API route in `apps/web/app/api/` needs to:
- ✅ Import database connection from `@/lib/db`
- ✅ Implement actual queries
- ✅ Add error handling
- ✅ Add validation
- ✅ Test CRUD operations

### 3. Add Validation
```bash
# Install validation library
npm install zod

# Add to API routes and forms
```

### 4. Test All Modules
Go through each module and test:
- ✅ Page loads
- ✅ Data fetching works
- ✅ Create operations work
- ✅ Update operations work
- ✅ Delete operations work
- ✅ Search/filter works

### 5. Production Preparation
```bash
# Build for production
npm run build

# Test production build
npm start

# Check for errors
npm run lint
npx tsc --noEmit
```

---

## 📊 Application Structure

```
apps/web/
├── app/
│   ├── (app)/              # Main application (needs auth)
│   │   ├── layout.tsx      # With sidebar
│   │   ├── dashboard/      # Dashboard
│   │   ├── master/         # Master data (12 modules)
│   │   ├── karyawan/       # Employee (6 pages)
│   │   ├── absensi/        # Attendance (3 pages)
│   │   ├── cuti/           # Leave (2 pages)
│   │   ├── recruitment/    # Recruitment (2 pages)
│   │   ├── performance/    # Performance
│   │   ├── report/         # Reports (2 pages)
│   │   ├── admin/          # Admin (2 pages)
│   │   └── activity/       # Activity
│   ├── api/                # API routes (44 endpoints)
│   └── payroll/            # Payroll (11 modules)
├── components/
│   ├── layout/             # Layout components
│   ├── master/             # Master data template
│   ├── payroll/            # Payroll components
│   └── ui/                 # UI components (15+)
└── lib/
    ├── db/                 # Database layer
    └── utils.ts            # Utilities
```

---

## ✅ Checklist

### Setup (DONE)
- [x] Dependencies installed
- [x] Environment file created
- [x] Dev server started

### Database (TODO)
- [ ] Run menu_system.sql migration
- [ ] Insert sample menu data
- [ ] Create test user access
- [ ] Test database connections

### Authentication (TODO)
- [ ] Install NextAuth.js or create custom auth
- [ ] Create login page
- [ ] Protect routes with middleware
- [ ] Test authentication flow

### API Integration (TODO)
- [ ] Connect API routes to database
- [ ] Test all CRUD operations
- [ ] Add error handling
- [ ] Add validation

### Testing (TODO)
- [ ] Test all 43 pages
- [ ] Test all API endpoints
- [ ] Test database operations
- [ ] Test user flows

### Production (TODO)
- [ ] Update environment variables
- [ ] Build for production
- [ ] Set up hosting
- [ ] Configure SSL
- [ ] Set up backups

---

## 🎯 Quick Wins

### 1. See Your App Running (5 minutes)
```
1. Open http://localhost:3000
2. Navigate through pages
3. See modern UI in action
```

### 2. Test a Module (10 minutes)
```
1. Pick a module (e.g., Master Data)
2. Open the page
3. Check UI rendering
4. Test responsiveness
```

### 3. Connect One API (30 minutes)
```
1. Choose simple module (e.g., Dashboard)
2. Connect to database
3. Fetch real data
4. Display on page
```

---

## 📞 Support

### Documentation Files
- `COMPLETE_CONVERSION_SUMMARY.md` - Full conversion details
- `FINAL_CHECKLIST.md` - Implementation checklist
- `PROJECT_COMPLETION_REPORT.md` - Project summary
- `DATABASE_SETUP.md` - Database setup guide
- `DATABASE_INTEGRATION.md` - Integration guide
- `HRIS_FINAL_IMPLEMENTATION_GUIDE.md` - Implementation guide

### Key Files to Read
1. Start with this file (QUICK_START_GUIDE.md)
2. Then read FINAL_CHECKLIST.md
3. Then DATABASE_SETUP.md for database setup
4. Then HRIS_FINAL_IMPLEMENTATION_GUIDE.md for details

---

## 🎉 You're Ready!

Your HRIS v2 system is now running in development mode!

**Current Status:**
- ✅ All 14 modules converted
- ✅ Dependencies installed
- ✅ Environment configured
- ✅ Dev server running
- ⏳ Database setup needed
- ⏳ Authentication needed
- ⏳ API integration needed

**Next Priority:**
1. Set up database tables (5-10 minutes)
2. Implement authentication (1-2 hours)
3. Connect first API route (30 minutes)

---

*Last Updated: November 4, 2025*  
*HRIS v2 - Next.js Application*  
*Status: Development Server Running ✅*

