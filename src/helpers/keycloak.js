import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:9090",
    realm: "receta",
    clientId: "receta-app",
});

export default keycloak;