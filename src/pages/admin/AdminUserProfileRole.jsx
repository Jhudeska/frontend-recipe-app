import { useState, useEffect } from "react";

import {
    getAllUserRoles,
    createUserRole,
    updateUserRole,
    deleteUserRole,
} from "../../api/userProfileRoleService.js";

const emptyForm = {
    role: "USER",
    userId: "",
};

const availableRoles = ["USER", "ADMIN", "CHEF"];

function AdminUserProfileRole() {
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState({ ...emptyForm });
    const [editRole, setEditRole] = useState({ ...emptyForm });

    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            const response = await getAllUserRoles();
            setRoles(response.data);
            setErrorMessage("");
        } catch (error) {
            console.error(
                "Could not load user profile roles:",
                error.response?.data ?? error.message
            );

            setErrorMessage(
                "Gebruikersrollen konden niet worden geladen."
            );
        }
    };

    const handleChange = (formType, field, value) => {
        const setter =
            formType === "new" ? setNewRole : setEditRole;

        setter((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const validateRole = (roleForm) => {
        if (!String(roleForm.userId).trim()) {
            return "Vul een gebruikers-ID in.";
        }

        if (
            !Number.isInteger(Number(roleForm.userId)) ||
            Number(roleForm.userId) <= 0
        ) {
            return "Het gebruikers-ID moet een positief geheel getal zijn.";
        }

        if (!availableRoles.includes(roleForm.role)) {
            return "Selecteer een geldige rol.";
        }

        return "";
    };

    const createPayload = (roleForm) => ({
        role: roleForm.role,
        userId: Number(roleForm.userId),
    });

    const handleAdd = async () => {
        const validationError = validateRole(newRole);

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            await createUserRole(createPayload(newRole));

            setNewRole({ ...emptyForm });
            setAdding(false);

            await loadRoles();
        } catch (error) {
            console.error(
                "Could not create user profile role:",
                error.response?.data ?? error.message
            );

            setErrorMessage(
                error.response?.data?.message ??
                "Gebruikersrol toevoegen is mislukt."
            );
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (roleAssignment) => {
        setEditRole({
            role: roleAssignment.role ?? "USER",
            userId: String(roleAssignment.userId ?? ""),
        });

        setEditingId(roleAssignment.id);
        setAdding(false);
        setErrorMessage("");
    };

    const handleUpdate = async (id) => {
        const validationError = validateRole(editRole);

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            await updateUserRole(
                id,
                createPayload(editRole)
            );

            setEditingId(null);
            setEditRole({ ...emptyForm });

            await loadRoles();
        } catch (error) {
            console.error(
                "Could not update user profile role:",
                error.response?.data ?? error.message
            );

            setErrorMessage(
                error.response?.data?.message ??
                "Gebruikersrol aanpassen is mislukt."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Weet je zeker dat je deze gebruikersrol wilt verwijderen?"
            )
        ) {
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            await deleteUserRole(id);

            if (editingId === id) {
                setEditingId(null);
                setEditRole({ ...emptyForm });
            }

            await loadRoles();
        } catch (error) {
            console.error(
                "Could not delete user profile role:",
                error.response?.data ?? error.message
            );

            setErrorMessage(
                error.response?.data?.message ??
                "Gebruikersrol verwijderen is mislukt."
            );
        } finally {
            setLoading(false);
        }
    };

    const renderFields = (roleForm, formType) => (
        <>
            <td>
                <input
                    type="number"
                    min="1"
                    step="1"
                    value={roleForm.userId}
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

            <td>
                <select
                    value={roleForm.role}
                    onChange={(event) =>
                        handleChange(
                            formType,
                            "role",
                            event.target.value
                        )
                    }
                    required
                >
                    {availableRoles.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
            </td>
        </>
    );

    return (
        <section className="admin-recipe">
            <h1>User Profile Roles</h1>

            {errorMessage && (
                <p role="alert" className="error-message">
                    {errorMessage}
                </p>
            )}

            <table className="data1">
                <thead>
                <tr className="thead">
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Role</th>
                    <th>Save</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>

                <tbody>
                {roles.map((roleAssignment) => {
                    const isEditing =
                        editingId === roleAssignment.id;

                    return (
                        <tr key={roleAssignment.id}>
                            <td>{roleAssignment.id}</td>

                            {isEditing ? (
                                renderFields(
                                    editRole,
                                    "edit"
                                )
                            ) : (
                                <>
                                    <td>
                                        {roleAssignment.userId}
                                    </td>
                                    <td>
                                        {roleAssignment.role}
                                    </td>
                                </>
                            )}

                            <td>
                                {isEditing && (
                                    <button
                                        className="mini-btn"
                                        disabled={loading}
                                        onClick={() =>
                                            handleUpdate(
                                                roleAssignment.id
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
                                            setEditRole({
                                                ...emptyForm,
                                            });
                                            setErrorMessage("");
                                        } else {
                                            startEdit(
                                                roleAssignment
                                            );
                                        }
                                    }}
                                >
                                    {isEditing
                                        ? "Cancel"
                                        : "Edit"}
                                </button>
                            </td>

                            <td>
                                <button
                                    className="mini-btn x"
                                    disabled={loading}
                                    onClick={() =>
                                        handleDelete(
                                            roleAssignment.id
                                        )
                                    }
                                >
                                    x
                                </button>
                            </td>
                        </tr>
                    );
                })}

                {roles.length === 0 && !adding && (
                    <tr>
                        <td colSpan="6">
                            Geen gebruikersrollen gevonden.
                        </td>
                    </tr>
                )}

                {adding && (
                    <tr>
                        <td>New</td>

                        {renderFields(newRole, "new")}

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
                                    setNewRole({
                                        ...emptyForm,
                                    });
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
                + Add user role
            </button>
        </section>
    );
}

export default AdminUserProfileRole;
