# Login Error Analysis & Diagnostic Guide

## 🔍 Current Login Flow

### 1. Login Request Flow
```
Browser → POST /api/auth/login → route.ts
  ↓
verifyLegacyUser() → lib/auth.ts
  ↓
findLegacyUser() → lib/auth.ts
  ↓
getMysqlPool() → lib/db/mysql.ts
  ↓
MySQL Connection → mysql_hris database
  ↓
Query: SELECT * FROM user WHERE username = ?
```

### 2. Password Verification
```
User Input Password
  ↓
MD5(password) → hash
  ↓
MD5(scrambler + hash + scrambler) → legacy_hash
  ↓
Compare with database password
```

---

## ❌ Common Login Errors

### Error 1: ECONNREFUSED
**Symptom:** `code: 'ECONNREFUSED'`  
**Cause:** MySQL server not running  
**Solution:** Start MySQL service

### Error 2: Missing Environment Variables
**Symptom:** `Missing required environment variables: MYSQL_HOST, ...`  
**Cause:** `.env.local` not loaded or missing variables  
**Solution:** Verify `.env.local` exists and has all required vars

### Error 3: Access Denied
**Symptom:** `Access denied for user 'it'@'localhost'`  
**Cause:** Wrong MySQL credentials  
**Solution:** Check MySQL username/password in `.env.local`

### Error 4: Unknown Database
**Symptom:** `Unknown database 'dashboard_hris'`  
**Cause:** Database doesn't exist  
**Solution:** Create database: `CREATE DATABASE dashboard_hris;`

### Error 5: Table Doesn't Exist
**Symptom:** `Table 'dashboard_hris.user' doesn't exist`  
**Cause:** User table not created  
**Solution:** Run `setup_database.sql`

### Error 6: Invalid Credentials
**Symptom:** `Kredensial tidak valid` (401 response)  
**Cause:** User not found OR password hash mismatch  
**Solution:** Check user exists and password hash is correct

---

## 🔧 Diagnostic Steps

### Step 1: Check Environment Variables
```typescript
// In lib/env.ts - verify these are loaded:
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=dashboard_hris
MYSQL_USER=it
MYSQL_PASSWORD=padm4.4
```

### Step 2: Test MySQL Connection
```powershell
# Test direct MySQL connection
mysql -h localhost -P 3306 -u it -ppadm4.4 dashboard_hris

# If successful, you'll see: mysql>
# Then test query:
SELECT * FROM user LIMIT 1;
```

### Step 3: Check User Table Exists
```sql
USE dashboard_hris;
SHOW TABLES LIKE 'user';
SELECT COUNT(*) FROM user;
```

### Step 4: Verify Password Hash Format
The legacy system uses:
```
MD5(scrambler + MD5(password) + scrambler)
Where scrambler = 'PadmaTiRt4'
```

Example for password "admin123":
```javascript
const password = "admin123";
const scrambler = "PadmaTiRt4";
const hash = md5(password); // MD5 of password
const legacy = md5(scrambler + hash + scrambler); // Final hash
```

---

## 🐛 Debugging Code

Add this to `lib/auth.ts` for debugging:

```typescript
async function findLegacyUser(username: string): Promise<LegacyUser | null> {
  try {
    const pool = getMysqlPool();
    console.log('🔍 Searching for user:', username);
    console.log('📊 Pool config:', {
      host: pool.config.host,
      database: pool.config.database,
      user: pool.config.user
    });
    
    const [rows] = await pool.query<LegacyUser[]>(
      'SELECT id_user, username, nama, password FROM user WHERE username = ? LIMIT 1', 
      [username]
    );
    
    console.log('✅ Query result:', rows);
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
}
```

---

## 📋 Login Error Checklist

When analyzing login errors, check:

- [ ] MySQL server is running (port 3306)
- [ ] `.env.local` file exists and is loaded
- [ ] All environment variables are set correctly
- [ ] MySQL credentials are correct (user: it, password: padm4.4)
- [ ] Database `dashboard_hris` exists
- [ ] Table `user` exists in database
- [ ] User record exists in `user` table
- [ ] Password hash format matches legacy system
- [ ] Scrambler value is 'PadmaTiRt4'

---

## 🎯 Expected Behavior

### Successful Login:
1. User submits username/password
2. System queries MySQL `user` table
3. Finds user record
4. Calculates password hash
5. Compares with stored hash
6. If match → Creates JWT token
7. Sets cookie and redirects to dashboard

### Failed Login Scenarios:
1. **MySQL not running** → ECONNREFUSED error
2. **User not found** → Returns null → "Kredensial tidak valid"
3. **Password mismatch** → Returns null → "Kredensial tidak valid"
4. **Database error** → 500 error with stack trace

---

## 🔍 Next Steps for Analysis

1. **Check terminal output** when login is attempted
2. **Look for error messages** in the stack trace
3. **Verify MySQL connection** is working
4. **Check user table** has test data
5. **Test password hash** calculation

---

*Login Error Analysis Guide*  
*HRIS v2*

