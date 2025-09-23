# Dynamic Chart System

This system allows you to create dynamic charts based on configuration files stored in the backend. The frontend fetches configuration and data from APIs to render different types of charts.

## How It Works

1. **Config API Call**: Frontend calls `/api/v1/config/{configName}` to get chart configuration
2. **Query API Call**: Frontend uses the query from config to call `/api/v1/flux/execute` to get data
3. **Dynamic Rendering**: Based on `chartType` in config, appropriate chart component is rendered

## Supported Chart Types

### 1. Timeseries Chart (`chartType: "timeseries"`)
- **Purpose**: Line charts for time-series data
- **Config Fields**: `series`, `axes`, `tooltip`, `legend`, etc.
- **Example**: Energy monitoring with multiple data series

### 2. Single Count Chart (`chartType: "single-count"`)
- **Purpose**: Display a single numeric value
- **Config Fields**: `title`, `unit`, `format`
- **Example**: Total power generation, current load

### 3. Gauge Chart (`chartType: "gauge"`)
- **Purpose**: Circular gauge display
- **Config Fields**: `title`, `min`, `max`, `unit`
- **Example**: Battery charge level, system efficiency

## Configuration Structure

```json
{
  "name": "Chart Name",
  "description": "Chart description",
  "version": "1.0.0",
  "chartType": "timeseries|single-count|gauge",
  "influx": {
    "bucket": "bucket-name",
    "org": "organization"
  },
  "query": "flux query with {{placeholders}}",
  "parameters": {
    "start": "-24h",
    "stop": "now()",
    "controllerId": "default"
  },
  "title": "Chart Title",
  "unit": "W",
  "format": "number"
}
```

## Adding New Chart Types

To add a new chart type:

1. **Add case in ConfigBasedChart.jsx**:
```javascript
case 'new-chart-type':
  return createNewChartType();
```

2. **Create the chart function**:
```javascript
const createNewChartType = useCallback(() => {
  // Implementation for new chart type
}, [config, data]);
```

3. **Create config file** with `chartType: "new-chart-type"`

## API Endpoints

### Get Config
```
GET /api/v1/config/{configName}
```

### Execute Query
```
POST /api/v1/flux/execute
{
  "query": "flux query",
  "parameters": {}
}
```

## Usage in Frontend

```jsx
<ConfigBasedChart 
  configName="energy-monitoring"
  height={350}
  refreshInterval={5000}
  controllerId="CTRL-123"
/>
```

## Benefits

- **Dynamic**: No hardcoded chart configurations
- **Extensible**: Easy to add new chart types
- **API-driven**: Real-time data from InfluxDB
- **Reusable**: Same component for different chart types
- **Configurable**: All settings in backend config files
