import {createContext, useContext, useState, useEffect, useCallback} from "react";
import keycloak from "../helpers/keycloak.js";
import { getMyUserProfile } from "../api/userProfileService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState(null);



    const loadProfile = useCallback(async () => {

        if (!keycloak.authenticated) {
            setProfile(null);
            return;
        }

        try {

            const response = await getMyUserProfile();

            if (!response?.userId) {
                throw new Error("Database userId ontbreekt.");
            }

            setProfile(response);

            console.log("Database profiel:", response);
            console.log("Database userId:", response?.userId);

        } catch (error) {

            console.error("Profiel ophalen mislukt:", error);
            setProfile(null);

        }

    }, []);

    // Controleer de actuele Keycloak-status
   const updateAuthState = useCallback(async() => {

        const authenticated = keycloak.authenticated ?? false;

        console.log("========== AUTH CONTEXT ==========");
        console.log("Authenticated:", authenticated);
        console.log("JWT available:", !!keycloak.token);
        console.log("Username:", keycloak.tokenParsed?.preferred_username);

        console.log(
            "Roles:",
            keycloak.tokenParsed
                ?.resource_access
                ?.["receta-app"]
                ?.roles ?? []
        );

        console.log("==================================");

        setIsAuthenticated(authenticated);

        if (authenticated && keycloak.tokenParsed) {

            const token = keycloak.tokenParsed;

            const clientRoles =
                token.resource_access
                    ?.["receta-app"]
                    ?.roles ?? [];


            setUser({
                keycloakId: token.sub,
                username: keycloak.tokenParsed?.preferred_username,
                email: keycloak.tokenParsed?.email,
                firstName: keycloak.tokenParsed?.given_name,
                lastName: keycloak.tokenParsed?.family_name,
            });

            // setRoles(
            //     keycloak.tokenParsed
            //         ?.resource_access
            //         ?.["receta-app"]
            //         ?.roles ?? []
            // );
            setRoles(clientRoles);
            // setIsAuthenticated(true);
            try {
                await loadProfile();
            } catch (error) {
                console.error("Profiel laden mislukt:", error);
            }
            loadProfile();
        } else {

            setUser(null);
            setProfile(null);
            setRoles([]);
            // setIsAuthenticated(false);

        }
    }, [loadProfile]);



    // Keycloak initialisatie is al uitgevoerd in main.jsx
    useEffect(() => {

        // Bestaande Keycloak-status ophalen
        updateAuthState();

        // Keycloak events
        keycloak.onAuthSuccess = updateAuthState;
        keycloak.onAuthLogout = updateAuthState;
        keycloak.onAuthRefreshSuccess = updateAuthState;
        keycloak.onAuthRefreshError = updateAuthState;

        // Keycloak is al geïnitialiseerd
        setIsLoading(false);

        return () => {
            keycloak.onAuthSuccess = null;
            keycloak.onAuthLogout = null;
            keycloak.onAuthRefreshSuccess = null;
            keycloak.onAuthRefreshError = null;
        };

    }, [updateAuthState]);


    // Controleer één rol.
    const hasRole = useCallback((role) => {

        return roles.includes(role);

    }, [roles]);


    // Controleer meerdere rollen.
    const hasAnyRole = useCallback((allowedRoles) => {

        return allowedRoles.some(role =>
            roles.includes(role)
        );

    }, [roles]);

    //
    //
    // const loadProfile = useCallback(async () => {
    //     if (!keycloak.authenticated) {
    //         setProfile(null);
    //         return;
    //     }
    //
    //     try {
    //         const response = await getMyUserProfile();
    //
    //         setProfile(response);
    //
    //         console.log("Database profiel:", response);
    //
    //     } catch (error) {
    //         console.error("Profiel ophalen mislukt:", error);
    //         setProfile(null);
    //     }
    // }, []);



    async function login() {
        try {
            await keycloak.login({
                redirectUri: window.location.origin,
            });
        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    async function register() {
        try {
            await keycloak.register({
                redirectUri: window.location.origin,
            });
        } catch (error) {
            console.error("Registration failed:", error);
        }
    }

    async function logout() {
        try {
            await keycloak.logout({
                redirectUri: window.location.origin,
            })

        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    const value = {
        user,
        profile,
        roles,
        isAuthenticated,
        isLoading,
        hasRole,
        hasAnyRole,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {

    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error(
            "useAuth moet binnen AuthProvider worden gebruikt."
        );
    }

    return context;
}

export default AuthContext;
