import './Recipes.css'
import soup from "../../assets/kippensoep.png";
import {Link} from "react-router-dom";
import{ useEffect, useState } from "react";
import {
    getAllRecipes,
    deleteRecipe,
} from "../../api/recipeService.js";
import CookingSpinner from "../../components/spinner/CookingSpinner.jsx";
import MessageLabel from "../../components/messagelabel/MessageLabel.jsx";
import Button from "../../components/button/Button.jsx";
// import { deleteRecipe } from "../../api/recipeService.js";
import { useNavigate } from "react-router-dom";


function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function fetchRecipes() {
        try {
            setError("");

            const response = await getAllRecipes();
            setRecipes(response.data);
        } catch (err) {
            setError(<MessageLabel variant="error">Recipes ophalen mislukt.</MessageLabel> );
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRecipes();
    }, []);


    async function handleDelete(id) {
        if (!window.confirm("Recipe verwijderen?")) return;

        try {
            await deleteRecipe(id);
            await fetchRecipes();
        } catch (err) {
            setError("Recipe verwijderen mislukt.");
            console.error(err);
        }
    }

    if (loading) {
        return <CookingSpinner text="Recipes laden..."> <p>Recipes laden...</p> </CookingSpinner>;
    }

    const handleDeleteRecipe = async (recipeId) => {
        const confirmed = window.confirm(
            "Weet je zeker dat je dit recept wilt verwijderen?"
        );

        if (!confirmed) return;

        try {
            await deleteRecipe(recipeId);

            setRecipes((previousRecipes) =>
                previousRecipes.filter(
                    (recipe) => recipe.recipeId !== recipeId
                )
            );
        } catch (error) {
            console.error("Error deleting recipe:", error);

            alert(
                error.response?.data?.message ||
                "Het recept kon niet worden verwijderd."
            );
        }
    };
    return (
        <section className="outer-container page-container">
            <div className="inner-container">
                <h1>My Recipes</h1>

                {error && <p role="alert">{error}</p>}
                <table className="data">
                    <thead>
                    <tr className="thead">
                        <th></th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    </thead>

                    <tbody>
                    {recipes.map((recipe) => (
                    <tr key={recipe.id}>
                        <td>
                            {/*<img className="recipes_img" src={recipe.imageUrl || soup} alt={recipe.name} />*/}
                            <img
                                className="recipes_img"
                                src={
                                    recipe.imageUrl
                                        ? recipe.imageUrl.startsWith("http")
                                            ? recipe.imageUrl
                                            : `http://localhost:8080${recipe.imageUrl.startsWith("/") ? "" : "/"}${recipe.imageUrl}`
                                        : soup
                                }
                                alt={recipe.title || "Recipe"}
                            />
                        </td>
                        <td>
                            <Link to={`/recipes/${recipe.recipeId}`} className="btn btn-outline">
                                <strong>{recipe.title}</strong>
                            </Link>

                        </td>
                        <td>{recipe.description}</td>
                        <td>
                            <Button
                                // to="/update_recipes"
                                state={{ recipeId: recipe.id }}
                                btnColor="gray-outline"
                                text="Edit"
                                // handleClick={() => navigate("/update_recipes")}
                                handleClick={() => navigate(`/recipes/${recipe.recipeId}/edit`)}
                            >

                            </Button>
                        </td>
                        <td>
                            <Button
                                btnColor="gray-outline"
                                text="Delete"
                                handleClick={() => handleDeleteRecipe(recipe.id)}
                            >
                                Delete
                            </Button>
                        </td>

                    </tr>
                    ))}
                    {recipes.length === 0 && (
                        <tr>
                        <td colSpan="5">
                        No recipes found.
                        </td>
                        </tr>
                        )}
                    </tbody>
                </table>

                <div style={{ textAlign: "right", marginTop: "16px" }}>
                    <Button
                        // to="/add_recipes"
                        text="Add Recipe"
                        btnColor="green-filled"
                        buttonType="button"
                        handleClick={() => navigate("/add_recipes")}
                    >
                    </Button>
                </div>

            </div>
        </section>
    )
}

export default Recipes