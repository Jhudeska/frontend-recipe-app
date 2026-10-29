import axiosInstance from "./axiosInstance";

export const getAllCategories = async () => {
    const response = await axiosInstance.get(`/categories`);
    return response;
};

export const getCategoryById = async (id) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response;
};

export const createCategory = async (category) => {
    const response = await axiosInstance.post(`/categories`, category);
    return response;
};

export const updateCategory = async (id, category) => {
    const response = await axiosInstance.put(`/categories/${id}`,category);
    return response;
};


export const deleteCategory = async (id) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response;
};
