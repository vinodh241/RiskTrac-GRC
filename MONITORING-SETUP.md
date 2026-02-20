# Grafana & Prometheus Setup for RiskTrac GRC

Monitoring uses **official Docker images** only. No extra packages need to be installed on the host.

## What Was Added

| Component   | Image                    | Port | Purpose                    |
|------------|---------------------------|------|----------------------------|
| **Prometheus** | `prom/prometheus:v2.47.0` | 9090 | Metrics collection & storage |
| **Grafana**    | `grafana/grafana:10.2.0`  | 3000 | Dashboards & visualization   |

- **Prometheus** config: `monitoring/prometheus/prometheus.yml`
- **Grafana** default datasource: Prometheus is auto-provisioned from `monitoring/grafana/provisioning/datasources/datasources.yml`

## Quick Start

1. **Start the stack (including monitoring):**
   ```bash
   docker compose up -d
   ```

2. **Access:**
   - **Grafana:** http://localhost:3000 (or http://10.0.1.32:3000 if using the same server)
     - Login: `admin` / `admin` (change on first login)
   - **Prometheus:** http://localhost:9090
     - Try **Status → Targets** to see scrape targets; run a query in **Graph** (e.g. `up`).

3. **Optional – start only monitoring (if app is already running):**
   ```bash
   docker compose up -d prometheus grafana
   ```

## Changing Grafana Admin Password

Set via environment in `docker-compose.yml`:

- `GF_SECURITY_ADMIN_USER` – admin username
- `GF_SECURITY_ADMIN_PASSWORD` – admin password

Or use a `.env` file and reference with `${GF_ADMIN_PASSWORD}`. Then restart:

```bash
docker compose up -d grafana
```

## Adding Application Metrics (Optional)

Right now Prometheus only scrapes itself. To monitor the Node.js APIs (authapi, umapi, ormapi, bcmapi):

1. **Expose a `/metrics` endpoint in each API** using the `prom-client` npm package (e.g. default metrics + HTTP request duration).
2. **Uncomment the corresponding job(s)** in `monitoring/prometheus/prometheus.yml` for `authapi`, `umapi`, `ormapi`, and/or `bcmapi`.
3. **Reload Prometheus** (config has `--web.enable-lifecycle`):
   ```bash
   curl -X POST http://localhost:9090/-/reload
   ```

Example in a Node/Express app:

```bash
npm install prom-client --save
```

```javascript
const client = require('prom-client');
const register = new client.Registry();
client.collectDefaultMetrics({ register });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

## Data Persistence

- **Prometheus:** data is stored in Docker volume `prometheus_data`.
- **Grafana:** dashboards and settings in `grafana_data`.

To wipe and start fresh:

```bash
docker compose down
docker volume rm risktrac-grc_prometheus_data risktrac-grc_grafana_data
docker compose up -d
```

## Troubleshooting

### "dial tcp ...:9000: connect: connection refused" when querying Prometheus

**Cause:** Something is trying to reach Prometheus on port **9000**. In this setup Prometheus listens on port **9090** (default), not 9000.

**Fix:**

1. **If using Grafana:**  
   Go to **Connections → Data sources → Prometheus**. Set the URL to **`http://prometheus:9090`** (when Grafana runs in Docker) or **`http://10.0.1.32:9090`** (when accessing from the host). Do **not** use port 9000.
2. **If using another tool or script:**  
   Point it at **`http://10.0.1.32:9090`** (or `http://localhost:9090` if on the same host).
3. **Ensure Prometheus is running:**  
   `docker compose ps prometheus` and open http://10.0.1.32:9090 (or http://localhost:9090) in a browser to confirm.

## No Extra Install Required

- **Prometheus** and **Grafana** run from Docker; no host install of Prometheus or Grafana is needed.
- Only **Docker** and **Docker Compose** on the host are required (which you already use for RiskTrac GRC).
