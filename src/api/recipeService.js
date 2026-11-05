import axiosInstance from "./axiosInstance";
import axios from "axios";


export const getAllRecipes = async () => {
    const response = await axiosInstance.get(`/recipes`);
    return response;
};


export const getAllRecipesWithAbortSignal = async (signal) => {
    const response = await axiosInstance.get("/recipes", {
        signal: signal
    });
    return response;
};

export const getRecipeById = async (id) => {
    const response = await axiosInstance.get(`/recipes/${id}`);
    return response;
};

export const createRecipe = async (recipe) => {
    const response = await axiosInstance.post("/recipes", recipe);
    return response;
};

export const updateRecipe = async (id, recipe) => {
    const response = await axiosInstance.put(`/recipes/${id}`, recipe);
    return response;
};


export const deleteRecipe = async (id) => {
    const response = await axiosInstance.delete(`/recipes/${id}`);
    return response;
};


export const searchRecipes = async (query) => {
    const response = await axiosInstance.get("/recipes/search", {
        params: { query }
    });
    return response;
};