import axiosInstance from "./axiosInstance";


const USER_ID = 1;

export const getAllRecipes = async () => {
    const response = await axiosInstance.get(`/recipes`);
    return response;
};

export const getRecipeById = async () => {
    const response = await axiosInstance.get(`/recipes/${USER_ID}`);
    return response;
};

export const createRecipe = async () => {
    const response = await axiosInstance.post(`/recipes`);
    return response;
};

export const updateRecipe = async () => {
    const response = await axiosInstance.put(`/recipes/${USER_ID}`);
    return response;
};


export const deleteRecipe = async () => {
    const response = await axiosInstance.delete(`/recipes/${USER_ID}`);
    return response;
};
