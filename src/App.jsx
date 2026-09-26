
import './App.css'
import Home from "./pages/home/Home.jsx";
import {Link, Route, Routes} from "react-router-dom";
import Recipes from "./pages/recipes/Recipes.jsx";
import NotFound from "./pages/404/NotFound.jsx";
import Contact from "./pages/contact/Contact.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Favorites from "./pages/favorites/Favorites.jsx";

function App() {


  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/favorites">Favorite</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <Routes>
        <Route path="/"
               element={<Home />}
        />
        <Route path="/recipes"
               element={<Recipes />}
        />
        <Route path="/favorites"
               element={<Favorites />}
        />
        <Route path="/contact"
               element={<Contact />}
        />
        <Route path="/profile"
               element={<Profile />}
        />
        <Route path="*"
               element={<NotFound />}
        />
      </Routes>
    </>
  )
}

export default App
