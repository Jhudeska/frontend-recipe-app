import { createContext, useContext, useState } from "react";

const AppStatusContext = createContext(null);

export function AppProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function clearError() {
        setError(null);
    }

    const value = {
        loading,
        setLoading,
        error,
        setError,
        clearError,
    };

    return (
        <AppStatusContext.Provider value={value}>
            {children}
        </AppStatusContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppStatusContext);

    if (context === null) {
        throw new Error(
            "useAppContext moet binnen AppProvider worden gebruikt."
        );
    }

    return context;
}
