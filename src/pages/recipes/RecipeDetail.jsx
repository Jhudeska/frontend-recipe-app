import "./RecipeDetail.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRecipeById } from "../../api/recipeService.js";
import { getAllReviewRatings } from "../../api/reviewRatingService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../../components/button/Button.jsx";

function RecipeDetail() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [recipe, setRecipe] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const fetchRecipeDetails = async () => {
            try {
                setLoading(true);
                setError("");

                // Recept ophalen
                const recipeResponse = await getRecipeById(id);

                if (!active) return;

                const recipeData = recipeResponse.data;
                setRecipe(recipeData);

                console.log("Recipe:", recipeData);

                // Alle beoordelingen ophalen
                const reviewResponse = await getAllReviewRatings();

                if (!active) return;

                const allReviews = Array.isArray(reviewResponse.data)
                    ? reviewResponse.data
                    : reviewResponse.data?.content ??
                    reviewResponse.data?.reviewRatings ??
                    [];

                console.log("Alle beoordelingen:", allReviews);

                // Alleen beoordelingen van dit recept ophalen
                const recipeReviews = allReviews.filter(
                    (review) =>
                        Number(
                            review.recipeId ??
                            review.recipe?.recipeId
                        ) === Number(id)
                );

                console.log("Beoordelingen van dit recept:", recipeReviews);

                setReviews(recipeReviews);

            } catch (err) {
                console.error("Fout bij ophalen receptgegevens:", err);

                if (active) {
                    setError(
                        "Het recept kon niet worden geladen. Probeer het later opnieuw."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchRecipeDetails();
        } else {
            setError("Geen recept-ID gevonden.");
            setLoading(false);
        }

        return () => {
            active = false;
        };
    }, [id]);

    // Ratingwaarden ophalen
    const getRatingValue = (review) => {
        return Number(
            review.ratingValue ??
            review.ratingScore ??
            review.rating ??
            review.stars ??
            0
        );
    };

    // Gemiddelde rating berekenen
    const validRatings = reviews
        .map(getRatingValue)
        .filter((rating) =>
            Number.isFinite(rating) && rating >= 1 && rating <= 5
        );

    const averageRating =
        validRatings.length > 0
            ? validRatings.reduce((total, rating) => total + rating, 0) /
            validRatings.length
            : 0;

    // Sterren weergeven
    const renderStars = (rating) => {
        const roundedRating = Math.round(rating);

        return (
            <span className="stars">
                {"★".repeat(roundedRating)}
                {"☆".repeat(5 - roundedRating)}
            </span>
        );
    };

    // Datum formatteren
    const formatDate = (date) => {
        if (!date) return "";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleDateString("nl-NL");
    };

    if (loading) {
        return (
            <p className="recipe-message">
                Recept laden...
            </p>
        );
    }

    if (error) {
        return (
            <p className="recipe-error">
                {error}
            </p>
        );
    }

    if (!recipe) {
        return (
            <p className="recipe-message">
                Geen recept gevonden.
            </p>
        );
    }

    // Ingrediënten ophalen
    const ingredients =
        recipe.ingredients ??
        recipe.recipeIngredients ??
        [];

    return (
        <section className="outer-container page-container">
            <div className="inner-container">

                {/* Header */}
                <div className="recipe-header">

                    <h1 className="page-title recipe-page-title">
                        Recipe Details
                    </h1>

                    <div className="recipe-actions">

                        <button
                            className="btn btn-outline"
                            onClick={() => window.print()}
                        >
                            Print
                        </button>

                        <button
                            className="btn btn-outline"
                            onClick={() => {
                                const subject = encodeURIComponent(
                                    `Recept: ${recipe.title}`
                                );

                                const body = encodeURIComponent(
                                    `Hoi!\n\n` +
                                    `Bekijk dit recept: ${recipe.title}\n\n` +
                                    `${recipe.description ?? ""}\n\n` +
                                    `Bekijk het recept hier:\n` +
                                    `${window.location.href}`
                                );

                                window.location.href =
                                    `mailto:?subject=${subject}&body=${body}`;
                            }}
                        >
                            Share via e-mail
                        </button>

                    </div>
                </div>

                {/* Receptkaart */}
                <div className="recipe-card">

                    {/* Afbeelding */}
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="recipe-image"
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />

                    {/* Receptinformatie */}
                    <div className="recipe-info">

                        <div className="recipe-info-content">

                            <h2 className="recipe-name">
                                {recipe.title}
                            </h2>

                            <div className="recipe-tags">
                                {recipe.categoryName && (
                                    <span className="tag">
                                        {recipe.categoryName}
                                    </span>
                                )}

                                {recipe.category?.name && (
                                    <span className="tag">
                                        {recipe.category.name}
                                    </span>
                                )}
                            </div>

                            <p className="recipe-meta">
                                Gerecht &middot;{" "}
                                {recipe.servings != null &&
                                    `${recipe.servings} personen`}
                                {" "}&middot;{" "}
                                {recipe.preparationTime != null &&
                                    `${recipe.preparationTime} min`}
                            </p>

                        </div>

                        {/* Gemiddelde rating */}
                        <div className="recipe-rating">

                            {renderStars(averageRating)}

                            <span>
                                {averageRating > 0
                                    ? averageRating.toFixed(1)
                                    : "Nog geen rating"}
                            </span>

                            <small>
                                ({validRatings.length} beoordelingen)
                            </small>

                        </div>

                    </div>

                    {/* Beschrijving */}
                    {recipe.description && (
                        <div className="recipe-description">
                            <p>{recipe.description}</p>
                        </div>
                    )}

                    {/* Ingrediënten */}
                    <div className="recipe-details">

                        <div className="recipe-detail-section">

                            <h3>Ingrediënten</h3>

                            {ingredients.length > 0 ? (
                                <ul className="recipe-ingredient-list">

                                    {ingredients.map((item, index) => {
                                        const ingredientName =
                                            item.name ??
                                            item.ingredientName ??
                                            item.ingredient?.name ??
                                            item.ingredient?.ingredientName ??
                                            "Onbekend ingrediënt";

                                        return (
                                            <li
                                                key={
                                                    item.ingredientId ??
                                                    item.ingredient?.ingredientId ??
                                                    index
                                                }
                                            >
                                                <span>
                                                    {ingredientName}
                                                </span>

                                                <span>
                                                    {item.quantity ?? ""}{" "}
                                                    {item.unit ?? ""}
                                                </span>
                                            </li>
                                        );
                                    })}

                                </ul>
                            ) : (
                                <p>
                                    Geen ingrediënten beschikbaar.
                                </p>
                            )}

                        </div>

                    </div>

                    {/* Bereidingswijze */}
                    <div className="recipe-instructions">

                        <h3>Bereidingswijze</h3>

                        {recipe.instructions ? (
                            recipe.instructions
                                .split(/(?=\d+\.\s)/)
                                .filter((step) => step.trim() !== "")
                                .map((step, index) => (
                                    <p key={index}>
                                        {step.trim()}
                                    </p>
                                ))
                        ) : (
                            <p>
                                Geen bereidingswijze beschikbaar.
                            </p>
                        )}

                    </div>

                    {/* Comments en ratings */}
                    <div className="recipe-comments">

                        <h3>
                            Beoordelingen en reacties
                        </h3>

                        <div className="review-summary">

                            <h2>
                                {averageRating > 0
                                    ? averageRating.toFixed(1)
                                    : "0.0"}
                                /5
                            </h2>

                            {renderStars(averageRating)}

                            <p>
                                Gebaseerd op {validRatings.length} beoordelingen
                            </p>

                        </div>

                        {reviews.length > 0 ? (

                            <div className="review-list">

                                {reviews.map((review, index) => {

                                    const rating = getRatingValue(review);

                                    const comment =
                                        review.comment ??
                                        review.comments ??
                                        review.description ??
                                        "";

                                    const author =
                                        review.username ??
                                        review.userName ??
                                        review.user?.username ??
                                        review.user?.name ??
                                        "Anonieme gebruiker";

                                    const date =
                                        review.createdAt ??
                                        review.reviewDate ??
                                        review.date;

                                    return (
                                        <div
                                            className="review-item"
                                            key={
                                                review.reviewRatingId ??
                                                review.ratingId ??
                                                review.id ??
                                                index
                                            }
                                        >

                                            <div className="review-header">

                                                <strong>
                                                    {author}
                                                </strong>

                                                {renderStars(rating)}

                                            </div>

                                            {comment && (
                                                <p className="review-comment">
                                                    {comment}
                                                </p>
                                            )}

                                            {date && (
                                                <small className="review-date">
                                                    {formatDate(date)}
                                                </small>
                                            )}

                                        </div>
                                    );
                                })}

                            </div>

                        ) : (

                            <p>
                                Er zijn nog geen beoordelingen of reacties
                                voor dit recept.
                            </p>

                        )}

                    </div>

                </div>

                {/* Terugknop */}
                <div className="navigate-buttons">

                    <Button
                        text="Cancel"
                        buttonType="button"
                        btnColor="green-filled"
                        onClick={() => navigate("/")}
                    />

                </div>

            </div>
        </section>
    );
}

export default RecipeDetail;
