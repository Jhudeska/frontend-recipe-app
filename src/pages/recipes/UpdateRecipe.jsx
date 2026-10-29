import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateRecipe.css";
import Button from "../../components/button/Button.jsx";

import { createRecipeImage, uploadRecipeImage } from "../../api/recipeImageService.js";
import { getAllCategories } from "../../api/categoryService.js";
import {
    getAllIngredients,
    createIngredient,
} from "../../api/ingredientService.js";

// Koppel deze functies aan de juiste bestaande API-functies
// voor het ophalen en updaten van een recept.
import {
    getRecipeById,
    updateRecipe,
} from "../../api/recipeService.js";

function UpdateRecipe() {
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        instructions: "",
        preparationTime: "",
        servings: "",
        categoryId: "",
    });

    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    const [imageMode, setImageMode] = useState("upload");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState("");

    const [newIngredient, setNewIngredient] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [ingredientsLoading, setIngredientsLoading] = useState(true);
    const [error, setError] = useState("");

    // Haal categorieën en ingrediënten op.
    useEffect(() => {
        let active = true;

        const fetchData = async () => {
            try {
                const [categoryResponse, ingredientResponse] =
                    await Promise.all([
                        getAllCategories(),
                        getAllIngredients(),
                    ]);

                if (!active) return;

                setCategories(categoryResponse.data);
                setIngredients(ingredientResponse.data);
            } catch (err) {
                console.error("Error fetching form data:", err);

                if (active) {
                    setError(
                        "De categorieën of ingrediënten konden niet worden opgehaald."
                    );
                }
            } finally {
                if (active) {
                    setCategoriesLoading(false);
                    setIngredientsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            active = false;
        };
    }, []);

    // Haal het bestaande recept op.
    useEffect(() => {
        let active = true;

        const fetchRecipe = async () => {
            try {
                const response = await getRecipeById(id);
                const recipe = response.data;

                if (!active) return;

                setFormData({
                    title: recipe.title ?? "",
                    description: recipe.description ?? "",
                    instructions: recipe.instructions ?? "",
                    preparationTime: recipe.preparationTime ?? "",
                    servings: recipe.servings ?? "",
                    categoryId: recipe.categoryId ?? "",
                });

                // Pas deze property aan als jouw API een andere
                // propertynaam gebruikt voor de afbeeldings-URL.
                const recipeImageUrl =
                    recipe.imageUrl ??
                    recipe.image?.imageUrl ??
                    "";

                setExistingImageUrl(recipeImageUrl);

                if (recipeImageUrl) {
                    setImageUrl(recipeImageUrl);
                    setImagePreview(recipeImageUrl);
                    setImageMode("url");
                }

                // Verwacht dat het recept ingredienten bevat
                // met een ingredientId.
                const recipeIngredients = recipe.ingredients ?? [];

                setSelectedIngredients(
                    recipeIngredients
                        .map((ingredient) =>
                            typeof ingredient === "number"
                                ? ingredient
                                : ingredient.ingredientId
                        )
                        .filter(Number.isInteger)
                );
            } catch (err) {
                console.error("Error fetching recipe:", err);

                if (active) {
                    setError(
                        err.response?.data?.message ??
                        "Het recept kon niet worden opgehaald."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchRecipe();
        } else {
            setError("Er is geen recept-ID opgegeven.");
            setLoading(false);
        }

        return () => {
            active = false;
        };
    }, [id]);

    // Ruim lokale afbeeldingspreviews op.
    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Selecteer een geldige afbeelding.");
            event.target.value = "";
            return;
        }

        setError("");
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setImageUrl("");
    };

    const handleIngredientToggle = (ingredientId) => {
        setSelectedIngredients((previous) =>
            previous.includes(ingredientId)
                ? previous.filter((id) => id !== ingredientId)
                : [...previous, ingredientId]
        );
    };

    const handleCreateIngredient = async () => {
        const name = newIngredient.trim();

        if (!name) return;

        const existingIngredient = ingredients.find(
            (ingredient) =>
                ingredient.name.toLowerCase() === name.toLowerCase()
        );

        if (existingIngredient) {
            setSelectedIngredients((previous) =>
                previous.includes(existingIngredient.ingredientId)
                    ? previous
                    : [...previous, existingIngredient.ingredientId]
            );

            setNewIngredient("");
            return;
        }

        try {
            const response = await createIngredient({ name });
            const createdIngredient = response.data;

            setIngredients((previous) => [
                ...previous,
                createdIngredient,
            ]);

            setSelectedIngredients((previous) => [
                ...previous,
                createdIngredient.ingredientId,
            ]);

            setNewIngredient("");
            setError("");
        } catch (err) {
            console.error("Error creating ingredient:", err);

            setError(
                err.response?.data?.message ??
                "Het ingrediënt kon niet worden toegevoegd."
            );
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!id) {
            setError("Geen recept-ID gevonden. Open het recept via de updatepagina.");
            return;
        }

        const recipe = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            instructions: formData.instructions.trim(),
            preparationTime: Number(formData.preparationTime),
            servings: Number(formData.servings),
            categoryId: Number(formData.categoryId),
        };

        if (
            !recipe.title ||
            !recipe.instructions ||
            !Number.isInteger(recipe.preparationTime) ||
            recipe.preparationTime <= 0 ||
            !Number.isInteger(recipe.servings) ||
            recipe.servings <= 0 ||
            !Number.isInteger(recipe.categoryId) ||
            recipe.categoryId <= 0
        ) {
            setError("Controleer de verplichte velden.");
            return;
        }

        setSaving(true);

        try {
            console.log("Recept-ID:", id);
            console.log("Receptgegevens:", recipe);

            await updateRecipe(id, recipe);

            if (imageMode === "upload" && imageFile) {
                await uploadRecipeImage(imageFile, Number(id));
            } else if (
                imageMode === "url" &&
                imageUrl.trim() &&
                imageUrl.trim() !== existingImageUrl
            ) {
                await createRecipeImage({
                    imageUrl: imageUrl.trim(),
                    recipeId: Number(id),
                });
            }

            navigate("/recipes");
        } catch (err) {
            console.error("Fout bij updaten:", err);

            setError(
                err.response?.data?.message ||
                "Het recept kon niet worden opgeslagen. Controleer de API en probeer opnieuw."
            );
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return (
            <section className="outer-container page-container">
                <div className="inner-container">
                    <p>Recept laden...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="outer-container page-container">
            <div className="inner-container">
                <h1>Update Recipe</h1>

                {error && <p className="error-message">{error}</p>}

                <form
                    className="form-narrow"
                    onSubmit={handleSubmit}
                >
                    <input
                        className="field"
                        name="title"
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <select
                        className="field"
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        disabled={categoriesLoading}
                    >
                        <option value="">
                            {categoriesLoading
                                ? "Loading categories..."
                                : "Select a category"}
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.categoryId}
                                value={category.categoryId}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <div className="image-upload">
                        <label>Recipe image</label>

                        <div className="image-options">
                            <label>
                                <input
                                    type="radio"
                                    name="imageMode"
                                    value="upload"
                                    checked={imageMode === "upload"}
                                    onChange={() => {
                                        setImageMode("upload");
                                        setImageFile(null);
                                        setImageUrl("");
                                        setImagePreview(null);
                                    }}
                                />
                                Upload image
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="imageMode"
                                    value="url"
                                    checked={imageMode === "url"}
                                    onChange={() => {
                                        setImageMode("url");
                                        setImageFile(null);
                                        setImagePreview(
                                            existingImageUrl || null
                                        );
                                        setImageUrl(existingImageUrl);
                                    }}
                                />
                                Image URL
                            </label>
                        </div>

                        {imageMode === "upload" && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    className="field"
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleImageChange}
                                />

                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Recipe preview"
                                        className="image-preview"
                                    />
                                )}
                            </>
                        )}

                        {imageMode === "url" && (
                            <>
                                <input
                                    className="field"
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={imageUrl}
                                    onChange={(event) => {
                                        setImageUrl(event.target.value);
                                        setImagePreview(
                                            event.target.value.trim() || null
                                        );
                                    }}
                                    required
                                />

                                {imageUrl.trim() && (
                                    <img
                                        src={imageUrl}
                                        alt="Recipe preview"
                                        className="image-preview"
                                        onError={(event) => {
                                            event.currentTarget.style.display =
                                                "none";
                                        }}
                                        onLoad={(event) => {
                                            event.currentTarget.style.display =
                                                "block";
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/*<div className="ingredient-section">*/}
                    {/*    <label htmlFor="ingredients">*/}
                    {/*        Ingredients*/}
                    {/*    </label>*/}

                    {/*    <select*/}
                    {/*        className="field ingredient-select"*/}
                    {/*        id="ingredients"*/}
                    {/*        multiple*/}
                    {/*        value={selectedIngredients.map(String)}*/}
                    {/*        onChange={(event) => {*/}
                    {/*            const selectedIds = Array.from(*/}
                    {/*                event.target.selectedOptions,*/}
                    {/*                (option) => Number(option.value)*/}
                    {/*            );*/}

                    {/*            setSelectedIngredients(selectedIds);*/}
                    {/*        }}*/}
                    {/*        disabled={ingredientsLoading}*/}
                    {/*        size={5}*/}
                    {/*    >*/}
                    {/*        {ingredients.map((ingredient) => (*/}
                    {/*            <option*/}
                    {/*                key={ingredient.ingredientId}*/}
                    {/*                value={ingredient.ingredientId}*/}
                    {/*            >*/}
                    {/*                {ingredient.name}*/}
                    {/*            </option>*/}
                    {/*        ))}*/}
                    {/*    </select>*/}

                    {/*    <div className="add-ingredient">*/}
                    {/*        <input*/}
                    {/*            className="field"*/}
                    {/*            type="text"*/}
                    {/*            placeholder="New ingredient"*/}
                    {/*            value={newIngredient}*/}
                    {/*            onChange={(event) =>*/}
                    {/*                setNewIngredient(event.target.value)*/}
                    {/*            }*/}
                    {/*        />*/}

                    {/*        <Button*/}
                    {/*            text="Add"*/}
                    {/*            buttonType="button"*/}
                    {/*            btnColor="green-filled"*/}
                    {/*            onClick={handleCreateIngredient}*/}
                    {/*        />*/}
                    {/*    </div>*/}

                    {/*    <small>*/}
                    {/*        Use Ctrl (Windows) or Cmd (Mac) to select*/}
                    {/*        multiple ingredients.*/}
                    {/*    </small>*/}
                    {/*</div>*/}

                    <input
                        className="field"
                        name="servings"
                        type="number"
                        min="1"
                        placeholder="Number of servings"
                        value={formData.servings}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="field"
                        name="preparationTime"
                        type="number"
                        min="1"
                        placeholder="Preparation time (minutes)"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        className="field"
                        name="instructions"
                        placeholder="Instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        className="field"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <div className="navigate-buttons">
                        <Button
                            text="Cancel"
                            buttonType="button"
                            btnColor="green-filled"
                            onClick={() => navigate("/recipes")}
                        />

                        <Button
                            text={saving ? "Saving..." : "Save"}
                            buttonType="submit"
                            btnColor="green-filled"
                            disabled={saving}
                        />
                    </div>
                </form>
            </div>
        </section>
    );
}

export default UpdateRecipe;
