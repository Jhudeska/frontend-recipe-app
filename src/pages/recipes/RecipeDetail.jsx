import "./RecipeDetail.css";
import {useEffect, useState} from "react";
import {getAllRecipes, getRecipeById} from "../../api/recipeService.js";
import RecipeCard from "../../components/recipecard/RecipeCard.jsx";
import {recipeImages} from "../../helpers/recipeImages.js";
import {Link, useParams} from "react-router-dom";

function RecipeDetail() {
    const [recipe, setRecipes] = useState([null]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { id } = useParams();

    useEffect(() => {
        async function fetchRecipes() {
            try {
                setLoading(true);
                setError("");

                const response = await getRecipeById(id);

                console.log(response.data);
                setRecipes(response.data);
            } catch (error) {
                console.error("Fout bij ophalen van recepten:", error);
                setError(
                    "De recepten konden niet worden geladen. Probeer het later opnieuw."
                );
            }finally {
                setLoading(false);
            }
        } if (id) {
            fetchRecipes();
        }
        // fetchRecipes();
    }, [id]);
    if (loading) {
        return <p className="recipe-message">Recepten laden...</p>;
    }

    if (error) {
        return <p className="recipe-error">{error}</p>;
    }

    if (recipe.length === 0) {
        return <p className="recipe-message">Geen recepten gevonden.</p>;
    }



    return (
        <section className="outer-container page-container">
            <div className="inner-container">
                <div className="recipe-header">
                    <h1 className="page-title recipe-page-title">
                        Recipe Details
                    </h1>

                    <div className="recipe-actions">
                        <Link to="/recipes" className="btn btn-outline">
                            Terug
                        </Link>
                        <button className="btn btn-outline" onClick={() => window.print()}>Print</button>
                        {/*<button className="btn btn-outline" onClick={() => {*/}
                        {/*    const data = JSON.stringify(recipes, null, 2);*/}
                        {/*    const blob = new Blob([data], {*/}
                        {/*        type: "application/json",*/}
                        {/*    });*/}
                        {/*    const url = URL.createObjectURL(blob);*/}
                        {/*    const link = document.createElement("a");*/}

                        {/*    link.href = url;*/}
                        {/*    link.download = "recepten.json";*/}
                        {/*    link.click();*/}

                        {/*    URL.revokeObjectURL(url);*/}
                        {/*}}>Export</button>*/}
                        <button
                            className="btn btn-outline"
                            onClick={() => {
                                const subject = encodeURIComponent(
                                    `Recept: ${recipe.title}`
                                );

                                const body = encodeURIComponent(
                                    `Hoi!\n\nBekijk dit recept: ${recipe.title}\n\n` +
                                    `${recipe.description ?? ""}\n\n` +
                                    `Bekijk het recept hier:\n${window.location.href}`
                                );

                                window.location.href =
                                    `mailto:?subject=${subject}&body=${body}`;
                            }}
                        >
                            Share via e-mail
                        </button>


                </div>


            </div>
                <div className="recipe-card">

                    {/*{recipes.map((recipe) => (*/}

                    {/*    <RecipeCard*/}
                    {/*        key={recipe.recipeId}*/}
                    {/*        recipeId={recipe.recipeId}*/}
                    {/*        title={recipe.title}*/}
                    {/*        name={recipe.description}*/}
                    {/*        servings={recipe.servings}*/}
                    {/*        preparationTime={recipe.preparationTime}*/}
                    {/*        imageUrl={recipe.imageUrl}*/}
                    {/*        fallbackImage={recipeImages[recipe.title]}*/}
                    {/*        ratingSore={recipe.ratingSore}*/}
                    {/*        isFavorite={favorites.some(*/}
                    {/*            (favorite) =>*/}
                    {/*                favorite.recipeId === recipe.recipeId*/}
                    {/*        )}*/}
                    {/*        onToggleFavorite={handleToggleFavorite}*/}
                    {/*    />*/}

                    <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="recipe-image"
                        // onError={(event) => {
                        //     event.currentTarget.onerror = null;
                        //     event.currentTarget.src =
                        //         "/assets/notfound.png";
                        // }}
                    />

                    <div className="recipe-info">
                        <div className="recipe-info-content">
                            <h2 className="recipe-name">{recipe.title}</h2>

                            <div className="recipe-tags">
                                <span className="tag">grillen</span>
                                <span className="tag">grillen</span>
                                <span className="tag">grillen</span>
                                <span className="tag">grillen</span>

                                {/*{recipe.categoryName && (*/}
                                {/*    <span className="tag">*/}
                                {/*        {recipe.categoryName}*/}
                                {/*    </span>*/}
                                {/*)}*/}
                            </div>

                            <p className="recipe-meta">
                                Gerecht &middot;
                                {recipe.servings != null &&
                                `${recipe.servings} personen`} &middot;
                                {recipe.preparationTime != null &&
                                `${recipe.preparationTime} min`}&middot;
                                &#9825;
                            </p>
                        </div>

                        <span className="stars"
                              // aria-label={`Beoordeling: ${recipe.ratingSore} van de 5 sterren`}
                        >
                            &#9733;&#9733;&#9734;&#9734;&#9734;
                            {/*{"★".repeat(recipe.ratingSore)}*/}
                            {/*{"☆".repeat(5 - recipe.ratingSore)}*/}
                        </span>

                    </div>
                    {recipe.description && (
                        <div className="recipe-description">
                            <p>{recipe.description}</p>
                        </div>
                    )}

                    <div className="recipe-details">
                        <div className="recipe-detail-section">
                            <h3>Ingrediënten</h3>

                            <p>
                                Mais
                                <br />
                                Prei
                            </p>
                        </div>

                        {/*<div className="recipe-detail-section">*/}
                        {/*    <h3>Keuken spullen</h3>*/}

                        {/*    <p>*/}
                        {/*        Soeppan*/}
                        {/*        <br />*/}
                        {/*        Grove rasp*/}
                        {/*    </p>*/}
                        {/*</div>*/}
                    </div>

                    <div className="recipe-instructions">
                        <h3>Bereidingswijze</h3>

                        {/*<p>*/}
                        {/*    Lorem Ipsum is simply dummy text of the printing*/}
                        {/*    and typesetting industry. Lorem Ipsum has been*/}
                        {/*    the industry's standard dummy text ever since*/}
                        {/*    1966, when designers at Letraset and James Mosley,*/}
                        {/*    the librarian at St Bride Printing Library in*/}
                        {/*    London, took a 1914 Cicero translation and used*/}
                        {/*    it to make dummy text for Letraset's Body Type*/}
                        {/*    sheets. It has survived not only many decades,*/}
                        {/*    but also the leap into electronic typesetting,*/}
                        {/*    remaining essentially unchanged.*/}
                        {/*</p>*/}

                        {recipe.instructions ? (
                            recipe.instructions
                                .split(/(?=\d+\.\s)/)
                                .filter((step) => step.trim() !== "")
                                .map((step, index) => (
                                    <p key={index}>{step.trim()}</p>
                                ))
                        ) : (
                            <p>Geen bereidingswijze beschikbaar.</p>
                        )}
                    </div>

                    <div className="recipe-comments">
                        <h3>Comments</h3>

                        <p>
                            Lorem Ipsum is simply dummy text of the
                        </p>
                    </div>
                    {/*))}*/}
                </div>
            </div>
        </section>
    );
}

export default RecipeDetail;