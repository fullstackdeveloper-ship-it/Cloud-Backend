// Time utility helpers

export const getTimeRange = (window = '1h') => {
  const now = new Date();
  const start = new Date(now.getTime() - getWindowMs(window));
  return { start: start.toISOString(), stop: now.toISOString() };
};

const getWindowMs = (window) => {
  const units = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000
  };
  return units[window] || units['1h'];
};
