# Payroll System Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd apps/web
npm install
```

This will install all required dependencies including:
- `@radix-ui/react-slot` - For button component primitives
- `class-variance-authority` - For component variant management
- `clsx` - For conditional class names
- `tailwind-merge` - For merging Tailwind classes

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

### 3. Access Payroll System

Navigate to: `http://localhost:3000/payroll`

You should see the payroll dashboard with 10 module cards.

---

## Troubleshooting

### Issue: Dependencies not installing

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: TypeScript errors

**Solution:**
```bash
# Run type check
npm run build

# Fix any type errors shown
```

### Issue: Module not found errors

**Solution:**
Make sure all required files are present:
- `lib/utils.ts`
- `components/ui/*.tsx`
- `components/payroll/PayrollNav.tsx`

### Issue: Tailwind classes not working

**Solution:**
Ensure `tailwind.config.js` is properly configured and includes:
```js
content: [
  './app/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
],
```

---

## Environment Configuration

### Development

Create `.env.local`:
```env
# Database (when ready)
DATABASE_URL=postgresql://user:password@localhost:5432/hris_v2

# JWT Secret (when auth is implemented)
JWT_SECRET=your-secret-key-here

# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Production

Set environment variables in your hosting platform:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

---

## Testing the Modules

### Manual Testing Checklist

Visit each module and verify:

1. **Payroll Dashboard** (`/payroll`)
   - [ ] All 10 module cards display
   - [ ] Cards are clickable
   - [ ] Icons and descriptions show

2. **Create Payroll** (`/payroll/create-payroll`)
   - [ ] Period selector works
   - [ ] Checkboxes function
   - [ ] Generate button is clickable

3. **Realisasi Payroll** (`/payroll/realisasi-payroll`)
   - [ ] Period filter works
   - [ ] Table displays (even if empty)
   - [ ] Status badges show correctly

4. **Master Komponen Gaji** (`/payroll/master-komponen-gaji`)
   - [ ] Add Component button works
   - [ ] Form displays
   - [ ] Table shows components

5. **Master Skema Gaji** (`/payroll/master-skema-gaji`)
   - [ ] Add Scheme button works
   - [ ] Form fields work
   - [ ] Table displays

6. **Skema Gaji Karyawan** (`/payroll/skema-gaji-karyawan`)
   - [ ] Search box works
   - [ ] Assign button works
   - [ ] Table displays

7. **Set Periode Gaji** (`/payroll/set-periode-gaji`)
   - [ ] Date pickers work
   - [ ] Add Period button works
   - [ ] Status colors display

8. **Upload Insentif** (`/payroll/upload-insentif`)
   - [ ] File selector works
   - [ ] Download template works
   - [ ] Period selector works

9. **Potongan BPJS** (`/payroll/potongan-bpjs-karyawan`)
   - [ ] Search works
   - [ ] Add BPJS button works
   - [ ] Form displays both BPJS types

10. **Master Toleransi Terlambat** (`/payroll/master-toleransi-terlambat`)
    - [ ] Add Rule button works
    - [ ] Number inputs work
    - [ ] Preview shows

11. **Report by Depo** (`/payroll/report-by-depo`)
    - [ ] Period selector works
    - [ ] Summary cards display
    - [ ] Table shows totals

---

## Next Steps After Setup

1. **Review the code structure**
   ```bash
   # View payroll pages
   ls -la app/payroll/
   
   # View API routes
   ls -la app/api/payroll/
   
   # View components
   ls -la components/
   ```

2. **Read the documentation**
   - `app/payroll/README.md` - Module documentation
   - `PAYROLL_MIGRATION_GUIDE.md` - Migration guide
   - `PAYROLL_CONVERSION_SUMMARY.md` - Conversion summary

3. **Plan database integration**
   - Review database schema in migration guide
   - Set up database connection
   - Update API routes to use real data

4. **Implement authentication**
   - Install NextAuth.js or similar
   - Add authentication middleware
   - Protect payroll routes

---

## Development Tips

### Hot Reload
Next.js automatically reloads when you save files. If it doesn't:
```bash
# Restart the dev server
Ctrl+C
npm run dev
```

### Check for Errors
```bash
# TypeScript errors
npm run build

# Linting errors
npm run lint
```

### Component Development
When creating new components:
1. Add to `components/ui/` for reusable UI
2. Add to `components/payroll/` for payroll-specific
3. Use TypeScript interfaces for props
4. Add JSDoc comments

### API Development
When adding new API routes:
1. Create in `app/api/payroll/[module]/route.ts`
2. Use proper HTTP methods (GET, POST, PUT, DELETE)
3. Add error handling
4. Return consistent JSON format
5. Add TypeScript types for request/response

---

## Performance Tips

### Optimize Images
```bash
# Use Next.js Image component
import Image from 'next/image'
```

### Code Splitting
- Pages are automatically code-split
- Use dynamic imports for heavy components:
```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

### Caching
- API routes can use Next.js caching
- Add `revalidate` to API responses
- Use React Query for client-side caching

---

## Deployment Checklist

Before deploying to production:

- [ ] Install all dependencies
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Environment variables set
- [ ] Database connected and migrated
- [ ] Authentication implemented
- [ ] API routes tested
- [ ] All modules tested manually
- [ ] Security review completed
- [ ] Performance optimized

---

## Support

If you encounter issues:

1. Check the console for errors (F12 in browser)
2. Check terminal for server errors
3. Review the documentation files
4. Check Next.js documentation: https://nextjs.org/docs
5. Contact development team

---

## Success! 🎉

If everything is working:
- You should see the payroll dashboard
- All navigation works
- Forms are interactive
- Tables display (with mock data)

You're ready to start integrating with the database and building out the backend functionality!

