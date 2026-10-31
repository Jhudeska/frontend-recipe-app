import { createContext, useContext, useState, useEffect } from "react";
import keycloak from "../helpers/keycloak.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {
        if (!keycloak.authenticated) {
            return null;
        }

        return {
            username: keycloak.tokenParsed?.preferred_username,
            email: keycloak.tokenParsed?.email,
            firstName: keycloak.tokenParsed?.given_name,
            lastName: keycloak.tokenParsed?.family_name,
        };
    });

    // const [user, setUser] = useState(null);
    // const [roles, setRoles] = useState([]);
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [roles, setRoles] = useState(() => {
        return keycloak.tokenParsed?.resource_access?.["receta-app"]?.roles ?? [];
    });

    const [isAuthenticated, setIsAuthenticated] = useState(
        keycloak.authenticated ?? false
    );

    useEffect(() => {

        function updateAuthState() {

            const authenticated = keycloak.authenticated ?? false;

            setIsAuthenticated(authenticated);

            if (authenticated) {

                setUser({
                    username: keycloak.tokenParsed?.preferred_username,
                    email: keycloak.tokenParsed?.email,
                    firstName: keycloak.tokenParsed?.given_name,
                    lastName: keycloak.tokenParsed?.family_name,
                });

                setRoles(
                    keycloak.tokenParsed?.resource_access?.["receta-app"]?.roles ?? []
                );

            } else {

                setUser(null);
                setRoles([]);

            }
        }

        keycloak.onAuthSuccess = updateAuthState;
        keycloak.onAuthLogout = updateAuthState;
        keycloak.onAuthRefreshSuccess = updateAuthState;

        return () => {
            keycloak.onAuthSuccess = null;
            keycloak.onAuthLogout = null;
            keycloak.onAuthRefreshSuccess = null;
        };

    }, []);


    const value = {
        user,
        roles,
        isAuthenticated,
        login,
        register,
        logout,
    };

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
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

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


// Je houdt verantwoordelijkheden gescheiden:
//
//     AppContext: algemene applicatiestatus zoals loading en error.
//
//     AuthContext: authenticatiegegevens zoals gebruiker, rollen en inlogstatus.
//
//     Dat maakt je applicatie overzichtelijker en makkelijker onderhoudbaar.


// Maar onthoud:
//
//     AuthContext is het gedeelde communicatiekanaal.
//
//     AuthProvider levert de gegevens.
//
// useAuth() haalt de gegevens op.