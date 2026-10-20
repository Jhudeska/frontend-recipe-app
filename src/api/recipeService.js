import axiosInstance from "./axiosInstance";

export const getAllRecipes = async () => {
    const response = await axiosInstance.get("/recipes");
    return response;
};

export const getRecipeById = async () => {
    const response = await axiosInstance.get("/recipes/1");
    return response;
};

export const createRecipe = async () => {
    const response = await axiosInstance.post("/recipes");
    return response;
};

export const updateRecipe = async () => {
    const response = await axiosInstance.put("/recipes/7");
    return response;
};


export const deleteRecipe = async () => {
    const response = await axiosInstance.delete("/recipes/7");
    return response;
};
