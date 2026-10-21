import axiosInstance from "./axiosInstance";

export const getAllUserRoles = async () => {
    const response = await axiosInstance.get("/user_profile_roles");
    return response;
};

export const getUserRoleById = async () => {
    const response = await axiosInstance.get("/user_profile_roles/1");
    return response;
};

export const createUserRole = async () => {
    const response = await axiosInstance.post("/user_profile_roles");
    return response;
};

export const updateUserRole = async () => {
    const response = await axiosInstance.put("/user_profile_roles/7");
    return response;
};


export const deleteUserRole = async () => {
    const response = await axiosInstance.delete("/user_profile_roles/7");
    return response;
};
