### HRIS Monorepo Migration Plan: Architecture, Flow, Docker, and Prompts

This document captures the current structure, proposes a modern React/Next.js TypeScript architecture, preserves the existing MySQL/SQL Server databases, and adds secure auth plus an optional AI assistant. It is designed for local/containerized deployment while keeping folders `absensi` and `payroll` separate.

## 1) Repo Tree (high-level)
- `_hris/`
  - `absensi/` (this workspace)
    - `index.php`, `login.php`, `partials/`, `inc/` (modules), `lib/` (DB/config/libs), `assets/`, `styles/`, `images/`, `crontab/`
    - Notable:
      - `lib/config/database.php` → connections: `mysql_hris`, `mysql_fp`, `mysql_ftm`, `sqlsrv_hris`, `sqlsrv_ci`, `sqlsrv_ilv`
      - `lib/database.php` → `DB::connection()` wrapper (sqlsrv/mysqli)
      - `inc/inc.content.php` → dynamic routing via DB (webpages/mainmenu/submenu)
      - `inc/report/absensi/...` → reporting views and detail pages
      - `crontab/sinkronabsensi.php` → ETL/merge attendance data
  - `payroll/` (referenced by absensi via `../payroll/lib/database2.php`) – separate PHP app and configs (keep separated in migration)

## 2) Current Architecture (summary)
- PHP web app with dynamic includes driven by DB-stored menus/webpages
- MySQL (dashboard_hris, fin_pro, ftm, etc.) and SQL Server (db_hris, db_central_input, db_ilv_padma)
- Session-based auth (custom salted MD5), direct SQL queries, server-side rendered UI (Ace/jQuery)
- Jobs: PHP cron for attendance sync (Linked Server `OPENQUERY` usage)

## 3) Target Architecture (Next.js + TypeScript, containerized)
- Frontend: Next.js 14+ (App Router), TypeScript, React Query, Ant Design (or Chakra), server actions where appropriate
- Backend API: Next.js API routes for new endpoints (can be split to a NestJS service later). Keep legacy PHP apps (`absensi`, `payroll`) running in their own containers until each screen is ported
- Auth: JWT (HttpOnly cookie), login verifies existing salted-MD5 from MySQL `user` table, issues JWT without changing stored passwords. Optional progressive rehash via an extra column or companion table (non-breaking)
- Data Access: New API routes connect to existing databases using Node drivers (mysql2, tedious for SQL Server). No schema changes required
- Jobs: A worker container runs `php crontab/sinkronabsensi.php` on schedule
- Reverse Proxy: Nginx routes `/app` → Next.js, `/absensi` and `/payroll` → PHP-FPM/Apache containers
- AI Assistant: Optional LLM service (Ollama or OpenAI-compatible) + small Next.js API proxy, assistants for report explanations and daily task guidance

## 4) High-Level Flow
1) User hits Next.js frontend at `/app` → JWT-protected routes
2) Login form posts to `/api/auth/login` → verifies salted-MD5 against `dashboard_hris.user` → on success, set JWT cookie
3) Frontend pages fetch via React Query from `/api/...` or proxy to legacy endpoints during phased migration
4) Nginx also serves legacy PHP UIs under `/absensi` and `/payroll` for non-migrated screens
5) Cron container runs sync; APIs and UI read consistent data from existing DBs
6) AI assistant endpoints: `/api/assistant/*` calling local LLM or remote provider

## 5) Security Improvements (non-breaking)
- JWT in HttpOnly + SameSite=Lax cookies; rotate secret via `.env`
- Session fixation protection (regenerate on login), basic rate limit on auth
- Keep original passwords; verify using existing salted MD5 scheme; optional progressive argon2 hash stored in a new column/table when allowed
- Parameterized queries in new API; avoid SQL injection

## 6) Dockerized Setup

### docker-compose.yml (example)
```yaml
version: '3.9'
services:
  nginx:
    image: nginx:1.25
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
    ports:
      - "8080:80"
    depends_on: [nextapp, absensi, payroll]

  nextapp:
    build: ./apps/web
    env_file: ./.env
    environment:
      - NEXT_PUBLIC_APP_URL=http://localhost:8080
    volumes:
      - ./apps/web:/app
    command: npm run dev

  absensi:
    build: ./containers/php-absensi
    env_file: ./.env
    volumes:
      - ../absensi:/var/www/html
    depends_on: []

  payroll:
    build: ./containers/php-payroll
    env_file: ./.env
    volumes:
      - ../payroll:/var/www/html

  cron:
    build: ./containers/php-absensi
    env_file: ./.env
    volumes:
      - ../absensi:/var/www/html
    entrypoint: ["bash","-lc","while true; do php crontab/sinkronabsensi.php; sleep 3600; done"]

  llm:
    image: ghcr.io/jmorganca/ollama:latest
    volumes:
      - ollama:/root/.ollama
    ports:
      - "11434:11434"

volumes:
  ollama:
```

### Nginx vhost (nginx/conf.d/default.conf)
```nginx
server {
  listen 80;
  server_name _;

  location /app/ { proxy_pass http://nextapp:3000/; proxy_set_header Host $host; }
  location /_next/ { proxy_pass http://nextapp:3000; }

  location /absensi/ { proxy_pass http://absensi; }
  location /payroll/ { proxy_pass http://payroll; }
}
```

### PHP containers
- `containers/php-absensi/Dockerfile`
```dockerfile
FROM php:8.2-apache
RUN apt-get update && apt-get install -y gnupg unixodbc-dev libgssapi-krb5-2 && rm -rf /var/lib/apt/lists/*
# SQLSRV drivers
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
 && curl https://packages.microsoft.com/config/debian/12/prod.list > /etc/apt/sources.list.d/mssql-release.list \
 && apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql18 mssql-tools18 \
 && pecl install sqlsrv pdo_sqlsrv \
 && docker-php-ext-enable sqlsrv pdo_sqlsrv mysqli
COPY --chown=www-data:www-data . /var/www/html
```

## 7) Next.js App Structure (apps/web)
```text
apps/web/
  app/
    layout.tsx
    page.tsx
    (auth)/login/page.tsx
    dashboard/page.tsx
    api/
      auth/login/route.ts
      auth/me/route.ts
      reports/[...path]/route.ts  # proxy to legacy when needed
      assistant/chat/route.ts
  lib/
    db/mysql.ts  # mysql2 pool to dashboard_hris
    db/mssql.ts  # tedious/sqlserver connect
    auth.ts      # MD5-compat verify + JWT
  components/
  hooks/
  env.d.ts
```

### Auth bridge (verify legacy salted-MD5 and issue JWT)
```ts
// lib/auth.ts
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { mysqlPool } from './db/mysql';

const SCRAMBLER = 'PadmaTiRt4'; // match legacy

export async function verifyLegacyUser(email: string, password: string) {
  const hash = crypto.createHash('md5').update(password).digest('hex');
  const legacy = crypto.createHash('md5').update(`${SCRAMBLER}${hash}${SCRAMBLER}`).digest('hex');
  const [rows] = await mysqlPool.query('SELECT * FROM user WHERE username=? LIMIT 1', [email]);
  const user = Array.isArray(rows) ? rows[0] : undefined;
  if (!user) return null;
  return user.password === legacy ? user : null;
}

export function issueJwt(user: any) {
  return jwt.sign({ sub: user.id_user, username: user.username, nama: user.nama }, process.env.JWT_SECRET!, { expiresIn: '12h' });
}
```

### API route: login (Next.js 14)
```ts
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { verifyLegacyUser, issueJwt } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await verifyLegacyUser(email, password);
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const token = issueJwt(user);
  const res = NextResponse.json({ ok: true });
  res.cookies.set('auth', token, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
  return res;
}
```

### Legacy proxy (optional during migration)
```ts
// app/api/reports/[...path]/route.ts
export async function GET(_: Request, { params }: { params: { path: string[] } }) {
  const url = 'http://absensi/' + params.path.join('/');
  const resp = await fetch(url, { headers: { 'X-Forwarded-For': 'next' } });
  return new Response(await resp.text(), { headers: { 'content-type': resp.headers.get('content-type') || 'text/html' } });
}
```

### AI Assistant endpoint (Ollama local)
```ts
// app/api/assistant/chat/route.ts
export async function POST(req: Request) {
  const { messages } = await req.json();
  const r = await fetch('http://llm:11434/api/chat', { method: 'POST', body: JSON.stringify({ model: 'llama3', messages }) });
  return new Response(await r.text(), { headers: { 'content-type': 'application/json' } });
}
```

## 8) Environment Variables (.env)
```env
JWT_SECRET=replace-me

# MySQL (unchanged settings)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=dashboard_hris
MYSQL_USER=it
MYSQL_PASSWORD=padm4.4

# SQL Server (unchanged settings)
MSSQL_HOST=localhost
MSSQL_PORT=1433
MSSQL_DB=db_hris
MSSQL_USER=hris1
MSSQL_PASSWORD=P4dma_hris
```

## 9) Migration Strategy
- Phase 1: Containerize legacy (`absensi`, `payroll`), add Next.js shell with JWT login and a couple of read-only dashboards
- Phase 2: Migrate key reports to React; keep deep links to legacy where needed via reverse proxy
- Phase 3: Replace remaining pages gradually; implement prepared statements and caching in new API; add observability

## 10) Prompts and Commands
### Scaffold Next.js TS app
```bash
npm create next-app@latest apps/web --typescript --eslint --app --src-dir --import-alias @/* --tailwind
cd apps/web && npm i @tanstack/react-query jsonwebtoken mysql2 tedious
```

### Run containers
```bash
docker compose up --build
```

### Example Assistant Prompt (for daily task aid)
```
You are the HRIS assistant. Given attendance data and validation rules, suggest actions for missing scans, late arrivals, and leave categories. Provide concise steps and links to the exact report pages under /app and /absensi.
```

## 11) Operational Notes
- IT retains existing domains; Nginx can route `/app`, `/absensi`, `/payroll`
- Cron reliability: log to stdout with timestamps; add alerting later
- Keep passwords as-is; only verification logic is re-implemented in the Next.js API to issue JWTs

---
This blueprint lets you run locally via Docker, keep the existing DBs and legacy apps, and progressively migrate to a modern TypeScript stack with better security and an AI assistant.


