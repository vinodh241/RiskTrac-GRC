# RiskTrac GRC – Ready to launch

## Database configuration (all API modules)

All API modules are configured to use this SQL Server:

| Setting  | Value        |
|----------|--------------|
| **Server** | 10.0.1.22  |
| **Port**   | 1433       |
| **User**   | sqldev     |
| **Password** | RegxTrac1234 (stored encrypted in config) |
| **Database** | SE_GRC     |

**Configured in:**

- `authapi/config/db-config.js`
- `umapi/config/db-config.js` and `umapi/config/db-config-notification.js`
- `ormapi/config/db-config.js` and `ormapi/config/db-config-notification.js`
- `bcmapi/config/db-config.js` and `bcmapi/config/db-config-notification.js`

Passwords in these files are **encrypted** with each API’s own public key (`config/certs/public.pem`) and decrypted at runtime with that API’s private key. Each API (authapi, umapi, ormapi, bcmapi) has its own cert pair, so each has its own encrypted password in its config.

---

## Encrypt DB password (when you change the password)

To store a **new** DB password in config (encrypted):

1. Ensure the API has dependencies installed:  
   `npm install --omit=dev` in that API folder (e.g. `authapi`).
2. **Option A – from project root:**
   ```bash
   node scripts/encrypt-db-password.js YOUR_PLAIN_PASSWORD [apiName]
   ```
   Omit `apiName` to encrypt for all APIs; or use `authapi`, `umapi`, `ormapi`, `bcmapi` for one.
3. **Option B – per-API script (same as above):**
   ```bash
   node authapi/bin/encrypt-password.js YOUR_PLAIN_PASSWORD
   node umapi/bin/encrypt-password.js YOUR_PLAIN_PASSWORD
   # etc.
   ```
4. Copy the printed encrypted string into the `password` field in the relevant `config/db-config.js` (and `db-config-notification.js` if that API has one).

Example (from project root):

```bash
node scripts/encrypt-db-password.js RegxTrac1234 authapi
```

---

## Launch the application

### 1. Ensure SQL Server is reachable

- Server: **10.0.1.22**, port **1433**.
- Database **SE_GRC** exists and user **sqldev** / password **RegxTrac1234** can connect.
- If the app runs in Docker on another host, that host must be able to reach 10.0.1.22:1433 (e.g. not only localhost).

### 2. Build and start with Docker (recommended)

From project root `RiskTrac-GRC`:

```bash
docker compose build --no-cache
docker compose up -d
```

### 3. Open the app

- Main app: **http://10.0.1.32:8080** (or **http://localhost:8080** if you’re on the same machine).
- User Management: http://10.0.1.32:8080/um/
- ORM: http://10.0.1.32:8080/orm/
- BCM: http://10.0.1.32:8080/bcm/

### 4. If something fails

- **502 on login / get-key:** See **FIXES-APPLIED.md** → “Troubleshooting: 502 Bad Gateway”. Usually the umapi (or authapi) container is not running or cannot reach the DB.
- **DB connection errors:** Check that 10.0.1.22:1433 is reachable from the host/container, that SE_GRC exists, and that sqldev / RegxTrac1234 can log in.
- **Decrypt errors:** If an API fails to decrypt the DB password, that API likely uses a different cert. Run  
  `node scripts/encrypt-db-password.js RegxTrac1234 <apiName>` for that API (after `npm install` in that API folder) and put the new encrypted value in that API’s db-config files.

---

## Summary

- DB is set to **10.0.1.22:1433**, user **sqldev**, password **RegxTrac1234** (encrypted in all API configs).
- Encrypt new passwords with:  
  `node scripts/encrypt-db-password.js <plainPassword> [apiName]`
- Launch with:  
  `docker compose up -d`  
  and use **http://10.0.1.32:8080** (or localhost:8080) to access the app.
