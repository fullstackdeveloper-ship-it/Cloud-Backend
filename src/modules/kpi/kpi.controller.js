import { getKpiService } from './kpi.service.js';
import { successResponse, errorResponse } from '../../utils/http.js';

export const getKpi = async (req, res) => {
  try {
    const { controllerId, window = '1h' } = req.query;
    
    if (!controllerId) {
      return errorResponse(res, 'controllerId is required', 400);
    }
    
    const data = await getKpiService({ controllerId, window });
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const getCurrentKpi = async (req, res) => {
  try {
    const { controllerId } = req.query;
    
    if (!controllerId) {
      return errorResponse(res, 'controllerId is required', 400);
    }
    
    const data = await getKpiService({ controllerId, window: '1h' });
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, error.message);
  }
};
