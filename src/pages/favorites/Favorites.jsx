import { useEffect, useState } from "react";
import './Favorites.css'
import  soup from '../../assets/kippensoep.png'
import {
    getAllFavorites,
    deleteFavorite,
    createFavorite
} from "../../api/favoriteService.js";
import MessageLabel from "../../components/messagelabel/MessageLabel.jsx";
import CookingSpinner from "../../components/spinner/CookingSpinner.jsx";


function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadFavorites() {
        try {
            setError("");
            const response = await getAllFavorites();
            setFavorites(response);
        } catch (err) {
            console.error("Favorieten ophalen mislukt:", err);
            setError("Favorieten konden niet worden geladen.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadFavorites();
    }, []);

    async function handleDelete(recipeId) {
        try {
            await deleteFavorite(recipeId);

            setFavorites((current) =>
                current.filter(
                    (favorite) => favorite.recipeId !== recipeId
                )
            );
        } catch (err) {
            console.error("Favoriet verwijderen mislukt:", err);
            setError("De favoriet kon niet worden verwijderd.");
        }
    }

    // console.log(getAllFavorites())
    return (
        <section className="outer-container page-container">
            <div className="inner-container">
                <h1 className="page-title">Favorites</h1>

                {loading && <p><CookingSpinner  text="Favorieten laden..."/></p>}
                {error && <p role="alert">{error}</p>}

                {!loading && !error && favorites.length === 0 && (
                    <MessageLabel variant="info"><p>Je hebt nog geen favoriete recepten.</p></MessageLabel>
                )}

                {!loading && favorites.length > 0 && (
                    <table className="data">
                        <thead>
                        <tr className="thead">
                            <th>Title</th>
                            <th>Toegevoegd op</th>
                            <th>Delete</th>
                        </tr>
                        </thead>

                        <tbody>
                        {favorites.map((favorite) => (
                            <tr key={favorite.favoriteId}>
                                <td>
                                    <strong>
                                        {favorite.recipeTitle}
                                    </strong>
                                </td>
                                <td>
                                    {favorite.created_at
                                        ? new Date(
                                            favorite.created_at
                                        ).toLocaleDateString("nl-NL")
                                        : "-"}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="mini-btn x"
                                        onClick={() =>
                                            handleDelete(
                                                favorite.recipeId
                                            )
                                        }
                                        aria-label={`Verwijder ${favorite.recipeTitle} uit favorieten`}
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

export default Favorites