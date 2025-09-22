import { getEquipmentSummaryService } from './equipment.service.js';
import { successResponse, errorResponse } from '../../utils/http.js';

export const getEquipmentSummary = async (req, res) => {
  try {
    const { siteId } = req.query;
    
    if (!siteId) {
      return errorResponse(res, 'siteId is required', 400);
    }
    
    const data = await getEquipmentSummaryService({ siteId });
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, error.message);
  }
};
