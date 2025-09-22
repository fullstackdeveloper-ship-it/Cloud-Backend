import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  influx: {
    url: process.env.INFLUX_URL,
    org: process.env.INFLUX_ORG,
    token: process.env.INFLUX_TOKEN,
    bucket: process.env.INFLUX_BUCKET
  }
};
