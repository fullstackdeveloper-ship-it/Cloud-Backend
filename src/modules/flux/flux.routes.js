import express from 'express';
import { executeFluxQuery, executeFluxFromConfig } from './flux.controller.js';

const router = express.Router();

// Execute raw flux query
router.post('/execute', executeFluxQuery);

// Execute flux query from config
router.post('/config/:configName/chart/:chartIndex', executeFluxFromConfig);

export default router;
