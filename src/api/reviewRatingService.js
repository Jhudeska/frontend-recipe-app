import axiosInstance from "./axiosInstance";

export const getAllReviewRatings = async () => {
    const response = await axiosInstance.get("/review_ratings");
    return response;
};

export const getReviewRatingById = async (id) => {
    const response = await axiosInstance.get(`/review_ratings/${id}`);
    return response;
};

export const createReviewRating = async (userId, reviewRating) => {
    const response = await axiosInstance.post(`/review_ratings/${userId}`, reviewRating);
    return response;
};

export const updateReviewRating = async (id, reviewRating) => {
    const response = await axiosInstance.put(`/review_ratings/${id}`, reviewRating);
    return response;
};


export const deleteReviewRating = async (id) => {
    const response = await axiosInstance.delete(`/review_ratings/${id}`);
    return response;
};
