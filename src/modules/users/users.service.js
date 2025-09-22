export const createUserService = async (userData) => {
  // TODO: Implement user creation with database
  return {
    id: 'user_123',
    email: userData.email,
    name: userData.name,
    createdAt: new Date().toISOString()
  };
};

export const getUsersService = async () => {
  // TODO: Implement user listing from database
  return {
    users: [
      { id: 'user_1', email: 'admin@gfe.com', name: 'Admin User' },
      { id: 'user_2', email: 'operator@gfe.com', name: 'Operator' }
    ]
  };
};
