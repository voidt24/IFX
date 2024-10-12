export const authHandler = async (authActionCallback, userData) => {
  try {
    return await authActionCallback(userData);
  } catch (error) {
    throw error;
  }
};
