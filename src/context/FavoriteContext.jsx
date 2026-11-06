import { createContext, useContext, useState , useEffect} from "react";
import { getAllFavorites, createFavorite, deleteFavorite } from "../api/favoriteService.js";
import { useAuth } from "./AuthContext.jsx";


const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {

    const { profile, isAuthenticated } = useAuth();

    const [favorites, setFavorites] = useState([]);
    const [favoriteItems, setFavoriteItems] = useState([]);

    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [favoriteError, setFavoriteError] = useState("");

    console.log("FavoriteContext profile:", profile);
    console.log("FavoriteContext isAuthenticated:", isAuthenticated);
    console.log("FavoriteContext userId:", profile?.userId);


    // // Favorite toevoegen of verwijderen
    function toggleFavorite(recipeId) {
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(recipeId)) {
                return prevFavorites.filter(
                    (id) => id !== recipeId
                );
            }

            return [...prevFavorites, recipeId];
        });
    }

    // Favorieten ophalen voor de ingelogde gebruiker
    useEffect(() => {

        if (!isAuthenticated || !profile?.userId) {
            setFavorites([]);
            setFavoriteItems([]);
            return;
        }

        let active = true;

    async function loadFavorites() {

        try {
            setFavoriteLoading(true);
            setFavoriteError("");

            const response = await getAllFavorites(profile.userId);

            if (!active) return;

            setFavoriteItems(response);

            setFavorites(
                response.map(favorite => favorite.recipeId)
            );

            console.log("Favorieten geladen:", response);
            console.log("User ID:", profile.userId);

        } catch (error) {

            if (!active) return;

            console.error("Favorieten ophalen mislukt:", error);

            setFavoriteError(
                "Favorieten konden niet worden geladen."
            );

        } finally {

            if (active) {
                setFavoriteLoading(false);
            }
        }
    }

    loadFavorites();

    return () => {
        active = false;
    };
    }, [profile?.userId, isAuthenticated]);

    // Controleren of recept favoriet is
    function isRecipeFavorite(recipeId) {
        return favorites.includes(recipeId);
    }


    // Favoriet toevoegen
    async function addFavorite(recipeId) {

        if (!isAuthenticated || !profile?.userId) {
            throw new Error("Je moet ingelogd zijn.");
        }

        const newFavorite = await createFavorite(
            profile.userId,
            recipeId
        );

        setFavoriteItems(current => [
            ...current,
            newFavorite
        ]);

        setFavorites(current => [
            ...current,
            recipeId
        ]);
    }

    // Favoriet verwijderen
    async function removeFavorite(recipeId) {

        await deleteFavorite(
            profile.userId,
            recipeId
        );

        setFavoriteItems(current =>
            current.filter(
                favorite => favorite.recipeId !== recipeId
            )
        );

        setFavorites(current =>
            current.filter(id => id !== recipeId)
        );
    }

    // Favoriet toevoegen of verwijderen
    async function toggleFavorite(recipeId) {

        if (!isAuthenticated || !profile?.userId) {
            throw new Error("Je moet ingelogd zijn.");
        }

        if (isRecipeFavorite(recipeId)) {
            await removeFavorite(recipeId);
        } else {
            await addFavorite(recipeId);
        }
    }
    // // Controleren of een recept favoriet is
    function isRecipeFavorite(recipeId) {
        return favorites.includes(recipeId);
    }

    // Alle favorieten verwijderen
    function clearFavorites() {
        setFavorites([]);
        setFavoriteItems([]);
    }

    return (
        <FavoriteContext.Provider
            value={{
                favorites,
                favoriteItems,
                favoriteLoading,
                favoriteError,
                isRecipeFavorite,
                addFavorite,
                removeFavorite,
                toggleFavorite,
                isRecipeFavorite,
                clearFavorites
            }}
        >
            {children}
        </FavoriteContext.Provider>
    );
}

// Custom hook
export function useFavorites() {
    const context = useContext(FavoriteContext);

    if (!context) {
        throw new Error(
            "useFavorites moet binnen FavoriteProvider gebruikt worden"
        );
    }

    return context;
}
