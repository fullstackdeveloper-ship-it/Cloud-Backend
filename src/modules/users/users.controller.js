import { createUserService, getUsersService } from './users.service.js';
import { successResponse, errorResponse } from '../../utils/http.js';

export const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const data = await createUserService(userData);
    successResponse(res, data, 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const data = await getUsersService();
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, error.message);
  }
};
