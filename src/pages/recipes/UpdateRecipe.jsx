import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateRecipe.css";
import Button from "../../components/button/Button.jsx";

import {
    createRecipeImage,
    uploadRecipeImage,
    updateRecipeImage,
    getAllRecipeImages,} from "../../api/recipeImageService.js";
import { getAllCategories } from "../../api/categoryService.js";
import {
    getAllIngredients,
    createIngredient,
} from "../../api/ingredientService.js";
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
    const [existingImageId, setExistingImageId] = useState(null);
    // const [recipeImageId, setRecipeImageId] = useState(null);

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
                // Bestaand recept ophalen
                const response = await getRecipeById(id);
                const recipe = response.data;

                if (!active) return;

                console.log("Volledige recept response:", recipe);

                // Receptvelden invullen
                setFormData({
                    title: recipe.title ?? "",
                    description: recipe.description ?? "",
                    instructions: recipe.instructions ?? "",
                    preparationTime: recipe.preparationTime ?? "",
                    servings: recipe.servings ?? "",
                    categoryId: recipe.categoryId ?? "",
                });

                // Bestaande afbeelding ophalen
                const imageResponse = await getAllRecipeImages();

                if (!active) return;

                const recipeImage = imageResponse.data.find(
                    (image) => image.recipeId === Number(id)
                );

                if (recipeImage) {
                    setExistingImageId(recipeImage.recipeImageId);
                    setExistingImageUrl(recipeImage.imageUrl);
                    setImageUrl(recipeImage.imageUrl);
                    setImagePreview(recipeImage.imageUrl);
                    setImageMode("url");
                }

                // Bestaande ingrediënten ophalen
                console.log(
                    "Ingrediënten uit database:",
                    recipe.ingredients
                );

                console.log(
                    "RecipeIngredients:",
                    recipe.recipeIngredients
                );

                const recipeIngredients =
                    recipe.ingredients ??
                    recipe.recipeIngredients ??
                    [];

                // Ingrediëntgegevens omzetten
                const mappedIngredients = recipeIngredients.map((item) => ({
                    ingredientId: Number(
                        item.ingredientId ??
                        item.ingredient?.ingredientId
                    ),

                    quantity:
                        item.quantity ??
                        item.recipeIngredient?.quantity ??
                        "",

                    unit:
                        item.unit ??
                        item.recipeIngredient?.unit ??
                        "",
                }));

                console.log(
                    "Gemapte ingrediënten:",
                    mappedIngredients
                );

                // Ingrediënten en hoeveelheden in de state plaatsen
                setSelectedIngredients(
                    mappedIngredients.filter(
                        (item) => Number.isInteger(item.ingredientId)
                    )
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

        if (!name) {
            setError("Vul een ingrediëntnaam in.");
            return;
        }

        const existingIngredient = ingredients.find(
            (ingredient) =>
                ingredient.name.toLowerCase() === name.toLowerCase()
        );

        if (existingIngredient) {
            setSelectedIngredients((previous) => {
                const alreadySelected = previous.some(
                    (item) =>
                        item.ingredientId === existingIngredient.ingredientId
                );

                if (alreadySelected) return previous;

                return [
                    ...previous,
                    {
                        ingredientId: existingIngredient.ingredientId,
                        quantity: "",
                        unit: "",
                    },
                ];
            });

            setNewIngredient("");
            setError("");
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
                {
                    ingredientId: createdIngredient.ingredientId,
                    quantity: "",
                    unit: "",
                },
            ]);

            setNewIngredient("");
            setError("");

        } catch (err) {
            console.error("Error creating ingredient:", err);

            setError(
                err.response?.data?.message ||
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
            recipe: {
                title: formData.title.trim(),
                description: formData.description.trim(),
                instructions: formData.instructions.trim(),
                preparationTime: Number(formData.preparationTime),
                servings: Number(formData.servings),
            },

            categoryId: Number(formData.categoryId),

            ingredients: selectedIngredients.map((ingredient) => ({
                ingredientId: ingredient.ingredientId,
                quantity: Number(ingredient.quantity),
                unit: ingredient.unit.trim(),
            })),
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

        const invalidIngredient = recipe.ingredients.some(
            (ingredient) =>
                !Number.isFinite(ingredient.quantity) ||
                ingredient.quantity <= 0 ||
                !ingredient.unit
        );

        if (invalidIngredient) {
            setError(
                "Controleer de hoeveelheden en eenheden van je ingrediënten."
            );
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
                if (existingImageId) {
                    await updateRecipeImage(existingImageId, {
                        imageUrl: imageUrl.trim(),
                        recipeId: Number(id),
                    });
                } else {
                    await createRecipeImage({
                        imageUrl: imageUrl.trim(),
                        recipeId: Number(id),
                    });
                }
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

    const handleIngredientsChange = (event) => {
        const selectedIds = Array.from(
            event.target.selectedOptions,
            (option) => Number(option.value)
        );

        setSelectedIngredients((previous) => {
            return selectedIds.map((id) => {
                const existing = previous.find(
                    (ingredient) => ingredient.ingredientId === id
                );

                return existing || {
                    ingredientId: id,
                    quantity: "",
                    unit: "",
                };
            });
        });
    };

    // Hoeveelheid en eenheid van een ingrediënt aanpassen
    const handleIngredientChange = (ingredientId, field, value) => {
        setSelectedIngredients((previous) =>
            previous.map((ingredient) =>
                ingredient.ingredientId === ingredientId
                    ? {
                        ...ingredient,
                        [field]: value,
                    }
                    : ingredient
            )
        );
    };

    // {selectedIngredients.map((selected) => {
    //     const ingredient = ingredients.find(
    //         (item) =>
    //             item.ingredientId === selected.ingredientId
    //     );
    // })}

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


                    <div className="ingredient-section">

                        <label htmlFor="ingredients">
                            Ingredients
                        </label>

                        <select
                            className="field ingredient-select"
                            id="ingredients"
                            multiple
                            value={selectedIngredients.map((item) =>
                                String(item.ingredientId)
                            )}
                            onChange={handleIngredientsChange}
                            disabled={ingredientsLoading}
                            size={5}
                        >
                            {ingredients.map((ingredient) => (
                                <option
                                    key={ingredient.ingredientId}
                                    value={ingredient.ingredientId}
                                >
                                    {ingredient.name}
                                </option>
                            ))}
                        </select>

                        <small>
                            Use Ctrl (Windows) or Cmd (Mac) to select multiple ingredients.
                        </small>

                        {selectedIngredients.length > 0 && (
                            <div className="selected-ingredients">

                                <h4>Selected ingredients</h4>

                                {selectedIngredients.map((selected) => {

                                    const ingredient = ingredients.find(
                                        (item) =>
                                            item.ingredientId === selected.ingredientId
                                    );

                                    return (
                                        <div
                                            className="selected-ingredient"
                                            key={selected.ingredientId}
                                        >

                                            <label>
                                                {ingredient?.name ?? "Unknown ingredient"}
                                            </label>


                                            <input
                                                className="field"
                                                type="number"
                                                min="0.001"
                                                step="0.001"
                                                placeholder="Quantity"
                                                value={selected.quantity}
                                                onChange={(event) =>
                                                    handleIngredientChange(
                                                        selected.ingredientId,
                                                        "quantity",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <input
                                                className="field"
                                                type="text"
                                                maxLength={50}
                                                placeholder="Unit (e.g. gram)"
                                                value={selected.unit}
                                                onChange={(event) =>
                                                    handleIngredientChange(
                                                        selected.ingredientId,
                                                        "unit",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                        <div className="add-ingredient">

                            <input
                                className="field"
                                type="text"
                                placeholder="New ingredient"
                                value={newIngredient}
                                onChange={(event) =>
                                    setNewIngredient(event.target.value)
                                }
                            />

                            <Button
                                text="Add"
                                buttonType="button"
                                btnColor="green-filled"
                                onClick={handleCreateIngredient}
                            />

                        </div>

                    </div>



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
                            onClick={handleSubmit}
                        />
                    </div>
                </form>
            </div>
        </section>
    );
}

export default UpdateRecipe;
