import express from 'express';
import { getConfig, updateConfig, listConfigs } from './config.controller.js';

const router = express.Router();

// Get all available configs
router.get('/', listConfigs);

// Get specific config by name
router.get('/:configName', getConfig);

// Update specific config by name
router.put('/:configName', updateConfig);

export default router;
