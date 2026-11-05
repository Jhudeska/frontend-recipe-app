import "./Search.css"
import { useEffect, useState} from "react";
import { searchRecipes } from "../../api/recipeService.js";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../../context/AppStatusContext.jsx";
import CookingSpinner from "../spinner/CookingSpinner.jsx";
import MessageLabel from "../messagelabel/MessageLabel.jsx";

function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const {loading, setLoading, error, setError, clearError } = useAppContext();

    const query = searchParams.get("q") || "";

    const [inputValue, setInputValue] = useState(query);
    const [recipes, setRecipes] = useState([]);


    // Synchroniseer het zoekveld met de URL
    useEffect(() => {
        setInputValue(query);
    }, [query]);


    // Eén useEffect voor het ophalen van recepten
    useEffect(() => {
        async function fetchRecipes() {
            if (!query.trim()) {
                setRecipes([]);
                clearError();
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                clearError();

                const response = await searchRecipes(query);
                setRecipes(response.data);

            } catch (error) {
                console.error("Zoeken mislukt:", error);

                setError("Zoeken is mislukt. Probeer het opnieuw.");
                setRecipes([]);
            } finally {
                setLoading(false);
            }
        }

        fetchRecipes();
    }, [query]);

    function handleSearch(event) {
        event.preventDefault();

        const searchQuery = inputValue.trim();

        setSearchParams(
            searchQuery ? { q: searchQuery } : {}
        );
    }

    return (
        <section className="outer-container page">
            <div className="inner-container">
                <h1>Search</h1>

                <form onSubmit={handleSearch}>
                    <input
                        type="search"
                        name="search"
                        placeholder="Search recipes..."
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                    />

                    <button type="submit"
                            className="btn btn-outline"
                            disabled={loading}
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </form>

                {loading && (
                    <CookingSpinner text="Recepten zoeken..." />
                )}

                {error && (
                    <MessageLabel variant="error">
                        {error}
                    </MessageLabel>
                )}

                {!loading && !error && recipes.length > 0 && (
                    <div className="recipe-list">
                        {recipes.map((recipe) => (
                            <article
                                className="recipe-card"
                                key={recipe.recipeId}
                            >
                                {recipe.imageUrl && (
                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.title}
                                    />
                                )}

                                <h2>{recipe.title}</h2>

                                <p>{recipe.description}</p>

                                <p>
                                    <strong>Bereidingstijd:</strong>{" "}
                                    {recipe.preparationTime} minuten
                                </p>

                                <p>
                                    <strong>Porties:</strong>{" "}
                                    {recipe.servings}
                                </p>

                                <h3>Bereidingswijze</h3>
                                <p>{recipe.instructions}</p>
                            </article>
                        ))}
                    </div>
                )}

                {!loading &&
                    !error &&
                    query.trim() !== "" &&
                    recipes.length === 0 && (
                        <MessageLabel variant="info">
                            Geen recepten gevonden.
                        </MessageLabel>
                    )}
            </div>
        </section>
    );
}
export default Search;