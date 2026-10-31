import './App.css'
import {useState} from "react";
import { Route, Routes} from "react-router-dom";
import Splash from "./components/splash/Splash.jsx";
import GetStarted from "./components/getstarted/GetStarted.jsx";
import Recipes from "./pages/recipes/Recipes.jsx";
import Favorites from "./pages/favorites/Favorites.jsx";
import Contact from "./pages/contact/Contact.jsx";
import Profile from "./pages/profile/Profile.jsx";
import NotFound from "./pages/404/NotFound.jsx";
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import Search from "./components/search/Search.jsx";
import SignIn from "./components/signin/SignIn.jsx";
import Admin from "./pages/admin/Admin.jsx";
import AddRecipe from "./pages/recipes/AddRecipe.jsx";
import UpdateRecipe from "./pages/recipes/UpdateRecipe.jsx";
import RecipeDetail from "./pages/recipes/RecipeDetail.jsx";
import Overview1 from "./pages/overview/Overview.jsx";
import Logout from "./pages/logout/Logout.jsx";
import { useAuth } from "./context/AuthContext.jsx";


function App() {

    const [introStep, setIntroStep] = useState(() => {
        return window.matchMedia("(max-width: 767px)").matches
            ? "splash"
            : "website";
    });

    const { isAuthenticated, login, register } = useAuth();


    if (!isAuthenticated) {
            return (
                <main>
                    <h1>Welcome</h1>

                    <button onClick={login}>
                        Login
                    </button>

                    <button onClick={register}>
                        Register
                    </button>
                </main>
            );
        }

  return (
    <>
      {/* =====================
          MOBILE INTRO
      ===================== */}

      <section className="mobile-intro">

        {introStep === "splash" && (
            <Splash
                onContinue={() =>
                    setIntroStep("get-started")
                }
            />
        )}

        {introStep === "get-started" && (
            <GetStarted
                onStart={() =>
                    setIntroStep("website")
                }
            />
        )}

      </section>






      {/* =====================
          WEBSITE
      ===================== */}

      <main
          className={`site ${
              introStep === "website"
                  ? "site__visible"
                  : ""
          }`}
      >




          <Header />

          <section className="outer-container header-test">
            <div className="inner-container">
              <Navbar />
            </div>
          </section>


          <section className="main">
            <Routes>

              <Route
                  path="/"
                  element={<Overview1 />}
              />

              <Route
                  path="/add_recipes"
                  element={<AddRecipe />}
              />

              <Route
                  path="/update_recipes"
                  element={<UpdateRecipe />}
              />

              <Route
                  // dynamische routing with use params || const {id} = use params();
                  path="/recipes/:id"
                  // path="/recipe_detail"
                  element={<RecipeDetail />}
                  // private routing
                  // const auth =  true;
                  //   <Route path="/recipes" element={auth ? <Recipes /> : Navigate to="/login" />} >
              />

              <Route
                  path="/recipes"
                  element={<Recipes />}
              />

              <Route
                  path="/favorites"
                  element={<Favorites />}

              /><Route
                  path="/search"
                  element={<Search />}
              />
              <Route
                path="/sign_in"
                element={<SignIn />}
            />

              <Route
                  path="/contact"
                  element={<Contact />}
              />

                <Route
                    path="/recipes/:id/edit"
                    element={<UpdateRecipe />}
                />

              <Route
                  path="/profile"
                  element={<Profile />}
              />

              <Route path="/admin"
                     element={<Admin />}
              />
                <Route path="/logout"
                       element={<Logout />}
                />


              <Route path="*"
                     element={<NotFound />}
              />

            </Routes>
          </section>


          <Footer />


      </main>
    </>
  )
}

export default App
