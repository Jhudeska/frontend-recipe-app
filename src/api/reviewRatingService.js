import axiosInstance from "./axiosInstance";

export const getAllReviewRatings = async () => {
    const response = await axiosInstance.get("/review_ratings");
    return response;
};

export const getReviewRatingById = async () => {
    const response = await axiosInstance.get("/review_ratings/1");
    return response;
};

export const createReviewRating = async () => {
    const response = await axiosInstance.post("/review_ratings");
    return response;
};

export const updateReviewRating = async () => {
    const response = await axiosInstance.put("/review_ratings/7");
    return response;
};


export const deleteReviewRating = async () => {
    const response = await axiosInstance.delete("/review_ratings/7");
    return response;
};
