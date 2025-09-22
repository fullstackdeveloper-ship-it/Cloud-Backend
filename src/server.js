import express from 'express';
import pino from 'pino-http';
import { config } from './config/env.js';
import { corsMiddleware } from './config/security.js';
import { errorHandler } from './middlewares/errorHandler.js';
import apiRoutes from './routes.js';

const app = express();

// Logging middleware
app.use(pino({
  redact: ['req.headers.authorization']
}));

// CORS middleware
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json());

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.json({ ok: true });
});

// API routes
app.use('/api/v1', apiRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
