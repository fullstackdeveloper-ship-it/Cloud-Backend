import { InfluxDB } from '@influxdata/influxdb-client';
import { config } from '../../config/env.js';

console.log('🔌 Initializing InfluxDB connection...');
console.log(`📍 InfluxDB URL: ${config.influx.url}`);
console.log(`🏢 Organization: ${config.influx.org}`);
console.log(`🪣 Bucket: ${config.influx.bucket}`);
console.log(`🔑 Token: ${config.influx.token ? '***' + config.influx.token.slice(-4) : 'NOT SET'}`);

const influxDB = new InfluxDB({
  url: config.influx.url,
  token: config.influx.token
});

export const getQueryApi = () => {
  console.log('📡 Creating InfluxDB Query API...');
  const queryApi = influxDB.getQueryApi(config.influx.org);
  console.log('✅ InfluxDB Query API created successfully');
  return queryApi;
};
