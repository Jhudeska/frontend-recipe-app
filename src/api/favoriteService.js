import axiosInstance from "./axiosInstance";

const USER_ID = 1;

export const getAllFavorites = async () => {
    const response = await axiosInstance.get(`/favorites/user/${USER_ID}`);
    return response.data;
};

export const createFavorite = async (recipeId) => {
    const response = await axiosInstance.post(`/favoritesuser/${USER_ID}/recipe/${recipeId}`,
        {
            recipeId: recipeId
        }
    );
    return response;
};

export const deleteFavorite = async (recipeId) => {
    await axiosInstance.delete(
        `/favorites/user/${USER_ID}/recipe/${recipeId}`
    );
};