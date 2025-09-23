import { getConfigService, updateConfigService, listConfigsService } from './config.service.js';
import { successResponse, errorResponse } from '../../utils/http.js';

export const getConfig = async (req, res) => {
  try {
    const { configName } = req.params;
    
    if (!configName) {
      return errorResponse(res, 'configName is required', 400);
    }
    
    const config = await getConfigService(configName);
    successResponse(res, config);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const updateConfig = async (req, res) => {
  try {
    const { configName } = req.params;
    const configData = req.body;
    
    if (!configName) {
      return errorResponse(res, 'configName is required', 400);
    }
    
    if (!configData) {
      return errorResponse(res, 'config data is required', 400);
    }
    
    const updatedConfig = await updateConfigService(configName, configData);
    successResponse(res, updatedConfig);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const listConfigs = async (req, res) => {
  try {
    const configs = await listConfigsService();
    successResponse(res, configs);
  } catch (error) {
    errorResponse(res, error.message);
  }
};
