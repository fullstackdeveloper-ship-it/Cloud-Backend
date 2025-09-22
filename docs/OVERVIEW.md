# API Overview

## KPI and Power Flow Data Mapping

The API provides endpoints for energy dashboard KPIs and power flow data sourced from InfluxDB Cloud.

### Data Source
- **Measurement**: `power_mix`
- **Fields**: `W_PV`, `W_Grid`, `W_Gen`, `W_Load`
- **Controller ID**: Site-specific identifier

### Flux Query Templates

KPI queries use `last()` to get the most recent values, while Power Flow queries use `aggregateWindow()` for time-series data.

### Implementation Notes

Services currently return placeholder data. To implement actual InfluxDB queries:

1. Uncomment the TODO sections in service files
2. The InfluxDB client is already configured with environment variables
3. Flux templates are available in `src/vendors/influx/fluxTemplates.js`

### Environment Variables

All InfluxDB credentials are stored in `.env`:
- `INFLUX_URL`
- `INFLUX_ORG` 
- `INFLUX_TOKEN`
- `INFLUX_BUCKET`
