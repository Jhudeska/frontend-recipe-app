import axios from "axios";
// import keycloak from "../helpers/keycloak.js";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${keycloak.token}`
    },
});

export default axiosInstance;