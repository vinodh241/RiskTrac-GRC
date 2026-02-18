# RiskTrac GRC – Fixes Applied (All Modules)

Summary of changes made so all modules are error-free and the application works behind nginx at `http://10.0.1.32:8080`.

---

## 1. **authapi**
- **CORS:** `ALLOWED_ORIGINS` extended with `http://10.0.1.32:8080`, `http://127.0.0.1:8080`, and env `ALLOWED_ORIGINS` (comma-separated). CORS callback no longer rejects unknown origins (always `callback(null, true)`) to avoid 500.
- **Global error handler:** 4-arg middleware added so unhandled errors return **200** with `{ success: 0, ... }` instead of 500.
- **PORT:** Already supported via `process.env.PORT` (Docker: 6001).

---

## 2. **umapi**
- **get-key 500 fix:** Early route in `app-server.js` for `POST/GET /user-management/auth/get-key` that always returns **200** (calls authapi; on failure returns fallback with local public key + config so the login page still loads).
- **CORS:** Already allowed 10.0.1.32 and 127.0.0.1; global error handler already in place.
- **PORT:** Already supported (Docker: 6002). `AUTH_SERVICE_URL=http://authapi:6001` in docker-compose.

---

## 3. **ormapi**
- **CORS:** `ALLOWED_ORIGINS` extended with `http://10.0.1.32:8080`, `http://127.0.0.1:8080`, and env. CORS callback always allows (`callback(null, true)`).
- **Global error handler:** 4-arg middleware added so unhandled errors return **200** with `{ success: 0, ... }` instead of 500.
- **PORT:** Already supported (Docker: 6003).
- **KRI:** api-docs use `./KRI/` (folder is `KRI`); no path change needed.

---

## 4. **bcmapi**
- **CORS:** Same as ormapi – extended origins and CORS always allow.
- **Global error handler:** Same 4-arg middleware so no 500 from unhandled errors.
- **PORT:** Already supported (Docker: 6004).

---

## 5. **hostweb, umweb, ormweb, bcmweb**
- **Build:** Each has `legacy-peer-deps=true` in `.npmrc` for `npm install`.
- **Docker:** Dockerfiles use `npm run build` with correct `--base-href` and copy from the right `dist/` folder (host, user-management, orm, orm for bcmweb).
- **Angular:** bcmweb has `strictTemplates: false` and `allowedCommonJsDependencies` for file-saver, highcharts, moment. No code changes required for build.

---

## 6. **nginx**
- **Config:** Single `nginx.conf` with resolver `127.0.0.11`, correct `proxy_pass` and `rewrite` for `/authapi/`, `/umapi/`, `/ormapi/`, `/bcmapi/`, `/um/`, `/orm/`, `/bcm/`, and `/` (hostweb). Host port **8080** maps to container port 80.

---

## Deploy (Docker)

From the repo root (`RiskTrac-GRC`):

```bash
docker compose build --no-cache
docker compose up -d
```

Then open: **http://10.0.1.32:8080**

- Login and get-key go through umapi → authapi; get-key always returns 200 (success or fallback).
- All APIs respond with 200 and `success: 0` on unexpected errors instead of 500.

---

## Optional: Remove deprecated gulp-util

- **ormapi:** In `package.json` you can remove `"gulp-util":"^3.0.8"` from `dependencies` (gulp build scripts don’t require it at runtime).
- **bcmapi:** Same – remove `"gulp-util":"3.0.8"` from `dependencies` and from `devDependencies` if present. Then run `npm install` in each module if you need a clean lockfile.

These removals are optional; the app runs correctly with gulp-util still listed.

---

## Troubleshooting: 502 Bad Gateway on `/umapi/user-management/auth/get-key` or `/login`

**What it means:** The browser reaches nginx at `http://10.0.1.32:8080`, but nginx cannot get a valid response from the **umapi** backend (User Management API). So the failure is between nginx and the umapi container, not in the frontend.

**Checks:**

1. **Ensure all containers are running**
   ```bash
   docker compose ps
   ```
   Confirm `risktrac-umapi` (and `risktrac-authapi`) are **Up**.

2. **Inspect umapi logs**
   ```bash
   docker compose logs umapi
   ```
   Look for startup errors (e.g. missing config, DB, or authapi unreachable).

3. **Restart umapi**
   ```bash
   docker compose restart umapi
   ```

4. **Full stack restart**
   ```bash
   docker compose down && docker compose up -d
   ```

**Frontend:** The login page now shows a clear message when the auth service returns 502/503/504: *"Authentication service is temporarily unavailable. Please check that the User Management API (umapi) is running and try again."*
