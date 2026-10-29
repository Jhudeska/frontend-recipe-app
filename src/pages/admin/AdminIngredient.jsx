
import { useState, useEffect } from "react";

import {
    getAllIngredients,
    createIngredient,
    updateIngredient,
    deleteIngredient,
} from "../../api/ingredientService.js";

function AdminIngredient() {
    const [ingredients, setIngredients] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState("");

    const loadIngredients = async () => {
        try {
            const response = await getAllIngredients();
            setIngredients(response.data);
        } catch (error) {
            console.error("Could not load ingredients:", error);
        }
    };

    useEffect(() => {
        loadIngredients();
    }, []);

    const handleAdd = async () => {
        if (!newName.trim()) {
            alert("Vul een ingredientnaam in.");
            return;
        }

        try {
            await createIngredient({
                name: newName.trim(),
            });

            setNewName("");
            setAdding(false);

            await loadIngredients();
        } catch (error) {
            console.error("Could not create ingredient:", error);
            alert(
                error.response?.data?.message ||
                "Ingredient toevoegen is mislukt."
            );
        }
    };

    const startEdit = (ingredient) => {
        setEditingId(ingredient.ingredientId);
        setEditName(ingredient.name ?? "");
    };

    const handleUpdate = async (ingredientId) => {
        if (!editName.trim()) {
            alert("Vul een ingredientnaam in.");
            return;
        }

        try {
            await updateIngredient(ingredientId, {
                name: editName.trim(),
            });

            setEditingId(null);
            await loadIngredients();
        } catch (error) {
            console.error("Could not update ingredient:", error);
            alert(
                error.response?.data?.message ||
                "Ingredient wijzigen is mislukt."
            );
        }
    };

    const handleDelete = async (ingredientId) => {
        if (!window.confirm("Weet je zeker dat je dit ingredient wilt verwijderen?")) {
            return;
        }

        try {
            await deleteIngredient(ingredientId);
            await loadIngredients();
        } catch (error) {
            console.error("Could not delete ingredient:", error);
            alert(
                error.response?.data?.message ||
                "Ingredient verwijderen is mislukt."
            );
        }
    };

    return (
        <section className="admin-ingredient">
            <h1>Ingredients</h1>

            <table className="data1">
                <thead>
                <tr className="thead">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Add / Save</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>

                <tbody>
                {ingredients.map((ingredient) => (
                    <tr key={ingredient.ingredientId}>
                        <td>{ingredient.ingredientId}</td>

                        <td>
                            {editingId === ingredient.ingredientId ? (
                                <input
                                    value={editName}
                                    maxLength={255}
                                    onChange={(e) =>
                                        setEditName(e.target.value)
                                    }
                                />
                            ) : (
                                <strong>{ingredient.name}</strong>
                            )}
                        </td>

                        <td>
                            {editingId === ingredient.ingredientId && (
                                <button
                                    className="mini-btn"
                                    onClick={() =>
                                        handleUpdate(
                                            ingredient.ingredientId
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
                                        ingredient.ingredientId
                                    ) {
                                        setEditingId(null);
                                    } else {
                                        startEdit(ingredient);
                                    }
                                }}
                            >
                                {editingId === ingredient.ingredientId
                                    ? "Cancel"
                                    : "Edit"}
                            </button>
                        </td>

                        <td>
                            <button
                                className="mini-btn x"
                                onClick={() =>
                                    handleDelete(
                                        ingredient.ingredientId
                                    )
                                }
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}

                {adding && (
                    <tr>
                        <td>New</td>

                        <td>
                            <input
                                placeholder="Ingredient name"
                                maxLength={255}
                                value={newName}
                                onChange={(e) =>
                                    setNewName(e.target.value)
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
                                    setNewName("");
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
                onClick={() => setAdding(true)}
                disabled={adding || editingId !== null}
            >
                + Add ingredient
            </button>
        </section>
    );
}

export default AdminIngredient;
