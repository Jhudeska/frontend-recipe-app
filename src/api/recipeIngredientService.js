import axiosInstance from "./axiosInstance";

export const getAllRecipeIngredients = async () => {
    const response = await axiosInstance.get(`/recipe_ingredients`);
    return response;
};

export const getRecipeIngredientById = async (id) => {
    const response = await axiosInstance.get(`/recipe_ingredients/${id}`);
    return response;
};

export const getRecipeIngredientsByIngredientId = async (ingredientId) => {
    const response = await axiosInstance.get(`/recipe_ingredients/ingredient/${ingredientId}`);
    return response;
};

export const getRecipeIngredientsByRecipeId = async (recipeId) => {
    const response = await axiosInstance.get(`/recipe_ingredients/recipe/${recipeId}`);
    return response;
};



export const createRecipeIngredient = async ({
                                                 recipeId,
                                                 ingredientId,
                                                 quantity,
                                                 unit,
                                             }) => {
    return await axiosInstance.post("/recipe_ingredients", {
        recipeId,
        ingredientId,
        quantity,
        unit,
    });
};



// export const createRecipeIngredient = async () => {
//     const response = await axiosInstance.post(`/recipe_ingredients?recipeId=1&ingredientId=1&quantity=200&unit=gram`);
//     return response;
// };

export const updateRecipeIngredient = async (id, recipeIngredient) => {
    return await axiosInstance.put(
        `/recipe_ingredients/${id}`,
        recipeIngredient
    );
};

export const deleteRecipeIngredient = async (id) => {
    const response = await axiosInstance.delete(`/recipe_ingredients/${id}` );
    return response;
};
