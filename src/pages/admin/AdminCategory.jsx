import { useState, useEffect } from "react";

import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../api/categoryService.js";

function AdminCategory() {

    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const loadCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleAdd = async () => {
        if (!newName.trim()) return;

        try {
            await createCategory({
                name: newName.trim(),
                description: newDescription.trim(),
            });

            setNewName("");
            setNewDescription("");
            setAdding(false);
            await loadCategories();
        } catch (error) {
            console.error("Could not create category:", error);
        }
    };

    const startEdit = (category) => {
        setEditingId(category.categoryId);
        setEditName(category.name ?? "");
        setEditDescription(category.description ?? "");
    };

    const handleUpdate = async (categoryId) => {
        if (!editName.trim()) return;

        try {
            await updateCategory(categoryId, {
                name: editName.trim(),
                description: editDescription.trim(),
            });

            setEditingId(null);
            await loadCategories();
        } catch (error) {
            console.error("Could not update category:", error);
        }
    };

    const handleDelete = async (categoryId) => {
        if (!window.confirm("Delete this category?")) return;

        try {
            await deleteCategory(categoryId);
            await loadCategories();
        } catch (error) {
            console.error("Could not delete category:", error);
        }
    };

    return (
        <section className="admin-category">

            <h1>Categories</h1>

            <table className="data1">
                <thead>
                <tr className="thead">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Add / Save</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>

                <tbody>
                {categories.map((category) => (
                    <tr key={category.categoryId}>
                        <td>{category.categoryId}</td>

                        <td>
                            {editingId === category.categoryId ? (
                                <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            ) : (
                                <strong>{category.name}</strong>
                            )}
                        </td>

                        <td>
                            {editingId === category.categoryId ? (
                                <input
                                    value={editDescription}
                                    onChange={(e) =>
                                        setEditDescription(e.target.value)
                                    }
                                />
                            ) : (
                                category.description
                            )}
                        </td>

                        <td>
                            {editingId === category.categoryId && (
                                <button
                                    className="mini-btn"
                                    onClick={() => handleUpdate(category.categoryId)}
                                >
                                    Save
                                </button>
                            )}
                        </td>

                        <td>
                            <button
                                className="mini-btn"
                                onClick={() => {
                                    if (editingId === category.categoryId) {
                                        setEditingId(null);
                                    } else {
                                        startEdit(category);
                                    }
                                }}
                            >
                                {editingId === category.categoryId ? "Cancel" : "Edit"}
                            </button>
                        </td>

                        <td>
                            <button
                                className="mini-btn x"
                                onClick={() => handleDelete(category.categoryId)}
                            >
                                x
                            </button>
                        </td>
                    </tr>
                ))}

                {adding && (
                    <tr key="new-category">
                        <td>New</td>
                        <td>
                            <input
                                placeholder="Name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                placeholder="Description"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                        </td>
                        <td>
                            <button className="mini-btn" onClick={handleAdd}>
                                Save
                            </button>
                        </td>
                        <td>
                            <button
                                className="mini-btn"
                                onClick={() => setAdding(false)}
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
                disabled={adding}
            >
                + Add category
            </button>

        </section>

)
}

export default AdminCategory;