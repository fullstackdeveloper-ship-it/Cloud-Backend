import express from 'express';
import { getCurrentPowerFlow, getPowerMix } from './powerflow.controller.js';

const router = express.Router();

router.get('/current', getCurrentPowerFlow);
router.get('/mix', getPowerMix);

export default router;
