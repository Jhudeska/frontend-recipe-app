import axiosInstance from "./axiosInstance";

export const getAllUserProfiles = async () => {
    const response = await axiosInstance.get("/user_profiles");
    return response;
};

export const getUserProfileById = async () => {
    const response = await axiosInstance.get("/user_profiles/1");
    return response;
};

export const createUserProfile = async () => {
    const response = await axiosInstance.post("/user_profiles");
    return response;
};

export const updateUserProfile = async () => {
    const response = await axiosInstance.put("/user_profiles/7");
    return response;
};


export const deleteUserProfile = async () => {
    const response = await axiosInstance.delete("/user_profiles/7");
    return response;
};
