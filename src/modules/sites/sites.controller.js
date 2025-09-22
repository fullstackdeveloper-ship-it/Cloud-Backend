import { createSiteService, getSitesService } from './sites.service.js';
import { successResponse, errorResponse } from '../../utils/http.js';

export const createSite = async (req, res) => {
  try {
    const siteData = req.body;
    const data = await createSiteService(siteData);
    successResponse(res, data, 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const getSites = async (req, res) => {
  try {
    const data = await getSitesService();
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, error.message);
  }
};
