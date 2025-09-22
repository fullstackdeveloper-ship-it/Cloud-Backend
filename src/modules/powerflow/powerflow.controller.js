import { getCurrentPowerFlowService, getPowerMixService } from './powerflow.service.js';
import { successResponse, errorResponse } from '../../utils/http.js';

export const getCurrentPowerFlow = async (req, res) => {
  try {
    const { controllerId } = req.query;
    
    if (!controllerId) {
      return errorResponse(res, 'controllerId is required', 400);
    }
    
    const data = await getCurrentPowerFlowService({ controllerId });
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const getPowerMix = async (req, res) => {
  try {
    const { controllerId, start, stop, window } = req.query;
    
    if (!controllerId || !start || !stop) {
      return errorResponse(res, 'controllerId, start, and stop are required', 400);
    }
    
    const data = await getPowerMixService({ controllerId, start, stop, window });
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, error.message);
  }
};
