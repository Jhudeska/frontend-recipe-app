import "./Navbar.css"
import logo from "../../assets/receta-logo.svg"
import userBadge from "../../assets/user-regular-full.svg" ;
import {NavLink, useNavigate} from "react-router-dom";
import {useState} from "react";


function Navbar() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (event) => {
        event.preventDefault();

        if (!query.trim()) return;

        navigate(`/search?q=${encodeURIComponent(query)}`);
    };
    return (
        <nav className="navbar">

            <div className="navbar__logo">
                <NavLink to="/" className="navbar__logo">
                    <img
                        width="50px"
                        src={logo}
                        alt="My Website"
                    />
                    <span className="navbar__logo-text">Receta</span>
                </NavLink>
            </div>


            <div className="navbar__left">



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

            </div>


            <div className="navbar__right">

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

            </div>

        </nav>
    );
}

export default Navbar;