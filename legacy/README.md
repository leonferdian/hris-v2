# Legacy Application Mounts

Place the original PHP sources from `C:\Users\leo\xampp\htdocs\_hris` inside the folders below so the containers can mount them at runtime:

- `legacy/absensi` → copy the contents of `_hris/absensi`
- `legacy/payroll` → copy the contents of `_hris/payroll`

These directories are ignored from source control so the proprietary code remains outside the remaster project. The Docker Compose stack will mount them into `/var/www/html` for the legacy containers.

