import "./Search.css"
import { useEffect, useState} from "react";
import { searchRecipes } from "../../api/recipeService.js";
import { useSearchParams } from "react-router-dom";

function Search() {
    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get("q") || "";

    const [inputValue, setInputValue] = useState(query);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Synchroniseer het zoekveld met de URL
    useEffect(() => {
        setInputValue(query);
    }, [query]);

    // Eén useEffect voor het ophalen van recepten
    useEffect(() => {
        async function fetchRecipes() {
            if (!query.trim()) {
                setRecipes([]);
                setError("");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

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

                {loading && <p>Recepten zoeken...</p>}

                {error && <p role="alert">{error}</p>}

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
                        <p>Geen recepten gevonden.</p>
                    )}
            </div>
        </section>
    );
}
export default Search;