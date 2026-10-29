import axiosInstance from "./axiosInstance.js";

export const getAllIngredients = async () => {
    const response = await axiosInstance.get(`/ingredients`);
    return response;
};

export const getIngredientById = async (id) => {
    const response = await axiosInstance.get(`/ingredients/${id}`);
    return response;
};

export const createIngredient = async (ingredient) => {
    const response = await axiosInstance.post(`/ingredients`, ingredient);
    return response;
};

export const updateIngredient = async (id, ingredient) => {
    const response = await axiosInstance.put(`/ingredients/${id}`, ingredient);
    return response;
};


export const deleteIngredient = async (id) => {
    const response = await axiosInstance.delete(`/ingredients/${id}`);
    return response;
};
