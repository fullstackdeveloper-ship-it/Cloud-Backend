import { getQueryApi } from '../../vendors/influx/client.js';
import { getPowerFlowFlux, getPowerMixFlux } from '../../vendors/influx/fluxTemplates.js';
import { getTimeRange } from '../../utils/time.js';
import { config } from '../../config/env.js';

export const getCurrentPowerFlowService = async ({ controllerId }) => {
  console.log('🚀 Starting Power Flow data fetch...');
  console.log(`📋 Request Parameters: controllerId = ${controllerId}`);
  
  try {
    console.log('🔌 Getting InfluxDB Query API...');
    const queryApi = getQueryApi();
    
    // Get the latest data (last 1 hour to ensure we have recent data)
    const { start, stop } = getTimeRange('1h');
    console.log(`⏰ Time range: ${start} to ${stop}`);
    
    console.log('📝 Generating Flux query for latest power flow data...');
    const fluxQuery = getPowerFlowFlux({ 
      bucket: config.influx.bucket, 
      start, 
      stop, 
      controllerId,
      window: '1m'
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
        W_PV: 0,
        W_Grid: 0,
        W_Gen: 0,
        W_Load: 0,
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
    
    // Map the field names to our expected format
    const result = {
      W_PV: latestValues.W_PV?.value || 0,
      W_Grid: latestValues.W_Grid?.value || 0,
      W_Gen: latestValues.W_Gen?.value || 0,
      W_Load: latestValues.W_Load?.value || 0,
      updatedAt: latestTimestamp.toISOString(),
      status: 'live'
    };
    
    console.log('📈 Processed Power Flow data:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('✅ Power Flow data fetch completed successfully');
    return result;
    
  } catch (error) {
    console.error('❌ Power Flow query error:');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Return fallback data in case of error
    return {
      W_PV: 0,
      W_Grid: 0,
      W_Gen: 0,
      W_Load: 0,
      updatedAt: new Date().toISOString(),
      status: 'error',
      error: error.message
    };
  }
};

export const getPowerMixService = async ({ controllerId, start, stop }) => {
  console.log('🚀 Starting Power Mix data fetch...');
  console.log(`📋 Request Parameters:`);
  console.log(`   Controller ID: ${controllerId}`);
  console.log(`   Time Range: ${start} to ${stop}`);
  console.log(`   Window: NONE (all data points)`);
  
  try {
    console.log('🔌 Getting InfluxDB Query API...');
    const queryApi = getQueryApi();
    
    console.log('📝 Generating Flux query...');
    const fluxQuery = getPowerMixFlux({ 
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
    
    if (data.length > 0) {
      console.log('🔍 Sample raw data:');
      console.log(JSON.stringify(data.slice(0, 2), null, 2));
    } else {
      console.log('⚠️  No data returned from InfluxDB for the specified time range');
    }
    
    console.log('🔄 Transforming data for chart format...');
    // Transform InfluxDB data to chart-friendly format
    const chartData = data.map(row => ({
      time: row._time,
      W_PV: row._field === 'W_PV' ? row._value : null,
      W_Grid: row._field === 'W_Grid' ? row._value : null,
      W_Gen: row._field === 'W_Gen' ? row._value : null,
      W_Load: row._field === 'W_Load' ? row._value : null
    }));

    console.log(chartData,"chartData")
    
    // Group by time and combine fields
    const groupedData = {};
    chartData.forEach(item => {
      if (!groupedData[item.time]) {
        groupedData[item.time] = { time: item.time };
      }
      if (item.W_PV !== null) groupedData[item.time].W_PV = item.W_PV;
      if (item.W_Grid !== null) groupedData[item.time].W_Grid = item.W_Grid;
      if (item.W_Gen !== null) groupedData[item.time].W_Gen = item.W_Gen;
      if (item.W_Load !== null) groupedData[item.time].W_Load = item.W_Load;
    });
    
    const finalData = Object.values(groupedData).sort((a, b) => new Date(a.time) - new Date(b.time));
    
    console.log(`📈 Final chart data points: ${finalData.length}`);
    if (finalData.length > 0) {
      console.log('🔍 Sample chart data:');
      console.log(JSON.stringify(finalData.slice(0, 2), null, 2));
    }
    
    const result = {
      data: finalData,
      controllerId,
      start,
      stop
    };
    
    console.log('✅ Power Mix data fetch completed successfully');
    return result;
    
  } catch (error) {
    console.error('❌ Power mix query error:');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to fetch power mix data: ${error.message}`);
  }
};
