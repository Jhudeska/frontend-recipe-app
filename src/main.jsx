import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import keycloak from "./helpers/keycloak.js";
import {AppProvider} from "./context/AppContext.jsx";

keycloak.init({
    onLoad: "login-required",
    pkceMethod: "S256",
    flow: "standard",
}).then((authenticated) => {
    if (authenticated) {
        createRoot(
            document.getElementById("root")
        ).render(
            <StrictMode>
                <BrowserRouter>
                        <AppProvider>
                            <App />
                        </AppProvider>
                </BrowserRouter>
            </StrictMode>
        );
    }
}).catch((error) => {
    console.error("Keycloak login mislukt:", error);
});