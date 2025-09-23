import { executeFluxQueryService, executeFluxFromConfigService } from './flux.service.js';
import { successResponse, errorResponse } from '../../utils/http.js';

export const executeFluxQuery = async (req, res) => {
  try {
    const { query, parameters = {} } = req.body;
    
    if (!query) {
      return errorResponse(res, 'Flux query is required', 400);
    }
    
    const data = await executeFluxQueryService(query, parameters);
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const executeFluxFromConfig = async (req, res) => {
  try {
    const { configName, chartIndex } = req.params;
    const { parameters = {} } = req.body;
    
    if (!configName) {
      return errorResponse(res, 'configName is required', 400);
    }
    
    if (chartIndex === undefined) {
      return errorResponse(res, 'chartIndex is required', 400);
    }
    
    const data = await executeFluxFromConfigService(configName, parseInt(chartIndex), parameters);
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, error.message);
  }
};
