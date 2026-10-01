
import './App.css'
import {useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Splash from "./components/splash/Splash.jsx";
import GetStarted from "./components/getstarted/GetStarted.jsx";
import Overview from "./components/overview/Overview.jsx";
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


function App() {
  const [introStep, setIntroStep] = useState("splash");

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


        <BrowserRouter>

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
                  element={<Overview />}
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
                path="/signin"
                element={<SignIn />}
            />

              <Route
                  path="/contact"
                  element={<Contact />}
              />

              <Route
                  path="/profile"
                  element={<Profile />}
              />

              <Route path="*"
                     element={<NotFound />}
              />

            </Routes>
          </section>

          <Footer />

        </BrowserRouter>
      </main>
    </>
  )
}

export default App
