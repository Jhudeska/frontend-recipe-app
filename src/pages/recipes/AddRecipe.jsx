import {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import "./AddRecipe.css";
import Button from "../../components/button/Button.jsx";
import { createRecipe } from "../../api/recipeService.js";
import { getAllCategories } from "../../api/categoryService.js";
import {
    createRecipeImage,
    uploadRecipeImage,
} from "../../api/recipeImageService.js";
import {
    getAllIngredients,
    createIngredient,
} from "../../api/ingredientService.js";

function AddRecipe() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [imageMode, setImageMode] = useState("upload");
    const [imageUrl, setImageUrl] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState("");
    const [ingredientsLoading, setIngredientsLoading] = useState(true);

    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        instructions: "",
        preparationTime: "",
        servings: "",
        categoryId: "",
    });

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await getAllIngredients();
                setIngredients(response.data);
            } catch (err) {
                console.error("Error fetching ingredients:", err);
                setError("De ingrediënten konden niet worden opgehaald.");
            } finally {
                setIngredientsLoading(false);
            }
        };

        fetchIngredients();
    }, []);



    useEffect(() => {
        let active = true;

        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();

                if (active) {
                    setCategories(response.data);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);

                if (active) {
                    setError("De categorieën konden niet worden opgehaald.");
                }
            } finally {
                if (active) {
                    setCategoriesLoading(false);
                }
            }
        };

        fetchCategories();

        return () => {
            active = false;
        };
    }, []);


    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);



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
    };



    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

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

        if (imageMode === "upload" && !imageFile) {
            setError("Selecteer een afbeelding om te uploaden.");
            return;
        }

        if (imageMode === "url" && !imageUrl.trim()) {
            setError("Vul een image-URL in.");
            return;
        }

        setLoading(true);

        try {
            const response = await createRecipe(recipe);
            const recipeId = response.data.recipeId;

            if (!recipeId) {
                throw new Error(
                    "Het recept is aangemaakt, maar het recept-ID ontbreekt in de response."
                );
            }

            if (imageMode === "upload") {
                await uploadRecipeImage(imageFile, recipeId);
            } else {
                await createRecipeImage({
                    imageUrl: imageUrl.trim(),
                    recipeId,
                });
            }

            navigate("/recipes");
        } catch (err) {
            console.error("Error creating recipe:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Het recept of de afbeelding kon niet worden opgeslagen."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
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
                err.response?.data?.message ||
                "Het ingrediënt kon niet worden toegevoegd."
            );
        }
    };


    return (
        <section className="outer-container page-container">
            <div className="inner-container">
                <h1>Add Recipe</h1>

                <form className="form-narrow" onSubmit={handleSubmit}>
                    <input
                        className="field"
                        name="title"
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    {/*<input*/}
                    {/*    className="field"*/}
                    {/*    name="category"*/}
                    {/*    type="category"*/}
                    {/*    placeholder="Category"*/}
                    {/*    value={formData.category}*/}
                    {/*    onChange={handleChange}*/}
                    {/*    required*/}
                    {/*/>*/}

                    {/*<option key={category.id} value={category.id}>*/}
                    {/*    {category.name}*/}
                    {/*</option>*/}

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
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </option>
                        ))}
                    </select>




                    <div className="image-upload">
                    {/*<input*/}
                    {/*    ref={fileInputRef}*/}
                    {/*    type="file"*/}
                    {/*    accept="image/*"*/}
                    {/*    name="image"*/}
                    {/*    placeholder="Image"*/}
                    {/*    onChange={handleImageChange}*/}
                    {/*    hidden*/}
                    {/*/>*/}

                    {/*<button*/}
                    {/*    type="button"*/}
                    {/*    className="upload-button"*/}
                    {/*    onClick={() => fileInputRef.current.click()}*/}
                    {/*>*/}
                    {/*    Upload image*/}
                    {/*</button>*/}
                    {/*    {imagePreview && (*/}
                    {/*        <img*/}
                    {/*            src={imagePreview}*/}
                    {/*            alt="Preview"*/}
                    {/*            className="image-preview"*/}
                    {/*        />*/}
                    {/*    )}*/}

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
                                            setImagePreview(null);
                                        }}
                                    />
                                    Image URL
                                </label>
                            </div>

                            {imageMode === "upload" && (
                                <>
                                    <input
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
                                        onChange={(event) => setImageUrl(event.target.value)}
                                        required
                                    />

                                    {imageUrl.trim() && (
                                        <img
                                            src={imageUrl}
                                            alt="Recipe preview"
                                            className="image-preview"
                                            onError={(event) => {
                                                event.currentTarget.style.display = "none";
                                            }}
                                            onLoad={(event) => {
                                                event.currentTarget.style.display = "block";
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/*<input*/}
                    {/*    className="field"*/}
                    {/*    name="ingredients"*/}
                    {/*    type="text"*/}
                    {/*    placeholder="Ingredients"*/}
                    {/*    value={formData.ingredients}*/}
                    {/*    onChange={handleChange}*/}
                    {/*/>*/}

                    {/*<div className="ingredient-section">*/}
                    {/*    <label htmlFor="ingredients">Ingredients</label>*/}

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
                    {/*            onChange={(event) => setNewIngredient(event.target.value)}*/}
                    {/*        />*/}

                    {/*        <Button*/}
                    {/*            text="Add"*/}
                    {/*            buttonType="button"*/}
                    {/*            btnColor="green-filled"*/}
                    {/*            onClick={handleCreateIngredient}*/}
                    {/*        />*/}
                    {/*    </div>*/}

                    {/*    <small>Use Ctrl (Windows) or Cmd (Mac) to select multiple ingredients.</small>*/}
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
                        placeholder="Preparation time"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        className="field"
                        name="instructions"
                        placeholder="Instrunctions"
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

                    {/*<input*/}
                    {/*    className="field"*/}
                    {/*    name="servings"*/}
                    {/*    type="number"*/}
                    {/*    min="1"*/}
                    {/*    placeholder="Number of servings"*/}
                    {/*    value={formData.servings}*/}
                    {/*    onChange={handleChange}*/}
                    {/*    required*/}
                    {/*/>*/}
                    <div className="navigate-buttons">
                        <Button text="Cancel" buttonType="button" btnColor="green-filled"></Button>
                        <Button text="Save"   buttonType="submit" btnColor="green-filled"></Button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default AddRecipe;
