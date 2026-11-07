import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import { initKeycloak } from './helpers/keycloak.js';
import {AppProvider} from "./context/AppStatusContext.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import {FavoriteProvider} from "./context/FavoriteContext.jsx";

async function startApp() {

    try {

        await initKeycloak();

        createRoot(
            document.getElementById("root")
        ).render(
            // <StrictMode>
                <BrowserRouter>
                    <AppProvider>
                        <AuthProvider>
                                <FavoriteProvider>
                                <App />
                                </FavoriteProvider>
                        </AuthProvider>
                    </AppProvider>
                </BrowserRouter>
            // </StrictMode>
        );

    } catch (error) {

        console.error("Application startup failed:", error);
    }
}

startApp();