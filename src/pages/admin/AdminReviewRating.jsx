import { useState, useEffect } from "react";

import {
    getAllReviewRatings,
    createReviewRating,
    updateReviewRating,
    deleteReviewRating,
} from "../../api/reviewRatingService.js";

import { getAllRecipes } from "../../api/recipeService.js";

const emptyForm = {
    comment: "",
    ratingScore: "5",
    recipeId: "",
    userId: "",
};

function AdminReviewRating() {
    const [reviews, setReviews] = useState([]);
    const [recipes, setRecipes] = useState([]);

    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [newReview, setNewReview] = useState({ ...emptyForm });
    const [editReview, setEditReview] = useState({ ...emptyForm });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        loadReviews();
        loadRecipes();
    }, []);

    const loadReviews = async () => {
        try {
            const response = await getAllReviewRatings();
            setReviews(response.data);
        } catch (error) {
            console.error("Could not load reviews:", error);
            setErrorMessage("Reviews konden niet worden geladen.");
        }
    };

    const loadRecipes = async () => {
        try {
            const response = await getAllRecipes();
            setRecipes(response.data);
        } catch (error) {
            console.error("Could not load recipes:", error);
            setErrorMessage("Recepten konden niet worden geladen.");
        }
    };

    const handleChange = (formType, field, value) => {
        const setter =
            formType === "new" ? setNewReview : setEditReview;

        setter((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const validateReview = (review, isNew = false) => {
        if (
            !Number.isInteger(Number(review.ratingScore)) ||
            Number(review.ratingScore) < 1 ||
            Number(review.ratingScore) > 5
        ) {
            return "De beoordeling moet tussen 1 en 5 sterren liggen.";
        }

        if (
            !review.recipeId ||
            !Number.isInteger(Number(review.recipeId)) ||
            Number(review.recipeId) <= 0
        ) {
            return "Selecteer een recept.";
        }

        if ((review.comment ?? "").length > 5000) {
            return "De review mag maximaal 5000 tekens bevatten.";
        }

        if (
            isNew &&
            (!review.userId ||
                !Number.isInteger(Number(review.userId)) ||
                Number(review.userId) <= 0)
        ) {
            return "Vul een geldige gebruikers-ID in.";
        }

        return "";
    };

    const createPayload = (review) => ({
        comment: review.comment.trim(),
        ratingScore: Number(review.ratingScore),
        recipeId: Number(review.recipeId),
    });

    const handleAdd = async () => {
        const validationError = validateReview(newReview, true);

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            await createReviewRating(
                Number(newReview.userId),
                createPayload(newReview)
            );

            setNewReview({ ...emptyForm });
            setAdding(false);

            await loadReviews();
        } catch (error) {
            console.error(
                "Could not create review:",
                error.response?.data ?? error.message
            );

            setErrorMessage(
                error.response?.data?.message ??
                "Review toevoegen is mislukt."
            );
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (review) => {
        setEditReview({
            comment: review.comment ?? "",
            ratingScore: String(review.ratingScore ?? 5),
            recipeId: String(review.recipeId ?? ""),
            userId: String(review.userId ?? ""),
        });

        setEditingId(review.reviewRatingId);
        setAdding(false);
        setErrorMessage("");
    };

    const handleUpdate = async (reviewId) => {
        const validationError = validateReview(editReview);

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            await updateReviewRating(
                reviewId,
                createPayload(editReview)
            );

            setEditingId(null);
            setEditReview({ ...emptyForm });

            await loadReviews();
        } catch (error) {
            console.error(
                "Could not update review:",
                error.response?.data ?? error.message
            );

            setErrorMessage(
                error.response?.data?.message ??
                "Review aanpassen is mislukt."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (
            !window.confirm(
                "Weet je zeker dat je deze review wilt verwijderen?"
            )
        ) {
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            await deleteReviewRating(reviewId);

            if (editingId === reviewId) {
                setEditingId(null);
                setEditReview({ ...emptyForm });
            }

            await loadReviews();
        } catch (error) {
            console.error(
                "Could not delete review:",
                error.response?.data ?? error.message
            );

            setErrorMessage(
                error.response?.data?.message ??
                "Review verwijderen is mislukt."
            );
        } finally {
            setLoading(false);
        }
    };

    const renderRecipeOptions = () =>
        recipes.map((recipe) => (
            <option
                key={recipe.recipeId}
                value={recipe.recipeId}
            >
                {recipe.title}
            </option>
        ));

    const renderFields = (review, formType) => (
        <>
            <td>
                <select
                    value={review.recipeId}
                    onChange={(event) =>
                        handleChange(
                            formType,
                            "recipeId",
                            event.target.value
                        )
                    }
                    required
                >
                    <option value="">Select recipe</option>
                    {renderRecipeOptions()}
                </select>
            </td>

            <td>
                <select
                    value={review.ratingScore}
                    onChange={(event) =>
                        handleChange(
                            formType,
                            "ratingScore",
                            event.target.value
                        )
                    }
                    required
                >
                    <option value="1">⭐ 1</option>
                    <option value="2">⭐ 2</option>
                    <option value="3">⭐ 3</option>
                    <option value="4">⭐ 4</option>
                    <option value="5">⭐ 5</option>
                </select>
            </td>

            <td>
                <textarea
                    value={review.comment ?? ""}
                    maxLength={5000}
                    placeholder="Write a review..."
                    onChange={(event) =>
                        handleChange(
                            formType,
                            "comment",
                            event.target.value
                        )
                    }
                />
            </td>

            {formType === "new" && (
                <td>
                    <input
                        type="number"
                        min="1"
                        value={review.userId}
                        placeholder="User ID"
                        onChange={(event) =>
                            handleChange(
                                formType,
                                "userId",
                                event.target.value
                            )
                        }
                        required
                    />
                </td>
            )}
        </>
    );

    return (
        <section className="admin-recipe">
            <h1>Review Ratings</h1>

            {errorMessage && (
                <p role="alert" className="error-message">
                    {errorMessage}
                </p>
            )}

            <table className="data1">
                <thead>
                <tr className="thead">
                    <th>ID</th>
                    <th>Recipe</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>User ID</th>
                    <th>Save</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>

                <tbody>
                {reviews.map((review) => {
                    const isEditing =
                        editingId === review.reviewRatingId;

                    return (
                        <tr key={review.reviewRatingId}>
                            <td>{review.reviewRatingId}</td>

                            {isEditing ? (
                                renderFields(editReview, "edit")
                            ) : (
                                <>
                                    <td>
                                        {review.recipeTitle ??
                                            recipes.find(
                                                (recipe) =>
                                                    Number(
                                                        recipe.recipeId
                                                    ) ===
                                                    Number(
                                                        review.recipeId
                                                    )
                                            )?.title ??
                                            "—"}
                                    </td>

                                    <td>
                                        {"⭐".repeat(
                                            Math.max(
                                                0,
                                                Math.min(
                                                    5,
                                                    Number(
                                                        review.ratingScore
                                                    ) || 0
                                                )
                                            )
                                        )}
                                        {" "}
                                        ({review.ratingScore}/5)
                                    </td>

                                    <td>{review.comment ?? ""}</td>
                                </>
                            )}

                            <td>
                                {isEditing
                                    ? editReview.userId
                                    : review.userId}
                            </td>

                            <td>
                                {isEditing && (
                                    <button
                                        className="mini-btn"
                                        disabled={loading}
                                        onClick={() =>
                                            handleUpdate(
                                                review.reviewRatingId
                                            )
                                        }
                                    >
                                        Save
                                    </button>
                                )}
                            </td>

                            <td>
                                <button
                                    className="mini-btn"
                                    disabled={loading}
                                    onClick={() => {
                                        if (isEditing) {
                                            setEditingId(null);
                                            setEditReview({
                                                ...emptyForm,
                                            });
                                            setErrorMessage("");
                                        } else {
                                            startEdit(review);
                                        }
                                    }}
                                >
                                    {isEditing ? "Cancel" : "Edit"}
                                </button>
                            </td>

                            <td>
                                <button
                                    className="mini-btn x"
                                    disabled={loading}
                                    onClick={() =>
                                        handleDelete(
                                            review.reviewRatingId
                                        )
                                    }
                                >
                                    x
                                </button>
                            </td>
                        </tr>
                    );
                })}

                {adding && (
                    <tr>
                        <td>New</td>

                        {renderFields(newReview, "new")}

                        <td>
                            <button
                                className="mini-btn"
                                disabled={loading}
                                onClick={handleAdd}
                            >
                                Save
                            </button>
                        </td>

                        <td>
                            <button
                                className="mini-btn"
                                disabled={loading}
                                onClick={() => {
                                    setAdding(false);
                                    setNewReview({ ...emptyForm });
                                    setErrorMessage("");
                                }}
                            >
                                Cancel
                            </button>
                        </td>

                        <td></td>
                    </tr>
                )}
                </tbody>
            </table>

            <button
                className="mini-btn"
                disabled={adding || loading}
                onClick={() => {
                    setEditingId(null);
                    setAdding(true);
                    setErrorMessage("");
                }}
            >
                + Add review
            </button>
        </section>
    );
}

export default AdminReviewRating;
