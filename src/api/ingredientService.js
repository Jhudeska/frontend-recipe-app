import axiosInstance from "./axiosInstance.js";

export const getAllIngredients = async () => {
    const response = await axiosInstance.get("/ingredients");
    return response;
};

export const getIngredientById = async () => {
    const response = await axiosInstance.get("/ingredients/1");
    return response;
};

export const createIngredient = async () => {
    const response = await axiosInstance.post("/ingredients");
    return response;
};

export const updateIngredient = async () => {
    const response = await axiosInstance.put("/ingredients/7");
    return response;
};


export const deleteIngredient = async () => {
    const response = await axiosInstance.delete("/ingredients/7");
    return response;
};
