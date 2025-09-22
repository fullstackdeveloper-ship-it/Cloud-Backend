import { getQueryApi } from '../../vendors/influx/client.js';
import { getKpiFlux } from '../../vendors/influx/fluxTemplates.js';
import { getTimeRange } from '../../utils/time.js';
import { config } from '../../config/env.js';

export const getKpiService = async ({ controllerId, window }) => {
  console.log('🚀 Starting KPI data fetch...');
  console.log(`📋 Request Parameters:`);
  console.log(`   Controller ID: ${controllerId}`);
  console.log(`   Window: ${window}`);
  
  try {
    console.log('🔌 Getting InfluxDB Query API...');
    const queryApi = getQueryApi();
    const { start, stop } = getTimeRange(window);
    const fluxQuery = getKpiFlux({ 
      bucket: config.influx.bucket, 
      start, 
      stop, 
      controllerId 
    });
    
    console.log('⏳ Executing InfluxDB query...');
    const startTime = Date.now();
    const data = await queryApi.collectRows(fluxQuery);
    const queryTime = Date.now() - startTime;
    
    console.log(`✅ Query executed successfully in ${queryTime}ms`);
    console.log(`📊 Raw data rows received: ${data.length}`);
    
    if (data.length === 0) {
      console.log('⚠️  No data returned from InfluxDB');
      return {
        totalLoad: 0,
        totalGeneration: 0,
        gridPower: 0,
        efficiency: 0,
        updatedAt: new Date().toISOString(),
        status: 'no_data'
      };
    }
    
    console.log('🔍 Sample raw data:');
    console.log(JSON.stringify(data.slice(0, 3), null, 2));
    
    // Process the data to get the latest values for each field
    const latestValues = {};
    const timestamps = [];
    
    data.forEach(row => {
      const field = row._field;
      const value = row._value;
      const time = row._time;
      
      // Store the latest value for each field
      if (!latestValues[field] || new Date(time) > new Date(latestValues[field].time)) {
        latestValues[field] = { value, time };
      }
      
      timestamps.push(new Date(time));
    });
    
    // Get the most recent timestamp
    const latestTimestamp = new Date(Math.max(...timestamps));
    
    // Calculate KPIs
    const pv = latestValues.W_PV?.value || 0;
    const grid = latestValues.W_Grid?.value || 0;
    const gen = latestValues.W_Gen?.value || 0;
    const load = latestValues.W_Load?.value || 0;
    
    const totalGeneration = pv + gen;
    const totalLoad = load;
    const gridPower = Math.abs(grid);
    const efficiency = totalLoad > 0 ? (totalGeneration / totalLoad) * 100 : 0;
    
    const result = {
      totalLoad: Math.round(totalLoad * 100) / 100,
      totalGeneration: Math.round(totalGeneration * 100) / 100,
      gridPower: Math.round(gridPower * 100) / 100,
      efficiency: Math.round(efficiency * 100) / 100,
      updatedAt: latestTimestamp.toISOString(),
      status: 'live'
    };
    
    console.log('📈 Processed KPI data:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('✅ KPI data fetch completed successfully');
    return result;
    
  } catch (error) {
    console.error('❌ KPI query error:');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Return fallback data in case of error
    return {
      totalLoad: 0,
      totalGeneration: 0,
      gridPower: 0,
      efficiency: 0,
      updatedAt: new Date().toISOString(),
      status: 'error',
      error: error.message
    };
  }
};
