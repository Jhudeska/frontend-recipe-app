import { useState, useEffect } from "react";

import {
    getAllUserProfiles,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
} from "../../api/userProfileService.js";

const emptyForm = {
    username: "",
    email: "",
    password: "",
    profilePhotoUrl: "",
    bio: "",
};

function AdminUserProfile() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ ...emptyForm });
    const [editUser, setEditUser] = useState({ ...emptyForm });

    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await getAllUserProfiles();
            setUsers(response.data);
        } catch (error) {
            console.error("Could not load user profiles:", error);
            setErrorMessage(
                "Gebruikersprofielen konden niet worden geladen."
            );
        }
    };

    const handleChange = (formType, field, value) => {
        const setter =
            formType === "new" ? setNewUser : setEditUser;

        setter((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const validateUser = (user, isNew = false) => {
        if (!user.username.trim()) {
            return "Vul een gebruikersnaam in.";
        }

        if (user.username.trim().length > 100) {
            return "De gebruikersnaam mag maximaal 100 tekens bevatten.";
        }

        if (!user.email.trim()) {
            return "Vul een e-mailadres in.";
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim())
        ) {
            return "Vul een geldig e-mailadres in.";
        }

        if (user.email.trim().length > 255) {
            return "Het e-mailadres mag maximaal 255 tekens bevatten.";
        }

        if (isNew && user.password.length < 8) {
            return "Het wachtwoord moet minimaal 8 tekens bevatten.";
        }

        if (!isNew && user.password && user.password.length < 8) {
            return "Een nieuw wachtwoord moet minimaal 8 tekens bevatten.";
        }

        if (
            user.profilePhotoUrl.trim() &&
            !/^https?:\/\/.+/i.test(user.profilePhotoUrl.trim())
        ) {
            return "Vul een geldige profielfoto-URL in.";
        }

        return "";
    };

    const createPayload = (user, isNew = false) => {
        const payload = {
            username: user.username.trim(),
            email: user.email.trim(),
            profilePhotoUrl: user.profilePhotoUrl.trim(),
            bio: user.bio.trim(),
        };

        if (isNew || user.password) {
            payload.password = user.password;
        }

        return payload;
    };

    const handleAdd = async () => {
        const validationError = validateUser(newUser, true);

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            await createUserProfile(createPayload(newUser, true));

            setNewUser({ ...emptyForm });
            setAdding(false);

            await loadUsers();
        } catch (error) {
            console.error(
                "Could not create user profile:",
                error.response?.data ?? error.message
            );

            setErrorMessage(
                error.response?.data?.message ??
                "Gebruiker toevoegen is mislukt."
            );
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (user) => {
        setEditUser({
            username: user.username ?? "",
            email: user.email ?? "",
            password: "",
            profilePhotoUrl: user.profilePhotoUrl ?? "",
            bio: user.bio ?? "",
        });

        setEditingId(user.userId);
        setAdding(false);
        setErrorMessage("");
    };

    const handleUpdate = async (userId) => {
        const validationError = validateUser(editUser);

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            await updateUserProfile(
                userId,
                createPayload(editUser)
            );

            setEditingId(null);
            setEditUser({ ...emptyForm });

            await loadUsers();
        } catch (error) {
            console.error(
                "Could not update user profile:",
                error.response?.data ?? error.message
            );

            setErrorMessage(
                error.response?.data?.message ??
                "Gebruiker aanpassen is mislukt."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (
            !window.confirm(
                "Weet je zeker dat je deze gebruiker wilt verwijderen?"
            )
        ) {
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            await deleteUserProfile(userId);

            if (editingId === userId) {
                setEditingId(null);
                setEditUser({ ...emptyForm });
            }

            await loadUsers();
        } catch (error) {
            console.error(
                "Could not delete user profile:",
                error.response?.data ?? error.message
            );

            setErrorMessage(
                error.response?.data?.message ??
                "Gebruiker verwijderen is mislukt."
            );
        } finally {
            setLoading(false);
        }
    };

    const renderFields = (user, formType, isNew = false) => (
        <>
            <td>
                <input
                    value={user.username}
                    maxLength={100}
                    placeholder="Username"
                    onChange={(event) =>
                        handleChange(
                            formType,
                            "username",
                            event.target.value
                        )
                    }
                    required
                />
            </td>

            <td>
                <input
                    type="email"
                    value={user.email}
                    maxLength={255}
                    placeholder="Email"
                    onChange={(event) =>
                        handleChange(
                            formType,
                            "email",
                            event.target.value
                        )
                    }
                    required
                />
            </td>

            <td>
                <input
                    type="url"
                    value={user.profilePhotoUrl}
                    placeholder="Profile photo URL"
                    onChange={(event) =>
                        handleChange(
                            formType,
                            "profilePhotoUrl",
                            event.target.value
                        )
                    }
                />

                {user.profilePhotoUrl && (
                    <img
                        src={user.profilePhotoUrl}
                        alt="Profile preview"
                        style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            display: "block",
                            marginTop: "5px",
                        }}
                    />
                )}
            </td>

            <td>
                <textarea
                    value={user.bio}
                    placeholder="Bio"
                    onChange={(event) =>
                        handleChange(
                            formType,
                            "bio",
                            event.target.value
                        )
                    }
                />
            </td>

            <td>
                <input
                    type="password"
                    value={user.password}
                    placeholder={
                        isNew
                            ? "Password (min. 8 characters)"
                            : "Leave empty to keep current password"
                    }
                    onChange={(event) =>
                        handleChange(
                            formType,
                            "password",
                            event.target.value
                        )
                    }
                    required={isNew}
                    autoComplete="new-password"
                />
            </td>
        </>
    );

    return (
        <section className="admin-recipe">
            <h1>User Profiles</h1>

            {errorMessage && (
                <p role="alert" className="error-message">
                    {errorMessage}
                </p>
            )}

            <table className="data1">
                <thead>
                <tr className="thead">
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Profile photo</th>
                    <th>Bio</th>
                    <th>Password</th>
                    <th>Created</th>
                    <th>Save</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>

                <tbody>
                {users.map((user) => {
                    const isEditing = editingId === user.userId;

                    return (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>

                            {isEditing ? (
                                renderFields(editUser, "edit")
                            ) : (
                                <>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.profilePhotoUrl ? (
                                            <img
                                                src={user.profilePhotoUrl}
                                                alt={user.username}
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    objectFit: "cover",
                                                    borderRadius: "50%",
                                                }}
                                            />
                                        ) : (
                                            "No photo"
                                        )}
                                    </td>
                                    <td>{user.bio ?? ""}</td>
                                    <td>••••••••</td>
                                </>
                            )}

                            <td>
                                {user.created_at
                                    ? new Date(
                                        user.created_at
                                    ).toLocaleDateString("nl-NL")
                                    : "—"}
                            </td>

                            <td>
                                {isEditing && (
                                    <button
                                        className="mini-btn"
                                        disabled={loading}
                                        onClick={() =>
                                            handleUpdate(user.userId)
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
                                            setEditUser({
                                                ...emptyForm,
                                            });
                                            setErrorMessage("");
                                        } else {
                                            startEdit(user);
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
                                        handleDelete(user.userId)
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

                        {renderFields(newUser, "new", true)}

                        <td>—</td>

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
                                    setNewUser({ ...emptyForm });
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
                + Add user
            </button>
        </section>
    );
}

export default AdminUserProfile;
