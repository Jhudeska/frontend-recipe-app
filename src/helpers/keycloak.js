import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:9090",
    realm: "receta",
    clientId: "receta-app",
});

export async function initKeycloak() {

    try {

        const authenticated = await keycloak.init({
            onLoad: "check-sso",
            pkceMethod: "S256",
            flow: "standard",
            checkLoginIframe: false,
        });

        console.log("========== KEYCLOAK STATUS ==========");
        console.log("Initialized:", true);
        console.log("Authenticated:", authenticated);
        console.log("JWT Token available:", !!keycloak.token);
        console.log("Token Parsed:", keycloak.tokenParsed);
        console.log("=====================================");

        return authenticated;

    } catch (error) {

        console.error("Keycloak initialization failed:", error);

        throw error;
    }
}

export default keycloak;