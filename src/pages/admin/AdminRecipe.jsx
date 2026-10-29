import { useState, useEffect } from "react";

import {
    getAllRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
} from "../../api/recipeService.js";

import { getAllCategories } from "../../api/categoryService.js";

import {
    createRecipeImage,
    getAllRecipeImages,
    uploadRecipeImage,
    deleteRecipeImage,
} from "../../api/recipeImageService.js";

const emptyForm = {
    title: "",
    description: "",
    instructions: "",
    preparationTime: "30",
    servings: "2",
    categoryId: "",
};

function AdminRecipe() {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [recipeImages, setRecipeImages] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [adding, setAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [newRecipe, setNewRecipe] = useState({ ...emptyForm });
    const [editRecipe, setEditRecipe] = useState({ ...emptyForm });

    // Afbeeldingstoestand voor het toevoegen
    const [newImageMode, setNewImageMode] = useState("url");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newImageFile, setNewImageFile] = useState(null);
    const [newImagePreview, setNewImagePreview] = useState("");

    // Afbeeldingstoestand voor het bewerken
    const [editImageMode, setEditImageMode] = useState("url");
    const [editImageUrl, setEditImageUrl] = useState("");
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState("");

    const loadRecipes = async () => {
        try {
            const response = await getAllRecipes();
            setRecipes(response.data);
        } catch (error) {
            console.error("Could not load recipes:", error);
            setErrorMessage("Recepten konden niet worden geladen.");
        }
    };

    const loadCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Could not load categories:", error);
            setErrorMessage("Categorieën konden niet worden geladen.");
        }
    };

    const loadRecipeImages = async () => {
        try {
            const response = await getAllRecipeImages();
            setRecipeImages(response.data);
        } catch (error) {
            console.error("Could not load recipe images:", error);
            setErrorMessage("Afbeeldingen konden niet worden geladen.");
        }
    };

    useEffect(() => {
        loadRecipes();
        loadCategories();
        loadRecipeImages();
    }, []);

    const handleChange = (formType, field, value) => {
        const setter =
            formType === "new" ? setNewRecipe : setEditRecipe;

        setter((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const validateRecipe = (recipe) => {
        if (!recipe.title.trim()) {
            return "Vul een recepttitel in.";
        }

        if (recipe.title.trim().length > 200) {
            return "De titel mag maximaal 200 tekens bevatten.";
        }

        if (!recipe.instructions.trim()) {
            return "Vul de bereidingsinstructies in.";
        }

        if (
            !Number.isInteger(Number(recipe.preparationTime)) ||
            Number(recipe.preparationTime) <= 0
        ) {
            return "De bereidingstijd moet een positief geheel getal zijn.";
        }

        if (
            !Number.isInteger(Number(recipe.servings)) ||
            Number(recipe.servings) <= 0
        ) {
            return "Het aantal personen moet een positief geheel getal zijn.";
        }

        if (
            !recipe.categoryId ||
            !Number.isInteger(Number(recipe.categoryId)) ||
            Number(recipe.categoryId) <= 0
        ) {
            return "Selecteer een categorie.";
        }

        return "";
    };

    const createPayload = (recipe) => ({
        title: recipe.title.trim(),
        description: recipe.description?.trim() ?? "",
        instructions: recipe.instructions.trim(),
        preparationTime: Number(recipe.preparationTime),
        servings: Number(recipe.servings),
        categoryId: Number(recipe.categoryId),
    });

    const validateImageUrl = (url) => {
        if (!url.trim()) {
            return "";
        }

        try {
            const parsedUrl = new URL(url.trim());

            if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                return "Gebruik een geldige HTTP- of HTTPS-afbeeldings-URL.";
            }
        } catch {
            return "Vul een geldige afbeeldings-URL in.";
        }

        return "";
    };

    const saveImage = async (recipeId, mode, url, file) => {
        if (mode === "upload" && file) {
            await uploadRecipeImage(file, recipeId);
        } else if (mode === "url" && url.trim()) {
            await createRecipeImage({
                imageUrl: url.trim(),
                recipeId,
            });
        }
    };

    const resetNewImage = () => {
        setNewImageMode("url");
        setNewImageUrl("");
        setNewImageFile(null);
        setNewImagePreview("");
    };

    const resetEditImage = () => {
        setEditImageMode("url");
        setEditImageUrl("");
        setEditImageFile(null);
        setEditImagePreview("");
    };

    const handleAdd = async () => {
        const validationError = validateRecipe(newRecipe);

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        if (newImageMode === "url") {
            const imageError = validateImageUrl(newImageUrl);

            if (imageError) {
                setErrorMessage(imageError);
                return;
            }
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await createRecipe(createPayload(newRecipe));
            const createdRecipe = response.data;

            // Een afbeelding is optioneel.
            if (newImageFile || newImageUrl.trim()) {
                await saveImage(
                    createdRecipe.recipeId,
                    newImageMode,
                    newImageUrl,
                    newImageFile
                );
            }

            setNewRecipe({ ...emptyForm });
            resetNewImage();
            setAdding(false);

            await Promise.all([
                loadRecipes(),
                loadRecipeImages(),
            ]);
        } catch (error) {
            console.error(
                "Could not create recipe:",
                error.response?.data ?? error.message
            );

            setErrorMessage(
                error.response?.data?.message ??
                "Recept of afbeelding opslaan is mislukt."
            );
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (recipe) => {
        const categoryId =
            recipe.category?.categoryId ??
            recipe.categoryId ??
            "";

        setEditRecipe({
            title: recipe.title ?? "",
            description: recipe.description ?? "",
            instructions: recipe.instructions ?? "",
            preparationTime: String(recipe.preparationTime ?? 30),
            servings: String(recipe.servings ?? 2),
            categoryId: String(categoryId),
        });

        const image = recipeImages.find(
            (item) =>
                Number(item.recipeId) === Number(recipe.recipeId)
        );

        setEditImageMode("url");
        setEditImageUrl(image?.imageUrl ?? "");
        setEditImageFile(null);
        setEditImagePreview(image?.imageUrl ?? "");

        setEditingId(recipe.recipeId);
        setAdding(false);
        setErrorMessage("");
    };

    const handleUpdate = async (recipeId) => {
        const validationError = validateRecipe(editRecipe);

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        if (editImageMode === "url") {
            const imageError = validateImageUrl(editImageUrl);

            if (imageError) {
                setErrorMessage(imageError);
                return;
            }
        }

        setLoading(true);
        setErrorMessage("");

        try {
            await updateRecipe(recipeId, createPayload(editRecipe));

            const existingImage = recipeImages.find(
                (item) =>
                    Number(item.recipeId) === Number(recipeId)
            );

            // Alleen de receptgegevens aanpassen als geen
            // nieuwe afbeelding is gekozen.
            if (editImageFile) {
                if (existingImage) {
                    setErrorMessage(
                        "Het recept is opgeslagen, maar het vervangen van de bestaande afbeelding vereist de juiste deleteRecipeImage API."
                    );
                } else {
                    await uploadRecipeImage(editImageFile, recipeId);
                }
            } else if (
                editImageMode === "url" &&
                editImageUrl.trim() &&
                editImageUrl.trim() !== existingImage?.imageUrl
            ) {
                if (existingImage) {
                    setErrorMessage(
                        "Het recept is opgeslagen, maar het vervangen van de bestaande afbeelding vereist de juiste deleteRecipeImage API."
                    );
                } else {
                    await createRecipeImage({
                        imageUrl: editImageUrl.trim(),
                        recipeId,
                    });
                }
            }

            setEditingId(null);
            setEditRecipe({ ...emptyForm });
            resetEditImage();

            await Promise.all([
                loadRecipes(),
                loadRecipeImages(),
            ]);
        } catch (error) {
            console.error(
                "Could not update recipe:",
                error.response?.data ?? error.message
            );

            setErrorMessage(
                error.response?.data?.message ??
                "Recept aanpassen is mislukt."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (recipeId) => {
        if (
            !window.confirm(
                "Weet je zeker dat je dit recept wilt verwijderen?"
            )
        ) {
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            await deleteRecipe(recipeId);

            if (editingId === recipeId) {
                setEditingId(null);
                setEditRecipe({ ...emptyForm });
                resetEditImage();
            }

            await Promise.all([
                loadRecipes(),
                loadRecipeImages(),
            ]);
        } catch (error) {
            console.error(
                "Could not delete recipe:",
                error.response?.data ?? error.message
            );

            setErrorMessage(
                error.response?.data?.message ??
                "Recept verwijderen is mislukt."
            );
        } finally {
            setLoading(false);
        }
    };

    const renderCategoryOptions = () =>
        categories.map((category) => (
            <option
                key={category.categoryId}
                value={category.categoryId}
            >
                {category.name}
            </option>
        ));

    const renderImageField = (formType) => {
        const isNew = formType === "new";

        const imageMode = isNew ? newImageMode : editImageMode;
        const setImageMode = isNew
            ? setNewImageMode
            : setEditImageMode;

        const imageUrl = isNew ? newImageUrl : editImageUrl;
        const setImageUrl = isNew ? setNewImageUrl : setEditImageUrl;

        const setImageFile = isNew
            ? setNewImageFile
            : setEditImageFile;

        const imagePreview = isNew
            ? newImagePreview
            : editImagePreview;

        const setImagePreview = isNew
            ? setNewImagePreview
            : setEditImagePreview;

        return (
            <td>
                <select
                    value={imageMode}
                    onChange={(e) => {
                        setImageMode(e.target.value);
                        setImageFile(null);
                        setImageUrl("");
                        setImagePreview("");
                    }}
                >
                    <option value="url">Image URL</option>
                    <option value="upload">Upload image</option>
                </select>

                {imageMode === "url" ? (
                    <input
                        type="url"
                        value={imageUrl}
                        placeholder="https://example.com/recipe.jpg"
                        onChange={(e) => {
                            setImageUrl(e.target.value);
                            setImagePreview(e.target.value);
                        }}
                    />
                ) : (
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={(e) => {
                            const file =
                                e.target.files?.[0] ?? null;

                            setImageFile(file);
                            setImagePreview(
                                file ? URL.createObjectURL(file) : ""
                            );
                        }}
                    />
                )}

                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Recipe preview"
                        style={{
                            width: "90px",
                            height: "70px",
                            objectFit: "cover",
                            display: "block",
                            marginTop: "8px",
                        }}
                    />
                )}
            </td>
        );
    };

    const renderRecipeFields = (recipe, formType) => (
        <>
            <td>
                <input
                    value={recipe.title}
                    maxLength={200}
                    placeholder="Recipe title"
                    onChange={(e) =>
                        handleChange(formType, "title", e.target.value)
                    }
                    required
                />
            </td>

            <td>
                <textarea
                    value={recipe.description ?? ""}
                    placeholder="Description"
                    onChange={(e) =>
                        handleChange(
                            formType,
                            "description",
                            e.target.value
                        )
                    }
                />
            </td>

            <td>
                <textarea
                    value={recipe.instructions}
                    placeholder="Instructions"
                    onChange={(e) =>
                        handleChange(
                            formType,
                            "instructions",
                            e.target.value
                        )
                    }
                    required
                />
            </td>

            <td>
                <input
                    type="number"
                    min="1"
                    value={recipe.preparationTime}
                    onChange={(e) =>
                        handleChange(
                            formType,
                            "preparationTime",
                            e.target.value
                        )
                    }
                    required
                />
            </td>

            <td>
                <input
                    type="number"
                    min="1"
                    value={recipe.servings}
                    onChange={(e) =>
                        handleChange(
                            formType,
                            "servings",
                            e.target.value
                        )
                    }
                    required
                />
            </td>

            <td>
                <select
                    value={recipe.categoryId}
                    onChange={(e) =>
                        handleChange(
                            formType,
                            "categoryId",
                            e.target.value
                        )
                    }
                    required
                >
                    <option value="">Select category</option>
                    {renderCategoryOptions()}
                </select>
            </td>
        </>
    );

    return (
        <section className="admin-recipe">
            <h1>Recipes</h1>

            {errorMessage && (
                <p role="alert" className="error-message">
                    {errorMessage}
                </p>
            )}

            <table className="data1">
                <thead>
                <tr className="thead">
                    <th>ID</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Instructions</th>
                    <th>Preparation time (min)</th>
                    <th>Servings</th>
                    <th>Category</th>
                    <th>Save</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>

                <tbody>
                {recipes.map((recipe) => {
                    const isEditing =
                        editingId === recipe.recipeId;

                    const image = recipeImages.find(
                        (item) =>
                            Number(item.recipeId) ===
                            Number(recipe.recipeId)
                    );

                    const categoryId =
                        recipe.category?.categoryId ??
                        recipe.categoryId;

                    const categoryName =
                        recipe.category?.name ??
                        categories.find(
                            (category) =>
                                Number(category.categoryId) ===
                                Number(categoryId)
                        )?.name ??
                        "—";

                    return (
                        <tr key={recipe.recipeId}>
                            <td>{recipe.recipeId}</td>

                            {isEditing ? (
                                renderImageField("edit")
                            ) : (
                                <td>
                                    {image?.imageUrl ? (
                                        <img
                                            src={image.imageUrl}
                                            alt={recipe.title}
                                            style={{
                                                width: "80px",
                                                height: "60px",
                                                objectFit: "cover",
                                                borderRadius: "6px",
                                            }}
                                        />
                                    ) : (
                                        "Geen afbeelding"
                                    )}
                                </td>
                            )}

                            {isEditing ? (
                                renderRecipeFields(
                                    editRecipe,
                                    "edit"
                                )
                            ) : (
                                <>
                                    <td>
                                        <strong>
                                            {recipe.title}
                                        </strong>
                                    </td>
                                    <td>
                                        {recipe.description ?? ""}
                                    </td>
                                    <td>
                                        {recipe.instructions ?? ""}
                                    </td>
                                    <td>
                                        {recipe.preparationTime ?? "—"}
                                    </td>
                                    <td>
                                        {recipe.servings ?? "—"}
                                    </td>
                                    <td>{categoryName}</td>
                                </>
                            )}

                            <td>
                                {isEditing && (
                                    <button
                                        className="mini-btn"
                                        disabled={loading}
                                        onClick={() =>
                                            handleUpdate(
                                                recipe.recipeId
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
                                            setEditRecipe({
                                                ...emptyForm,
                                            });
                                            resetEditImage();
                                            setErrorMessage("");
                                        } else {
                                            startEdit(recipe);
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
                                            recipe.recipeId
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

                        {renderImageField("new")}
                        {renderRecipeFields(newRecipe, "new")}

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
                                    setNewRecipe({ ...emptyForm });
                                    resetNewImage();
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
                + Add recipe
            </button>
        </section>
    );
}

export default AdminRecipe;
