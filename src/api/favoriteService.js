import axiosInstance from "./axiosInstance";

export const getAllFavorites = async (userId) => {
    const response = await axiosInstance.get(`/favorites/user/${userId}`);
    return response.data;
};

export const createFavorite = async (userId, recipeId) => {
    const response = await axiosInstance.post(`/favorites/user/${userId}/recipe/${recipeId}`, {
        recipeId: recipeId
    });
    return response.data;
};

export const deleteFavorite = async (userId, recipeId) => {
    const response = await axiosInstance.delete(`/favorites/user/${userId}/recipe/${recipeId}`);
    return response.data;
};