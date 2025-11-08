# Payroll Management System

This is a comprehensive payroll management system built with Next.js 14+ that replaces the legacy PHP-based payroll system.

## Features

### 1. **Create Payroll**
- Generate payroll for selected periods
- Configure payroll generation options (overtime, incentives, BPJS, loans)
- View recent payroll history

**Path:** `/payroll/create-payroll`

### 2. **Realisasi Payroll**
- View and review generated payroll
- Filter by period
- Approve payroll for payment
- Track payroll status (pending, approved, paid)

**Path:** `/payroll/realisasi-payroll`

### 3. **Master Komponen Gaji**
- Manage salary components
- Create allowances (tunjangan) and deductions (potongan)
- Configure component codes and descriptions

**Path:** `/payroll/master-komponen-gaji`

### 4. **Master Skema Gaji**
- Create salary scheme templates
- Configure basic salary and component combinations
- Assign multiple components to schemes

**Path:** `/payroll/master-skema-gaji`

### 5. **Skema Gaji Karyawan**
- Assign salary schemes to employees
- Set effective dates for scheme changes
- Search and filter by employee

**Path:** `/payroll/skema-gaji-karyawan`

### 6. **Set Periode Gaji**
- Configure payroll periods
- Set start date, end date, cutoff, and payment dates
- Activate and close periods

**Path:** `/payroll/set-periode-gaji`

### 7. **Upload Insentif**
- Bulk upload employee incentives via Excel/CSV
- Download template file
- View upload results and validation errors

**Path:** `/payroll/upload-insentif`

### 8. **Potongan BPJS Karyawan**
- Manage BPJS Kesehatan (Health Insurance)
- Manage BPJS Ketenagakerjaan (Employment Insurance)
- Configure employee BPJS deduction amounts
- Bulk upload BPJS data

**Path:** `/payroll/potongan-bpjs-karyawan`

### 9. **Master Toleransi Terlambat**
- Configure late arrival tolerance rules
- Set time ranges and deduction amounts
- Support fixed amount and percentage-based deductions

**Path:** `/payroll/master-toleransi-terlambat`

### 10. **Report by Depo**
- View payroll reports grouped by depot/location
- Compare expenses across locations
- Export to Excel
- Summary statistics and totals

**Path:** `/payroll/report-by-depo`

## Technical Architecture

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **UI Components:** Custom components using Radix UI primitives
- **Styling:** Tailwind CSS
- **State Management:** React Hooks (useState, useEffect)

### API Routes
All API routes follow RESTful conventions and return JSON responses:

```
/api/payroll/
├── create (POST)
├── realization (GET)
│   └── [id]/approve (POST)
├── salary-components (GET, POST)
│   └── [id] (DELETE)
├── salary-schemes (GET, POST)
├── periods (GET, POST)
│   └── [id]/
│       ├── activate (POST)
│       └── close (POST)
├── employee-schemes (GET, POST)
├── upload-incentives (POST)
├── bpjs-deductions (GET, POST)
├── late-tolerances (GET, POST)
└── reports/
    └── by-depo (GET)
```

### Database Integration
The current implementation uses mock data. To connect to a real database:

1. Update the database connection in `apps/web/lib/db/`
2. Create database models/schemas for:
   - `payroll_records`
   - `salary_components`
   - `salary_schemes`
   - `salary_scheme_components`
   - `employee_salary_schemes`
   - `payroll_periods`
   - `incentives`
   - `bpjs_deductions`
   - `late_tolerance_rules`

3. Replace mock data in API routes with actual database queries

## Migration from PHP

### Key Differences

| Feature | PHP (Legacy) | Next.js (New) |
|---------|-------------|---------------|
| Routing | File-based PHP | App Router (RSC) |
| UI | Bootstrap + jQuery | React + Tailwind |
| State | Session + Globals | React State |
| Forms | POST redirects | Client Components |
| API | Inline PHP | API Routes |
| Auth | Session cookies | JWT/NextAuth |

### Migration Checklist

- [x] Create payroll page layouts
- [x] Implement all 10 payroll modules
- [x] Create API route structure
- [x] Add UI components library
- [ ] Connect to database
- [ ] Implement authentication
- [ ] Add role-based access control
- [ ] Excel/CSV parsing for uploads
- [ ] PDF export for reports
- [ ] Email notifications
- [ ] Audit logging

## Getting Started

### Development
```bash
cd apps/web
npm install
npm run dev
```

Visit `http://localhost:3000/payroll` to access the payroll system.

### Environment Variables
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

## File Structure

```
apps/web/
├── app/
│   ├── payroll/
│   │   ├── layout.tsx                      # Payroll layout with navigation
│   │   ├── page.tsx                        # Dashboard with module cards
│   │   ├── create-payroll/page.tsx
│   │   ├── realisasi-payroll/page.tsx
│   │   ├── master-komponen-gaji/page.tsx
│   │   ├── master-skema-gaji/page.tsx
│   │   ├── skema-gaji-karyawan/page.tsx
│   │   ├── set-periode-gaji/page.tsx
│   │   ├── upload-insentif/page.tsx
│   │   ├── potongan-bpjs-karyawan/page.tsx
│   │   ├── master-toleransi-terlambat/page.tsx
│   │   └── report-by-depo/page.tsx
│   └── api/
│       └── payroll/
│           └── [various API routes]
├── components/
│   ├── payroll/
│   │   └── PayrollNav.tsx                  # Sidebar navigation
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── table.tsx
└── lib/
    └── utils.ts                            # Utility functions (formatCurrency, etc.)
```

## Next Steps

1. **Database Integration:** Connect API routes to actual database
2. **Authentication:** Add user authentication and authorization
3. **File Uploads:** Implement Excel/CSV parsing for bulk uploads
4. **PDF Export:** Add report export functionality
5. **Email Notifications:** Send payroll notifications to employees
6. **Testing:** Add unit and integration tests
7. **Performance:** Optimize queries and add caching

## Support

For issues or questions, refer to the main project documentation or contact the development team.

