import axiosInstance from "./axiosInstance";

export const getAllRecipes = async () => {
    const response = await axiosInstance.get("/recipes");
    return response.data;
};