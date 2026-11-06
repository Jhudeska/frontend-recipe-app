import './Favorites.css';
import { useEffect, useState } from "react";
import { getAllFavorites, deleteFavorite } from "../../api/favoriteService.js";
import MessageLabel from "../../components/messagelabel/MessageLabel.jsx";
import CookingSpinner from "../../components/spinner/CookingSpinner.jsx";
import { useAppContext } from "../../context/AppStatusContext.jsx";
import { convertTimeStampToDate } from "../../helpers/utils.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { getMyUserProfile } from "../../api/userProfileService.js";
import {useFavorites} from "../../context/FavoriteContext.jsx";

function Favorites() {

    const [favorites, setFavorites] = useState([]);
    const { profile } = useAuth();

    const {
        loading,
        setLoading,
        error,
        setError,
        clearError
    } = useAppContext();

    const {
        favoriteItems,
        favoriteLoading,
        favoriteError,
        removeFavorite
    } = useFavorites();


    console.log("Favorieten ophalen gestart");

    // Favorieten ophalen vanuit backend
    async function loadFavorites() {
        try {
            setLoading(true);
            clearError();

            // Eerst het ingelogde gebruikersprofiel ophalen
            const profile = await getMyUserProfile();

            console.log("Ingelogde gebruiker:", profile);

            // Daarna de favorieten ophalen met het juiste userId
            const response = await getAllFavorites(profile.userId);

            console.log("Opgehaalde favorieten:", response);


            setFavorites(response);

        } catch (err) {
            console.error("Favorieten ophalen mislukt:", err);
            setError("Favorieten konden niet worden geladen.");
        } finally {
            setLoading(false);
        }
    }

// TODO:  userid  was niet beschikbaar alleen jwt token dus het  keycloak id moet token achterhalen uiteindelijk  get me gebruikt

    // useEffect(() => {
    //
    //     if (!profile?.userId) {
    //         return;
    //     }
    //
    //     const loadFavorites = async () => {
    //         try {
    //             setLoading(true);
    //             clearError();
    //
    //             const response = await getAllFavorites(profile.userId);
    //
    //             setFavorites(response);
    //
    //         } catch (err) {
    //             console.error("Favorieten ophalen mislukt:", err);
    //             setError("Favorieten konden niet worden geladen.");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //
    //     loadFavorites();
    //
    // }, [profile?.userId, setLoading, clearError, setError]);


    // Favoriet verwijderen
    async function handleDelete(recipeId) {
        try {
            setLoading(true);
            clearError();

            await deleteFavorite(recipeId);

            setFavorites((current) =>
                current.filter(
                    (favorite) => favorite.recipeId !== recipeId
                )
            );

        } catch (err) {
            console.error("Favoriet verwijderen mislukt:", err);
            setError("De favoriet kon niet worden verwijderd.");
        } finally {
            setLoading(false);
        }
    }


    return (

        <section className="outer-container page-container">
            <div className="inner-container">

                <h1 className="page-title">Favorites</h1>

                {favoriteLoading && (
                    <CookingSpinner text="Favorieten laden..." />
                )}

                {favoriteError && (
                    <MessageLabel variant="error">
                        {favoriteError}
                    </MessageLabel>
                )}

                {!favoriteLoading &&
                    !favoriteError &&
                    favoriteItems.length === 0 && (
                        <MessageLabel variant="info">
                            <p>Je hebt nog geen favoriete recepten.</p>
                        </MessageLabel>
                    )}

                {!favoriteLoading &&
                    !favoriteError &&
                    favoriteItems.length > 0 && (

                        <table className="data">
                            <thead>
                            <tr className="thead">
                                <th>Title</th>
                                <th>Toegevoegd op</th>
                                <th>Delete</th>
                            </tr>
                            </thead>

                            <tbody>
                            {favoriteItems.map(favorite => (
                                <tr key={favorite.favoriteId}>
                                    <td>
                                        <strong>
                                            {favorite.recipeTitle}
                                        </strong>
                                    </td>

                                    <td>
                                        {favorite.created_at
                                            ? convertTimeStampToDate(favorite.created_at)
                                            : "-"
                                        }
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className="mini-btn x"
                                            onClick={() => removeFavorite(favorite.recipeId)}
                                        >
                                            x
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}

            </div>
        </section>

    );
}

export default Favorites;

