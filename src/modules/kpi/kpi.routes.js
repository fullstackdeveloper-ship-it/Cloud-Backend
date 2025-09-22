import express from 'express';
import { getKpi, getCurrentKpi } from './kpi.controller.js';

const router = express.Router();

router.get('/', getKpi);
router.get('/current', getCurrentKpi);

export default router;
