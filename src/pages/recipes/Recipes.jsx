import './Recipes.css'
import soup from "../../assets/kippensoep.png";
import {Link, useNavigate} from "react-router-dom";
import{ useEffect, useState } from "react";
import {getAllRecipes, deleteRecipe} from "../../api/recipeService.js";
import CookingSpinner from "../../components/spinner/CookingSpinner.jsx";
import MessageLabel from "../../components/messagelabel/MessageLabel.jsx";
import Button from "../../components/button/Button.jsx";
import { useAppContext } from "../../context/AppStatusContext.jsx";


function Recipes() {
    const [recipes, setRecipes] = useState([]);

    const navigate = useNavigate();
    const {loading, setLoading, error, setError, clearError } = useAppContext();


    async function fetchRecipes() {
        try {
            setLoading(true);
            clearError();

            const response = await getAllRecipes();

            setRecipes(response.data);

        } catch (error) {
            console.error("Recipes ophalen mislukt:", error);

            setError("Recipes ophalen mislukt.");

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRecipes();
    }, []);


    const handleDeleteRecipe = async (recipeId) => {

        const confirmed = window.confirm(
            "Weet je zeker dat je dit recept wilt verwijderen?"
        );

        if (!confirmed) return;

        try {
            setLoading(true);
            clearError();

            await deleteRecipe(recipeId);
            await fetchRecipes();


            setRecipes((previousRecipes) =>
                previousRecipes.filter(
                    (recipe) => recipe.recipeId !== recipeId
                )
            );
        } catch (error) {
            console.error("Recipe verwijderen mislukt.", error);

            setError(
                error.response?.data?.message ||
                "Het recept kon niet worden verwijderd."
            );
        }finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <CookingSpinner text="Recipes laden...">
                <p>Recipes laden...</p>
            </CookingSpinner>
        );
    }

    return (
        <section className="outer-container page-container">
            <div className="inner-container">
                <h1>My Recipes</h1>

                {error && (
                    <MessageLabel variant="error">
                        {error}
                    </MessageLabel>
                )}

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
                    <tr key={recipe.recipeId}>
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
                        {/*<td>*/}
                        {/*    <img*/}
                        {/*        className="recipes_img"*/}
                        {/*        src={getImageUrl(recipe.imageUrl) || soup}*/}
                        {/*        alt={recipe.title || "Recipe"}*/}
                        {/*    />*/}
                        {/*</td>*/}
                        <td>
                            <Link to={`/recipes/${recipe.recipeId}`} className="btn btn-outline">
                                <strong>{recipe.title}</strong>
                            </Link>

                        </td>
                        <td>{recipe.description}</td>
                        <td>
                            <Button
                                btnColor="gray-outline"
                                text="Edit"
                                onClick={() => navigate(`/recipes/${recipe.recipeId}/edit`)}
                            >

                            </Button>
                        </td>
                        <td>
                            <Button
                                btnColor="gray-outline"
                                text="Delete"
                                onClick={() => handleDeleteRecipe(recipe.recipeId)}
                            >
                            </Button>
                        </td>

                    </tr>
                    ))}
                    {recipes.length === 0 && (
                        <tr>
                        <td colSpan="5">
                            <MessageLabel variant="info">
                                No recipes found.
                            </MessageLabel>
                        </td>
                        </tr>
                        )}
                    </tbody>
                </table>

                <div className="recipes-actions">
                    <Button
                        text="Add Recipe"
                        btnColor="green-filled"
                        buttonType="button"
                        onClick={() => navigate("/add_recipes")}
                    >
                    </Button>
                </div>

            </div>
        </section>
    )
}

export default Recipes