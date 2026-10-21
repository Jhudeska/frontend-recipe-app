import axiosInstance from "./axiosInstance";

export const getAllRecipeIngredients = async () => {
    const response = await axiosInstance.get("/recipe_ingredients");
    return response;
};

export const getRecipeIngredientById = async () => {
    const response = await axiosInstance.get("/recipe_ingredients/1");
    return response;
};

export const getRecipeIngredientsByIngredientId = async () => {
    const response = await axiosInstance.get("/recipe_ingredients/ingredient/1");
    return response;
};

export const getRecipeIngredientsByRecipeId = async () => {
    const response = await axiosInstance.get("/recipe_ingredients/recipe/1");
    return response;
};


export const createRecipeIngredient = async () => {
    const response = await axiosInstance.post("/recipe_ingredients?recipeId=1&ingredientId=1&quantity=200&unit=gram");
    return response;
};


export const deleteRecipeIngredient = async () => {
    const response = await axiosInstance.delete("/recipe_ingredients/7");
    return response;
};
