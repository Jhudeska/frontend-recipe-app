import './OverView.css'
import { Link } from "react-router-dom";
import RecipeCard from "../../components/recipecard/RecipeCard.jsx";
import { useEffect, useState } from "react";
import CookingSpinner from "../../components/spinner/CookingSpinner.jsx";
import {recipeImages} from "../../helpers/recipeImages.js";
import {
    getAllFavorites,
    createFavorite,
    deleteFavorite
} from "../../api/favoriteService.js";
import {getAllRecipes} from "../../api/recipeService.js";
import MessageLabel from "../../components/messagelabel/MessageLabel.jsx";
import keycloak from "../../helpers/keycloak.js";


function Overview() {
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [favoriteError, setFavoriteError] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    console.log(keycloak.token);

    useEffect(() => {
        async function fetchRecipes() {
            try {
                setLoading(true);
                setError("");

                const response = await getAllRecipes();

                console.log("Recepten uit de backend:", response.data);

                setRecipes(response.data);
            } catch (error) {
                console.error("Fout bij ophalen van recepten:", error);
                setError(
                    "De recepten konden niet worden geladen. Probeer het later opnieuw."
                );
            }finally {
                setLoading(false);
            }
        }

        console.log(recipes);
        fetchRecipes();
    }, []);


    useEffect(() => {
        async function fetchFavorites() {
            try {
                const data = await getAllFavorites();
                setFavorites(data);
            } catch (error) {
                console.error("Favorieten ophalen mislukt:", error);
                setFavoriteError("Favorieten konden niet worden geladen.");
            }
        }

        fetchFavorites();
    }, []);

    async function handleToggleFavorite(recipeId) {
        if (recipeId == null) {
            setFavoriteError("Dit recept heeft geen geldig ID.");
            return;
        }

        setFavoriteError("");

        const isFavorite = favorites.some(
            (favorite) => favorite.recipeId === recipeId
        );

        try {
            if (isFavorite) {
                await deleteFavorite(recipeId);

                setFavorites((current) =>
                    current.filter(
                        (favorite) => favorite.recipeId !== recipeId
                    )
                );
            } else {
                const newFavorite = await createFavorite(recipeId);

                setFavorites((current) => [
                    ...current,
                    newFavorite
                ]);
            }
        } catch (error) {
            console.error("Favoriet wijzigen mislukt:", error);
            setFavoriteError(
                "De favoriet kon niet worden gewijzigd. Probeer het opnieuw."
            );
        }
    }


    return (
        <section className="outer-container page-container">
            <div className="inner-container">
                {loading && <p><CookingSpinner  text="Recepten bereiden..."/></p>}

                {error && <MessageLabel variant="error"><p role="alert">{error}</p></MessageLabel>}

                {!loading && !error && recipes.length === 0 && (
                    <MessageLabel variant="error"><p>Er zijn nog geen recepten beschikbaar.</p></MessageLabel>
                )}

                {favoriteError && (
                    <MessageLabel variant="error"><p role="alert">{favoriteError}</p></MessageLabel>
                )}

                <h3>
                    Welcome, {" "}
                    {keycloak.tokenParsed?.preferred_username}
                </h3>

                <div className="home-intro">
                    <h2 className="home-intro__text">
                        Got A Recipe That Rocks?
                    </h2>

                    <Link to="/add_recipes"
                          className="green-filled home-intro__button"
                    >
                        + Add Recipe
                    </Link>
                </div>

                    <div className="section-title">
                        &#128176; Recommended
                    </div>

                <div className="cards">
                    {recipes.map((recipe) => (

                        <RecipeCard
                            key={recipe.recipeId}
                            recipeId={recipe.recipeId}
                            title={recipe.title}
                            description={recipe.description}
                            servings={recipe.servings}
                            preparationTime={recipe.preparationTime}
                            imageUrl={recipe.imageUrl}
                            fallbackImage={recipeImages[recipe.title]}
                            ratingSore={recipe.ratingSore}
                            isFavorite={favorites.some(
                                (favorite) =>
                                    favorite.recipeId === recipe.recipeId
                            )}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>

                <div className="section-title">
                    &#127760; Populair
                </div>

                <div className="cards">
                    {recipes.map((recipe) => (

                        <RecipeCard
                            key={recipe.recipeId}
                            recipeId={recipe.recipeId}
                            title={recipe.title}
                            description={recipe.description}
                            servings={recipe.servings}
                            preparationTime={recipe.preparationTime}
                            imageUrl={recipe.imageUrl}
                            fallbackImage={recipeImages[recipe.title]}
                            ratingSore={recipe.ratingSore}
                            isFavorite={favorites.some(
                                (favorite) =>
                                    favorite.recipeId === recipe.recipeId
                            )}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Overview