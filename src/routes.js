import express from 'express';
import kpiRoutes from './modules/kpi/kpi.routes.js';
import powerflowRoutes from './modules/powerflow/powerflow.routes.js';
import alarmsRoutes from './modules/alarms/alarms.routes.js';
import equipmentRoutes from './modules/equipment/equipment.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import sitesRoutes from './modules/sites/sites.routes.js';
import configRoutes from './modules/config/config.routes.js';
import fluxRoutes from './modules/flux/flux.routes.js';

const router = express.Router();

router.use('/kpi', kpiRoutes);
router.use('/powerflow', powerflowRoutes);
router.use('/alarms', alarmsRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/users', usersRoutes);
router.use('/sites', sitesRoutes);
router.use('/config', configRoutes);
router.use('/flux', fluxRoutes);

export default router;
