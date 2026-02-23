# Grafana & Prometheus Setup for RiskTrac GRC

Monitoring uses **official Docker images** only. No extra packages need to be installed on the host.

## What Was Added

| Component       | Image                           | Port | Purpose                              |
|----------------|----------------------------------|------|--------------------------------------|
| **cAdvisor**     | `gcr.io/cadvisor/cadvisor:v0.47.2` | 8081 | Per-container CPU, RAM, disk metrics |
| **Node Exporter** | `prom/node-exporter:v1.7.0`      | 9100 | Host CPU, RAM, disk metrics          |
| **Prometheus**   | `prom/prometheus:v2.47.0`        | 9090 | Metrics collection & storage        |
| **Grafana**      | `grafana/grafana:10.2.0`         | 3000 | Dashboards & visualization           |

- **Prometheus** config: `monitoring/prometheus/prometheus.yml` (scrapes `node_exporter:9100` and `cadvisor:8080`).
- **Grafana** default datasource: Prometheus is auto-provisioned from `monitoring/grafana/provisioning/datasources/datasources.yml`.
- **Grafana** dashboards (folder **RiskTrac GRC**):
  - **RiskTrac GRC – Overview**: targets `up`, Prometheus HTTP request rate.
  - **Host CPU & RAM**: host CPU %, RAM %, memory used (GB) from Node Exporter.
  - **Containers – CPU, RAM & disk**: per-container CPU %, RAM, disk usage and working set from cAdvisor (authapi, umapi, ormapi, bcmapi, nginx, etc.).

## Quick Start

1. **Start the stack (including monitoring):**
   ```bash
   docker compose up -d
   ```

2. **Access:**
   - **Grafana** (dashboards): http://localhost:3000 (or http://10.0.1.32:3000 if using the same server)
     - **Login:** `admin` / `admin` (change password on first login if prompted)
   - **Prometheus** (metrics UI): http://localhost:9090 (or http://10.0.1.32:9090)
     - **No login** – Prometheus does not have a login screen; open the URL and use **Status → Targets** or **Graph** (e.g. query `up`).

3. **Optional – start only monitoring (if app is already running):**
   ```bash
   docker compose up -d cadvisor node_exporter prometheus grafana
   ```

4. **View metrics in Grafana:**
   - **Per-container (CPU, RAM, disk):** **Dashboards** → **RiskTrac GRC** → **Containers – CPU, RAM & disk**. Shows each container (authapi, umapi, ormapi, bcmapi, nginx, etc.) with CPU %, RAM, disk usage, and memory working set. Requires **cAdvisor** to be running.
   - **Host CPU & RAM:** **Dashboards** → **RiskTrac GRC** → **Host CPU & RAM**. (Node Exporter must be running; on a Linux host it reports host metrics; on Windows Docker Desktop you get the Linux VM’s metrics.)

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

### Host CPU & RAM dashboard shows "No data"

1. **Check that Node Exporter and Prometheus are running**
   ```bash
   docker compose ps node_exporter prometheus
   ```
   Both should be "Up". If not: `docker compose up -d node_exporter prometheus`.

2. **Check Prometheus targets**  
   Open http://localhost:9090/targets (or http://10.0.1.32:9090/targets). Under the **node** job, the target `node_exporter:9100` should show **UP** in green. If it is DOWN, Prometheus cannot reach Node Exporter (e.g. wrong network or container not running).

3. **Verify metrics in Prometheus**  
   In Prometheus → **Graph**, run the query: `node_cpu_seconds_total`. You should see at least one time series. If you get "no data", Node Exporter is not being scraped or has no metrics.

4. **Grafana datasource**  
   In Grafana go to **Connections → Data sources**. Open **Prometheus** and ensure **URL** is `http://prometheus:9090`. Click **Save & test** — it should report "Data source is working".

5. **Time range**  
   Try **Last 5 minutes** in the dashboard time picker; after a fresh start it can take 1–2 minutes for the first data to appear.

6. **"Node Exporter target" panel**  
   The Host CPU & RAM dashboard has a **Node Exporter target** panel at the bottom. If it shows **Up** (green), Prometheus is scraping Node Exporter and the other panels should get data. If it shows **Down** or **No data**, fix the Prometheus → Node Exporter connection first.

### "dial tcp ...:9000: connect: connection refused" or status=500 on `/api/datasources/uid/.../resources/*`

**Cause:** A Prometheus data source in Grafana is using URL with port **9000**. Prometheus uses port **9090**, not 9000.

**Fix:**

1. In Grafana go to **Connections → Data sources** (or **Configuration → Data sources**).
2. Open the Prometheus data source that shows errors (e.g. **Prometheus-1**).
3. Set **URL** to **`http://prometheus:9090`** (Grafana in Docker on same stack) or **`http://10.0.1.32:9090`** (by host IP). Do **not** use port 9000.
4. Click **Save & test**; it should report “Data source is working”.
2. **If using another tool or script:**  
   Point it at **`http://10.0.1.32:9090`** (or `http://localhost:9090` if on the same host).
3. **Ensure Prometheus is running:**  
   `docker compose ps prometheus` and open http://10.0.1.32:9090 (or http://localhost:9090) in a browser to confirm.

## No Extra Install Required

- **Prometheus** and **Grafana** run from Docker; no host install of Prometheus or Grafana is needed.
- Only **Docker** and **Docker Compose** on the host are required (which you already use for RiskTrac GRC).
