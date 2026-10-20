import axiosInstance from "./axiosInstance";

export const getAllRecipeImages = async () => {
    const response = await axiosInstance.get("/recipe_images");
    return response;
};

export const getRecipeImageById = async () => {
    const response = await axiosInstance.get("/recipe_images/1");
    return response;
};

export const createRecipeImage = async () => {
    const response = await axiosInstance.post("/recipe_images");
    return response;
};

export const updateRecipeImage = async () => {
    const response = await axiosInstance.put("/recipe_images/7");
    return response;
};


export const deleteRecipeImage = async () => {
    const response = await axiosInstance.delete("/recipe_images/7");
    return response;
};
