import express from 'express';
import { getActiveAlarms } from './alarms.controller.js';

const router = express.Router();

router.get('/active', getActiveAlarms);

export default router;
