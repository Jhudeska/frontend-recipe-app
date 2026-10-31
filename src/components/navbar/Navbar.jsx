import "./Navbar.css"
import logo from "../../assets/receta-logo.svg"
import userBadge from "../../assets/user-regular-full.svg" ;
import {NavLink, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";


function Navbar() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, logout, hasRole } = useAuth();

    const handleSearch = (event) => {
        event.preventDefault();

        const searchQuery = query.trim();

        if (!searchQuery) return;

        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <nav className="navbar">

            <section className="navbar__logo">
                <NavLink to="/" className="navbar__logo">
                    <img
                        src={logo}
                        alt="Receta logo"
                    />
                    <span className="navbar__logo-text">Receta</span>
                </NavLink>
            </section>


            <section className="navbar__left">

                <NavLink
                    to="/"
                    className="green-outline"
                >
                    Home
                </NavLink>

                <NavLink
                    to="/recipes"
                    className="green-outline"
                >
                    Recipes
                </NavLink>

                <NavLink
                    to="/contact"
                    className="green-outline"
                >
                    Contact
                </NavLink>

                {isAuthenticated && (
                <NavLink
                    to="/favorites"
                    className="green-outline"
                >
                    Favorites
                </NavLink>
                )}
            </section>


            <section className="navbar__right">

                <form
                    className="search"
                    onSubmit={handleSearch}
                >

                    <input
                        type="search"
                        value={query}
                        onChange={(event) =>
                            setQuery(event.target.value)
                        }
                        placeholder="Search..."
                    />

                    <button
                        type="submit"
                        className="sbtn"
                        aria-label="Search"
                    >
                        &#128269;
                    </button>

                </form>

                {!isLoading && (
                    isAuthenticated ? (
                        <>
                            <NavLink
                                to="/profile"
                                className="profile-link"
                            >
                                <img className="user-badge" src={userBadge} alt="Profile" />
                                Profile
                            </NavLink>

                            {hasRole("ROLE_ADMIN") && (
                                <NavLink to="/admin" className="green-outline">
                                Admin
                                </NavLink>
                                )}

                            <button
                                type="button"
                                className="green-outline logout"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/sign_in"
                                className="green-outline"
                            >
                                Sign in
                            </NavLink>
                            <NavLink
                                to="/sign_in_keycloak"
                                className="green-outline"
                            >
                                Sign in KeyCloak
                            </NavLink>
                        </>

                    )
                )}



            </section>

        </nav>

    );
}

export default Navbar;