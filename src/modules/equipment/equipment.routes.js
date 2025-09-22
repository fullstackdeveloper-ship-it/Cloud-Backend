import express from 'express';
import { getEquipmentSummary } from './equipment.controller.js';

const router = express.Router();

router.get('/summary', getEquipmentSummary);

export default router;
