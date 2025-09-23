import { getQueryApi } from '../../vendors/influx/client.js';
import { getConfigService } from '../config/config.service.js';
import { config } from '../../config/env.js';

export const executeFluxQueryService = async (query, parameters = {}) => {
  try {
    console.log('🔍 Executing Flux Query:');
    console.log('=' .repeat(60));
    console.log(query);
    console.log('=' .repeat(60));
    console.log('📊 Query Parameters:', parameters);
    
    // Replace placeholders in query with actual values
    let processedQuery = query;
    
    // Replace common placeholders
    Object.keys(parameters).forEach(key => {
      const placeholder = `{{${key}}}`;
      const value = parameters[key];
      processedQuery = processedQuery.replace(new RegExp(placeholder, 'g'), value);
    });
    
    // Replace default placeholders if not provided
    if (!parameters.bucket) {
      processedQuery = processedQuery.replace(/{{bucket}}/g, 'iot-bucket-gfe');
    }
    if (!parameters.start) {
      processedQuery = processedQuery.replace(/{{start}}/g, '-1h');
    }
    if (!parameters.stop) {
      processedQuery = processedQuery.replace(/{{stop}}/g, 'now()');
    }
    if (!parameters.controllerId) {
      processedQuery = processedQuery.replace(/{{controllerId}}/g, 'CTRL-1A64BCC039E8D677872A6A73E31ADFE1098432BE49B3AC4159FD21A909EF61EA');
    }
    if (!parameters.window) {
      processedQuery = processedQuery.replace(/{{window}}/g, '1h');
    }
    
    console.log('🔧 Processed Query:');
    console.log('=' .repeat(60));
    console.log(processedQuery);
    console.log('=' .repeat(60));
    
    const queryApi = getQueryApi();
    const results = [];
    
    return new Promise((resolve, reject) => {
      queryApi.queryRows(processedQuery, {
        next(row, tableMeta) {
          const tableObject = tableMeta.toObject(row);
          results.push(tableObject);
        },
        error(error) {
          console.error('❌ Flux Query Error:', error);
          reject(new Error(`Flux query execution failed: ${error.message}`));
        },
        complete() {
          console.log(`✅ Flux Query completed. Retrieved ${results.length} rows`);
          
          // Transform data for frontend consumption
          const transformedData = transformFluxData(results);
          resolve(transformedData);
        }
      });
    });
  } catch (error) {
    console.error('❌ Flux Service Error:', error);
    throw new Error(`Failed to execute flux query: ${error.message}`);
  }
};

export const executeFluxFromConfigService = async (configName, chartIndex, parameters = {}) => {
  try {
    // Get config
    const config = await getConfigService(configName);
    
    if (!config.charts || !config.charts[chartIndex]) {
      throw new Error(`Chart at index ${chartIndex} not found in config '${configName}'`);
    }
    
    const chart = config.charts[chartIndex];
    
    if (!chart.dataSource || chart.dataSource.type !== 'flux') {
      throw new Error(`Chart at index ${chartIndex} does not have a valid flux data source`);
    }
    
    if (!chart.dataSource.query) {
      throw new Error(`Chart at index ${chartIndex} does not have a flux query defined`);
    }
    
    // Merge default parameters with provided parameters
    const defaultParams = chart.dataSource.parameters || {};
    const mergedParams = { ...defaultParams, ...parameters };
    
    // Replace placeholders in query with actual values
    let processedQuery = chart.dataSource.query;
    
    // Replace common placeholders
    Object.keys(mergedParams).forEach(key => {
      const placeholder = `{{${key}}}`;
      const value = mergedParams[key];
      processedQuery = processedQuery.replace(new RegExp(placeholder, 'g'), value);
    });
    
    // Replace default placeholders if not provided
    if (!mergedParams.bucket) {
      processedQuery = processedQuery.replace(/{{bucket}}/g, config.influx?.bucket || 'energy_data');
    }
    if (!mergedParams.start) {
      processedQuery = processedQuery.replace(/{{start}}/g, '-1h');
    }
    if (!mergedParams.stop) {
      processedQuery = processedQuery.replace(/{{stop}}/g, 'now()');
    }
    if (!mergedParams.controllerId) {
      processedQuery = processedQuery.replace(/{{controllerId}}/g, 'default');
    }
    
    console.log('🔍 Executing Flux Query from Config:');
    console.log(`📋 Config: ${configName}`);
    console.log(`📊 Chart Index: ${chartIndex}`);
    console.log(`🔧 Parameters:`, mergedParams);
    console.log('=' .repeat(60));
    console.log(processedQuery);
    console.log('=' .repeat(60));
    
    return await executeFluxQueryService(processedQuery, mergedParams);
  } catch (error) {
    console.error('❌ Flux Config Service Error:', error);
    throw new Error(`Failed to execute flux query from config: ${error.message}`);
  }
};

const transformFluxData = (rawData) => {
  if (!rawData || rawData.length === 0) {
    return {
      series: [],
      metadata: {
        totalRows: 0,
        fields: [],
        measurements: []
      }
    };
  }
  
  // Group data by measurement and field
  const seriesMap = new Map();
  const fields = new Set();
  const measurements = new Set();
  
  rawData.forEach(row => {
    const measurement = row._measurement || 'unknown';
    const field = row._field || 'unknown';
    const time = row._time;
    const value = row._value;
    const seriesKey = `${measurement}_${field}`;
    
    measurements.add(measurement);
    fields.add(field);
    
    if (!seriesMap.has(seriesKey)) {
      seriesMap.set(seriesKey, {
        name: seriesKey,
        measurement: measurement,
        field: field,
        data: [],
        tags: {}
      });
    }
    
    const series = seriesMap.get(seriesKey);
    series.data.push({
      time: time,
      value: value
    });
    
    // Store tags (excluding _measurement, _field, _time, _value)
    Object.keys(row).forEach(key => {
      if (!key.startsWith('_') && row[key] !== undefined) {
        series.tags[key] = row[key];
      }
    });
  });
  
  const series = Array.from(seriesMap.values());
  
  // Sort data by time
  series.forEach(s => {
    s.data.sort((a, b) => new Date(a.time) - new Date(b.time));
  });
  
  return {
    series: series,
    metadata: {
      totalRows: rawData.length,
      fields: Array.from(fields),
      measurements: Array.from(measurements),
      seriesCount: series.length
    }
  };
};

