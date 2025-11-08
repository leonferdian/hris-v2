# Legacy HRIS System Analysis & Migration Updates

## 📋 Legacy System Architecture (from C:\Users\leo\xampp\htdocs\_hris\absensi)

### Menu System (Database-Driven)

The legacy system uses a **dynamic, role-based menu system** stored in MySQL database:

#### Database Tables:
1. **`tbl_webpages`** - Main menu pages (Dashboard, Master, Karyawan, etc.)
2. **`tbl_mainmenu`** - Sub-menus under each webpage
3. **`tbl_submenu`** - Third-level menu items
4. **`tbl_hakmenu_webpage`** - User permissions for webpages
5. **`tbl_hakmenu_mainmenu`** - User permissions for main menus
6. **`tbl_hakmenu_submenu`** - User permissions for sub-menus

#### Key Features:
- ✅ Role-based access control (RBAC)
- ✅ Dynamic menu generation per user
- ✅ Menu ordering (webpage_order, mainmenu_order, submenu_order)
- ✅ Icons per menu item
- ✅ Access flags (webpage_acces, mainmenu_acces, submenu_access)

### Current Implementation vs Legacy

| Feature | Legacy PHP | Current Next.js | Status |
|---------|-----------|-----------------|---------|
| **Menu Source** | Database (MySQL) | Static array | ⚠️ Needs update |
| **Access Control** | User-based RBAC | None | ⚠️ Needs implementation |
| **Menu Order** | Database-driven | Static order | ⚠️ Needs update |
| **Icons** | Database field | Hardcoded | ⚠️ Needs update |
| **Multi-level** | 3 levels (page/main/sub) | 2 levels | ⚠️ Needs enhancement |

---

## 🔄 Required Updates

### 1. Database Schema for Menu System

Create these tables in SQL Server:

```sql
-- Web Pages (Top Level)
CREATE TABLE [dbo].[tbl_webpages] (
    [id_webpages] INT IDENTITY(1,1) PRIMARY KEY,
    [webpage_display] NVARCHAR(100) NOT NULL,
    [webpage_link] NVARCHAR(255),
    [webpage_icon] NVARCHAR(100),
    [web_page_case] NVARCHAR(50),
    [webpage_acces] BIT DEFAULT 1,
    [web_page_order] INT DEFAULT 0,
    [created_at] DATETIME DEFAULT GETDATE()
);

-- Main Menu (Second Level)
CREATE TABLE [dbo].[tbl_mainmenu] (
    [idmain_menu] INT IDENTITY(1,1) PRIMARY KEY,
    [id_webpage] INT NOT NULL,
    [mainmenu_display] NVARCHAR(100) NOT NULL,
    [mainmenu_link] NVARCHAR(255),
    [mainmenu_acces] BIT DEFAULT 1,
    [mainmenu_order] INT DEFAULT 0,
    [created_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([id_webpage]) REFERENCES [tbl_webpages]([id_webpages])
);

-- Sub Menu (Third Level)
CREATE TABLE [dbo].[tbl_submenu] (
    [id_submenu] INT IDENTITY(1,1) PRIMARY KEY,
    [id_mainmenu] INT NOT NULL,
    [submenu_display] NVARCHAR(100) NOT NULL,
    [submenu_link] NVARCHAR(255),
    [submenu_access] BIT DEFAULT 1,
    [submenu_order] INT DEFAULT 0,
    [created_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([id_mainmenu]) REFERENCES [tbl_mainmenu]([idmain_menu])
);

-- User Menu Permissions - Web Pages
CREATE TABLE [dbo].[tbl_hakmenu_webpage] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [id_user] INT NOT NULL,
    [id_webpage] INT NOT NULL,
    [created_at] DATETIME DEFAULT GETDATE(),
    UNIQUE([id_user], [id_webpage])
);

-- User Menu Permissions - Main Menu
CREATE TABLE [dbo].[tbl_hakmenu_mainmenu] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [id_user] INT NOT NULL,
    [id_mainmenu] INT NOT NULL,
    [created_at] DATETIME DEFAULT GETDATE(),
    UNIQUE([id_user], [id_mainmenu])
);

-- User Menu Permissions - Sub Menu
CREATE TABLE [dbo].[tbl_hakmenu_submenu] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [id_user] INT NOT NULL,
    [id_submenu] INT NOT NULL,
    [created_at] DATETIME DEFAULT GETDATE(),
    UNIQUE([id_user], [id_submenu])
);
```

### 2. Seed Data - Populate Initial Menu Structure

```sql
-- Insert Web Pages
INSERT INTO [tbl_webpages] (webpage_display, webpage_link, webpage_icon, web_page_case, webpage_acces, web_page_order) VALUES
('Dashboard', '?page=dashboard', 'fa fa-home', 'dashboard', 1, 1),
('Master', '#', 'fa fa-database', 'master', 1, 2),
('Tambah Karyawan', '#', 'fa fa-user-plus', 'tambah-karyawan', 1, 3),
('Data Pelamar', '#', 'fa fa-file-text', 'data-pelamar', 1, 4),
('Proses Rekrutmen', '#', 'fa fa-user-check', 'proses-rekrutmen', 1, 5),
('Karyawan', '#', 'fa fa-users', 'karyawan', 1, 6),
('Absensi', '#', 'fa fa-clock-o', 'absensi', 1, 7),
('Konfirmasi Kehadiran', '#', 'fa fa-check-square', 'konfirmasi', 1, 8),
('Payroll', '?page=payroll', 'fa fa-money', 'payroll', 1, 9),
('Penilaian Karyawan', '?page=penilaian', 'fa fa-star', 'penilaian', 1, 10),
('Report', '#', 'fa fa-bar-chart', 'report', 1, 11),
('Administrator', '#', 'fa fa-cog', 'administrator', 1, 12);

-- Insert Main Menus (Master Data)
INSERT INTO [tbl_mainmenu] (id_webpage, mainmenu_display, mainmenu_link, mainmenu_acces, mainmenu_order) 
SELECT id_webpages, 'Master Bagian', '?page=master&sub=bagian', 1, 1 FROM [tbl_webpages] WHERE web_page_case = 'master';

INSERT INTO [tbl_mainmenu] (id_webpage, mainmenu_display, mainmenu_link, mainmenu_acces, mainmenu_order) 
SELECT id_webpages, 'Master Departemen', '?page=master&sub=departemen', 1, 2 FROM [tbl_webpages] WHERE web_page_case = 'master';

-- ... (add all 12 master data items)

-- Insert Main Menus (Karyawan)
INSERT INTO [tbl_mainmenu] (id_webpage, mainmenu_display, mainmenu_link, mainmenu_acces, mainmenu_order) 
SELECT id_webpages, 'Data Karyawan', '?page=karyawan&sub=list', 1, 1 FROM [tbl_webpages] WHERE web_page_case = 'karyawan';

-- ... (continue for all modules)
```

---

## 🔧 Updated Next.js Implementation

### 1. Dynamic Menu Component

```typescript
// components/layout/DynamicSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SubMenu {
  id_submenu: number;
  submenu_display: string;
  submenu_link: string;
}

interface MainMenu {
  idmain_menu: number;
  mainmenu_display: string;
  mainmenu_link: string;
  submenus: SubMenu[];
}

interface WebPage {
  id_webpages: number;
  webpage_display: string;
  webpage_link: string;
  webpage_icon: string;
  mainmenus: MainMenu[];
}

export default function DynamicSidebar() {
  const pathname = usePathname();
  const [menuData, setMenuData] = useState<WebPage[]>([]);
  const [openMenus, setOpenMenus] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchUserMenu();
  }, []);

  const fetchUserMenu = async () => {
    try {
      const response = await fetch('/api/menu/user-menu');
      if (response.ok) {
        const data = await response.json();
        setMenuData(data);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const toggleMenu = (id: number) => {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">HRIS System</h1>
        <p className="text-xs text-slate-400">Human Resource Information System</p>
      </div>

      <nav className="p-2">
        {menuData.map((webpage) => {
          const hasChildren = webpage.mainmenus && webpage.mainmenus.length > 0;
          const isOpen = openMenus.has(webpage.id_webpages);

          return (
            <div key={webpage.id_webpages} className="mb-1">
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleMenu(webpage.id_webpages)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      'hover:bg-slate-700',
                      isOpen && 'bg-slate-700'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <i className={`${webpage.webpage_icon} w-5 h-5`} />
                      <span>{webpage.webpage_display}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {webpage.mainmenus.map((mainmenu) => (
                        <div key={mainmenu.idmain_menu}>
                          <Link
                            href={mainmenu.mainmenu_link}
                            className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            {mainmenu.mainmenu_display}
                          </Link>
                          {mainmenu.submenus && mainmenu.submenus.length > 0 && (
                            <div className="ml-4 space-y-1">
                              {mainmenu.submenus.map((submenu) => (
                                <Link
                                  key={submenu.id_submenu}
                                  href={submenu.submenu_link}
                                  className="block px-3 py-2 rounded-md text-xs text-slate-400 hover:bg-slate-700 hover:text-white"
                                >
                                  <i className="fa fa-caret-right mr-2" />
                                  {submenu.submenu_display}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={webpage.webpage_link}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <i className={`${webpage.webpage_icon} w-5 h-5`} />
                  <span>{webpage.webpage_display}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
```

### 2. API Route for User Menu

```typescript
// app/api/menu/user-menu/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { querySqlServer } from '@/lib/db/connection';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get user ID from session/JWT
    const userId = 1; // Replace with actual user ID from auth

    // Fetch user's accessible webpages
    const webpagesQuery = `
      SELECT wp.*
      FROM [dashboard_hris].[dbo].[tbl_webpages] wp
      WHERE wp.id_webpages IN (
        SELECT id_webpage 
        FROM [dashboard_hris].[dbo].[tbl_hakmenu_webpage] 
        WHERE id_user = @userId
      )
      AND wp.webpage_acces = 1
      ORDER BY wp.web_page_order ASC
    `;

    const webpages = await querySqlServer('mysql_hris', webpagesQuery, { userId });

    // For each webpage, fetch main menus
    const menuData = await Promise.all(
      webpages.recordset.map(async (webpage) => {
        const mainmenusQuery = `
          SELECT mm.*
          FROM [dashboard_hris].[dbo].[tbl_mainmenu] mm
          WHERE mm.id_webpage = @webpageId
          AND mm.idmain_menu IN (
            SELECT id_mainmenu 
            FROM [dashboard_hris].[dbo].[tbl_hakmenu_mainmenu] 
            WHERE id_user = @userId
          )
          AND mm.mainmenu_acces = 1
          ORDER BY mm.mainmenu_order ASC
        `;

        const mainmenus = await querySqlServer('mysql_hris', mainmenusQuery, {
          userId,
          webpageId: webpage.id_webpages,
        });

        // For each main menu, fetch submenus
        const mainmenusWithSubs = await Promise.all(
          mainmenus.recordset.map(async (mainmenu) => {
            const submenusQuery = `
              SELECT sm.*
              FROM [dashboard_hris].[dbo].[tbl_submenu] sm
              WHERE sm.id_mainmenu = @mainmenuId
              AND sm.id_submenu IN (
                SELECT id_submenu 
                FROM [dashboard_hris].[dbo].[tbl_hakmenu_submenu] 
                WHERE id_user = @userId
              )
              AND sm.submenu_access = 1
              ORDER BY sm.submenu_order ASC
            `;

            const submenus = await querySqlServer('mysql_hris', submenusQuery, {
              userId,
              mainmenuId: mainmenu.idmain_menu,
            });

            return {
              ...mainmenu,
              submenus: submenus.recordset,
            };
          })
        );

        return {
          ...webpage,
          mainmenus: mainmenusWithSubs,
        };
      })
    );

    return NextResponse.json(menuData);
  } catch (error) {
    console.error('Error fetching user menu:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}
```

---

## 📝 Migration Steps

### Step 1: Update Database Configuration
The menu system uses the MySQL database (`dashboard_hris`), not the SQL Server (`db_hris`). Update connection:

```typescript
// lib/db/config.ts - Already configured!
mysql_hris: {
  driver: 'mysql' as const,
  host: 'localhost',
  port: 3306,
  database: 'dashboard_hris',
  username: 'it',
  password: 'padm4.4',
}
```

### Step 2: Create Menu Tables
Run the SQL scripts above to create menu tables in MySQL `dashboard_hris`.

### Step 3: Replace Static Sidebar
```typescript
// app/(app)/layout.tsx
import DynamicSidebar from '@/components/layout/DynamicSidebar'; // New dynamic menu

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DynamicSidebar /> {/* Instead of static Sidebar */}
      <main className="flex-1 ml-64 p-6">
        {children}
      </main>
    </div>
  );
}
```

### Step 4: Implement Authentication
Add user session/JWT to track logged-in user for menu permissions.

---

## 🎯 Benefits of Updated System

### Security
✅ **Role-Based Access Control** - Users only see menus they have access to  
✅ **Database-Driven** - Permissions managed centrally  
✅ **Granular Control** - Page, main menu, and submenu level permissions  

### Flexibility
✅ **Dynamic Updates** - Change menus without code deployment  
✅ **User-Specific** - Different users see different menus  
✅ **Easy Management** - Admin interface to manage permissions  

### Scalability
✅ **Supports Unlimited Menus** - No hardcoded limits  
✅ **Multi-Level** - 3-level hierarchy (webpage → mainmenu → submenu)  
✅ **Ordering** - Custom sort order per level  

---

## 📊 Implementation Status

| Component | Status | Priority |
|-----------|--------|----------|
| Database Schema | 📋 Ready to create | HIGH |
| Dynamic Sidebar Component | ✅ Code provided | HIGH |
| User Menu API | ✅ Code provided | HIGH |
| Authentication Integration | ⏳ Pending | HIGH |
| Admin Menu Management | ⏳ Future | MEDIUM |
| Migration Script | ⏳ Pending | MEDIUM |

---

## 🚀 Quick Implementation

```bash
# 1. Create menu tables in MySQL
mysql -u it -p dashboard_hris < menu_schema.sql

# 2. Seed menu data
mysql -u it -p dashboard_hris < menu_seed.sql

# 3. Replace Sidebar component
# Copy DynamicSidebar.tsx to components/layout/

# 4. Update app layout
# Modify app/(app)/layout.tsx to use DynamicSidebar

# 5. Create menu API route
# Copy user-menu/route.ts to app/api/menu/

# 6. Test
npm run dev
```

---

**Status:** Analysis Complete - Ready for Implementation  
**Next Step:** Create menu database tables and implement dynamic sidebar  
**Impact:** High - Enables proper role-based access control matching legacy system

