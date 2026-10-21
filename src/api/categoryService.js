import axiosInstance from "./axiosInstance";

export const getAllCategories = async () => {
    const response = await axiosInstance.get("/categories");
    return response;
};

export const getCategoryById = async () => {
    const response = await axiosInstance.get("/categories/1");
    return response;
};

export const createCategory = async () => {
    const response = await axiosInstance.post("/categories");
    return response;
};

export const updateCategory = async () => {
    const response = await axiosInstance.put("/categories/7");
    return response;
};


export const deleteCategory = async () => {
    const response = await axiosInstance.delete("/categories/7");
    return response;
};
