
import { useState, useEffect } from "react";

import {
    getAllRecipeIngredients,
    createRecipeIngredient,
    updateRecipeIngredient,
    deleteRecipeIngredient,
} from "../../api/recipeIngredientService.js";

function AdminRecipeIngredient() {
    const [recipeIngredients, setRecipeIngredients] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [editRecipeId, setEditRecipeId] = useState("");
    const [editIngredientId, setEditIngredientId] = useState("");
    const [editQuantity, setEditQuantity] = useState("");
    const [editUnit, setEditUnit] = useState("");

    const [adding, setAdding] = useState(false);
    const [newRecipeId, setNewRecipeId] = useState("");
    const [newIngredientId, setNewIngredientId] = useState("");
    const [newQuantity, setNewQuantity] = useState("");
    const [newUnit, setNewUnit] = useState("");

    const loadRecipeIngredients = async () => {
        try {
            const response = await getAllRecipeIngredients();
            setRecipeIngredients(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Could not load recipe ingredients:", error);
        }
    };

    useEffect(() => {
        loadRecipeIngredients();
    }, []);


    const handleAdd = async () => {
        if (
            !newRecipeId ||
            !newIngredientId ||
            !newQuantity ||
            Number(newRecipeId) <= 0 ||
            Number(newIngredientId) <= 0 ||
            Number(newQuantity) <= 0 ||
            !newUnit.trim()
        ) {
            alert("Vul alle velden correct in.");
            return;
        }

        try {
            await createRecipeIngredient({
                recipeId: Number(newRecipeId),
                ingredientId: Number(newIngredientId),
                quantity: Number(newQuantity),
                unit: newUnit.trim(),
            });

            setNewRecipeId("");
            setNewIngredientId("");
            setNewQuantity("");
            setNewUnit("");
            setAdding(false);

            await loadRecipeIngredients();
        } catch (error) {
            console.error("Fout bij toevoegen recipe ingredient:", error);

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Recipe ingredient toevoegen is mislukt. Probeer het opnieuw.";

            alert(message);
        }
    };

    const startEdit = (item) => {
        setEditingId(item.recipeIngredientId);
        setEditRecipeId(String(item.recipeId));
        setEditIngredientId(String(item.ingredientId));
        setEditQuantity(String(item.quantity));
        setEditUnit(item.unit ?? "");
    };

    const handleUpdate = async (id) => {
        if (
            !editRecipeId ||
            !editIngredientId ||
            !editQuantity ||
            Number(editQuantity) <= 0 ||
            !editUnit.trim()
        ) {
            return;
        }

        try {
            await updateRecipeIngredient(id, {
                recipeId: Number(editRecipeId),
                ingredientId: Number(editIngredientId),
                quantity: Number(editQuantity),
                unit: editUnit.trim(),
            });

            setEditingId(null);
            await loadRecipeIngredients();
        } catch (error) {
            console.error("Could not update recipe ingredient:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this recipe ingredient?")) return;

        try {
            await deleteRecipeIngredient(id);
            await loadRecipeIngredients();
        } catch (error) {
            console.error("Could not delete recipe ingredient:", error);
        }
    };

    return (
        <section className="admin-recipe-ingredient">
            <button
                className="mini-btn"
                onClick={() => setAdding(true)}
                disabled={adding}
            >
                + Add recipe ingredient
            </button>
            <h1>Recipe Ingredients</h1>

            <table className="data1">
                <thead>
                <tr className="thead">
                    <th>ID</th>
                    <th>Recipe ID</th>
                    <th>Ingredient</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Add / Save</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>

                <tbody>
                {recipeIngredients.map((item) => (
                    <tr key={item.recipeIngredientId}>
                        <td>{item.recipeIngredientId}</td>

                        <td>
                            {editingId === item.recipeIngredientId ? (
                                <input
                                    type="number"
                                    min="1"
                                    value={editRecipeId}
                                    onChange={(e) =>
                                        setEditRecipeId(e.target.value)
                                    }
                                />
                            ) : (
                                item.recipeId
                            )}
                        </td>

                        <td>
                            {editingId === item.recipeIngredientId ? (
                                <input
                                    type="number"
                                    min="1"
                                    value={editIngredientId}
                                    onChange={(e) =>
                                        setEditIngredientId(e.target.value)
                                    }
                                />
                            ) : (
                                item.ingredientName
                            )}
                        </td>

                        <td>
                            {editingId === item.recipeIngredientId ? (
                                <input
                                    type="number"
                                    min="0.01"
                                    step="any"
                                    value={editQuantity}
                                    onChange={(e) =>
                                        setEditQuantity(e.target.value)
                                    }
                                />
                            ) : (
                                item.quantity
                            )}
                        </td>

                        <td>
                            {editingId === item.recipeIngredientId ? (
                                <input
                                    maxLength="50"
                                    value={editUnit}
                                    onChange={(e) =>
                                        setEditUnit(e.target.value)
                                    }
                                />
                            ) : (
                                item.unit
                            )}
                        </td>

                        <td>
                            {editingId === item.recipeIngredientId && (
                                <button
                                    className="mini-btn"
                                    onClick={() =>
                                        handleUpdate(
                                            item.recipeIngredientId
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
                                onClick={() => {
                                    if (
                                        editingId ===
                                        item.recipeIngredientId
                                    ) {
                                        setEditingId(null);
                                    } else {
                                        startEdit(item);
                                    }
                                }}
                            >
                                {editingId === item.recipeIngredientId
                                    ? "Cancel"
                                    : "Edit"}
                            </button>
                        </td>

                        <td>
                            <button
                                className="mini-btn x"
                                onClick={() =>
                                    handleDelete(item.recipeIngredientId)
                                }
                            >
                                x
                            </button>
                        </td>
                    </tr>
                ))}

                {adding && (
                    <tr>
                        <td>New</td>

                        <td>
                            <input
                                type="number"
                                min="1"
                                placeholder="Recipe ID"
                                value={newRecipeId}
                                onChange={(e) =>
                                    setNewRecipeId(e.target.value)
                                }
                            />
                        </td>

                        <td>
                            <input
                                type="number"
                                min="1"
                                placeholder="Ingredient ID"
                                value={newIngredientId}
                                onChange={(e) =>
                                    setNewIngredientId(e.target.value)
                                }
                            />
                        </td>

                        <td>
                            <input
                                type="number"
                                min="0.01"
                                step="any"
                                placeholder="Quantity"
                                value={newQuantity}
                                onChange={(e) =>
                                    setNewQuantity(e.target.value)
                                }
                            />
                        </td>

                        <td>
                            <input
                                maxLength="50"
                                placeholder="Unit"
                                value={newUnit}
                                onChange={(e) =>
                                    setNewUnit(e.target.value)
                                }
                            />
                        </td>

                        <td>
                            <button
                                className="mini-btn"
                                onClick={handleAdd}
                            >
                                Save
                            </button>
                        </td>

                        <td>
                            <button
                                className="mini-btn"
                                onClick={() => {
                                    setAdding(false);
                                    setNewRecipeId("");
                                    setNewIngredientId("");
                                    setNewQuantity("");
                                    setNewUnit("");
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

        </section>
    );
}

export default AdminRecipeIngredient;
