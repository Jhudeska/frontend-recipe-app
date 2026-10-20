import axiosInstance from "./axiosInstance";

export const getFavoriteByRecipeId = async () => {
    const response = await axiosInstance.get("/favorites/user/1");
    return response;
};

export const createFavorite = async () => {
    const response = await axiosInstance.post("/favoritesuser/1/recipe/1");
    return response;
};

