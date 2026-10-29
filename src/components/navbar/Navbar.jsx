import "./Navbar.css"
import logo from "../../assets/receta-logo.svg"
import userBadge from "../../assets/user-regular-full.svg" ;
import {NavLink, useNavigate} from "react-router-dom";
import {useState} from "react";
import keycloak from "../../helpers/keycloak.js";


function Navbar() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (event) => {
        event.preventDefault();

        const searchQuery = query.trim();

        if (!searchQuery) return;

        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    };

    async function handleLogout() {
        try {
            await keycloak.logout({
                redirectUri: window.location.origin,
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <nav className="navbar">

            <section className="navbar__logo">
                <NavLink to="/" className="navbar__logo">
                    <img
                        src={logo}
                        alt="My Website"
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
                    to="/favorites"
                    className="green-outline"
                >
                    Favorites
                </NavLink>

                <NavLink
                    to="/contact"
                    className="green-outline"
                >
                    Contact
                </NavLink>

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

                <NavLink
                    to="/profile"
                    className="profile-link"
                >
                  <img className="user-badge" src={userBadge} alt="Profile" />
                    Profile
                </NavLink>

                <NavLink
                    to="/logout"
                    className="logout"
                >
                    <button className="green-outline" onClick={handleLogout}>
                        Logout
                    </button>
                </NavLink>

                {/*<main>*/}
                {/*    <h1>*/}
                {/*        Welcome,{" "}*/}
                {/*        {keycloak.tokenParsed?.preferred_username}*/}
                {/*    </h1>*/}

                {/*    <button onClick={handleLogout}>*/}
                {/*        Logout*/}
                {/*    </button>*/}
                {/*</main>*/}

            </section>

        </nav>

    );
}

export default Navbar;