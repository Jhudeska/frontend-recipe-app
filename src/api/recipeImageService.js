import axiosInstance from "./axiosInstance";

export const getAllRecipeImages = async () => {
    const response = await axiosInstance.get("/recipe_images");
    return response;
};

export const getRecipeImageById = async (id) => {
    const response = await axiosInstance.get(`/recipe_images/${id}`);
    return response;
};

export const createRecipeImage = async (imageData) => {
    const response = await axiosInstance.post("/recipe_images", imageData);
    return response;
};


export const uploadRecipeImage = async (file, recipeId) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("recipeId", recipeId);

    return axiosInstance.post(
        "/recipe_images/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const updateRecipeImage = async (id, imageData) => {
    const response = await axiosInstance.put(`/recipe_images/${id}`, imageData);
    return response;
};


export const deleteRecipeImage = async (id) => {
    const response = await axiosInstance.delete(`/recipe_images/${id}`);
    return response;
};
