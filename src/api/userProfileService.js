import axiosInstance from "./axiosInstance";

export const getAllUserProfiles = async () => {
    const response = await axiosInstance.get("/user_profiles");
    return response;
};

export const getUserProfileById = async (id) => {
    const response = await axiosInstance.get(`/user_profiles/${id}`);
    return response;
};

export const createUserProfile = async (userProfile) => {
    const response = await axiosInstance.post("/user_profiles", userProfile);
    return response;
};

export const updateUserProfile = async (id, userProfile) => {
    const response = await axiosInstance.put(`/user_profiles/${id}`, userProfile);
    return response;
};


export const deleteUserProfile = async (id) => {
    const response = await axiosInstance.delete(`/user_profiles/${id}`);
    return response;
};
