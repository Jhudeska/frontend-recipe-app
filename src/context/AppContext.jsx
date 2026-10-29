import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

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
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);

    if (context === null) {
        throw new Error(
            "useAppContext moet binnen AppProvider worden gebruikt."
        );
    }

    return context;
}
