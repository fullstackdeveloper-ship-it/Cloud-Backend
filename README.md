# GFE Energy Dashboard Backend

Node.js + Express backend API for the GFE Energy Dashboard.

## Quick Start

1. Copy environment file:
```bash
cp env.example .env
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Server runs on port 4000 by default.

## API Endpoints

### Health
- `GET /healthz` - Health check

### KPIs
- `GET /api/v1/kpi?siteId=<id>&window=<window>` - Get current KPIs

### Power Flow
- `GET /api/v1/powerflow/current?siteId=<id>` - Get current power flow data
- `GET /api/v1/powerflow/mix?controllerId=<id>&start=<time>&stop=<time>&window=<period>` - Get power mix time series data (window optional - if not provided, returns all data points)

### Alarms
- `GET /api/v1/alarms/active?siteId=<id>` - Get active alarms

### Equipment
- `GET /api/v1/equipment/summary?siteId=<id>` - Get equipment summary

### Users (Future)
- `POST /api/v1/users` - Create user
- `GET /api/v1/users` - List users

### Sites (Future)
- `POST /api/v1/sites` - Create site
- `GET /api/v1/sites` - List sites

## Sample Requests

```bash
# Health check
curl http://localhost:4000/healthz

# Get KPIs
curl "http://localhost:4000/api/v1/kpi?siteId=CTRL-1A64BCC039E8D677872A6A73E31ADFE1098432BE49B3AC4159FD21A909EF61EA&window=1h"

# Get power flow
curl "http://localhost:4000/api/v1/powerflow/current?siteId=CTRL-1A64BCC039E8D677872A6A73E31ADFE1098432BE49B3AC4159FD21A909EF61EA"

# Get power mix data for chart
# With window aggregation (1 hour windows)
curl "http://localhost:4000/api/v1/powerflow/mix?controllerId=CTRL-1A64BCC039E8D677872A6A73E31ADFE1098432BE49B3AC4159FD21A909EF61EA&start=2024-09-19T00:00:00Z&stop=2024-09-19T23:59:59Z&window=1h"

# All data points (no aggregation)
curl "http://localhost:4000/api/v1/powerflow/mix?controllerId=CTRL-1A64BCC039E8D677872A6A73E31ADFE1098432BE49B3AC4159FD21A909EF61EA&start=2024-09-19T00:00:00Z&stop=2024-09-19T23:59:59Z"
```

## Architecture

- **Routes** → **Controllers** → **Services** pattern
- InfluxDB integration ready (services contain TODOs for actual queries)
- CORS configured for `http://localhost:3000`
- Pino logging with authorization header redaction
# Cloud-Backend
