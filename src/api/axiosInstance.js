import axios from "axios";
import keycloak from "../helpers/keycloak.js";
// import keycloak from "../helpers/keycloak.js";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// Bij iedere request het actuele Keycloak-token ophalen
axiosInstance.interceptors.request.use(
    async (config) => {

        if (keycloak.authenticated) {

            try {
                // Vernieuw token indien nodig
                await keycloak.updateToken(30);

                config.headers.Authorization =
                    `Bearer ${keycloak.token}`;

                console.log("JWT meegestuurd:", !!keycloak.token);

            } catch (error) {
                console.error("Token vernieuwen mislukt:", error);
                return Promise.reject(error);
            }

        } else {
            delete config.headers.Authorization;
            console.log("Gebruiker niet ingelogd");
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;