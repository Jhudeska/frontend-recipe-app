import axiosInstance from "./axiosInstance";

export const getAllUserRoles = async () => {
    const response = await axiosInstance.get("/user_profile_roles");
    return response;
};

export const getUserRoleById = async (id) => {
    const response = await axiosInstance.get(`/user_profile_roles/${id}`);
    return response;
};

export const createUserRole = async (roleData) => {
    const response = await axiosInstance.post("/user_profile_roles", roleData);
    return response;
};

export const updateUserRole = async (id, roleData) => {
    const response = await axiosInstance.put(`/user_profile_roles/${id}`, roleData);
    return response;
};


export const deleteUserRole = async (id) => {
    const response = await axiosInstance.delete(`/user_profile_roles/${id}`);
    return response;
};
