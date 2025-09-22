// Flux query templates for KPIs and Power Flow data

export const getKpiFlux = ({ bucket, start, stop, controllerId }) => {
  return `
    from(bucket: "${bucket}")
      |> range(start: ${start}, stop: ${stop})
      |> filter(fn: (r) => r["_measurement"] == "power_mix")
      |> filter(fn: (r) => r["_field"] == "W_Load" or r["_field"] == "W_Gen" or r["_field"] == "W_Grid" or r["_field"] == "W_PV")
      |> filter(fn: (r) => r["controller_id"] == "${controllerId}")
      |> last()
      |> yield(name: "kpi")
  `;
};

export const getPowerFlowFlux = ({ bucket, start, stop, controllerId, window }) => {
  return `
    from(bucket: "${bucket}")
      |> range(start: ${start}, stop: ${stop})
      |> filter(fn: (r) => r["_measurement"] == "power_mix")
      |> filter(fn: (r) => r["_field"] == "W_Load" or r["_field"] == "W_Gen" or r["_field"] == "W_Grid" or r["_field"] == "W_PV")
      |> filter(fn: (r) => r["controller_id"] == "${controllerId}")
      |> aggregateWindow(every: ${window}, fn: mean, createEmpty: false)
      |> sort(columns: ["_time"], desc: true)
      |> limit(n: 100)
      |> yield(name: "powerflow")
  `;
};

export const getPowerMixFlux = ({ bucket, start, stop, controllerId }) => {
  // Build query without aggregation - get all data points
  const fluxQuery = `from(bucket: "${bucket}")
  |> range(start: ${start}, stop: ${stop})
  |> filter(fn: (r) => r["_measurement"] == "power_mix")
  |> filter(fn: (r) => r["_field"] == "W_Load" or r["_field"] == "W_Gen" or r["_field"] == "W_Grid" or r["_field"] == "W_PV")
  |> filter(fn: (r) => r["controller_id"] == "${controllerId}")
  |> yield(name: "mean")`;
  
  console.log('🔍 Generated Power Mix Flux Query:');
  console.log('=' .repeat(60));
  console.log(fluxQuery);
  console.log('=' .repeat(60));
  console.log(`📊 Query Parameters:`);
  console.log(`   Bucket: ${bucket}`);
  console.log(`   Time Range: ${start} to ${stop}`);
  console.log(`   Controller ID: ${controllerId}`);
  console.log(`   Window: NONE (all data points)`);
  
  return fluxQuery;
};
