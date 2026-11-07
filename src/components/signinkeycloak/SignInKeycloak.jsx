
import { useAuth } from "../../context/AuthContext.jsx";
import "./SignInKeycloak.css";

function SignInKeycloak() {

    const { login, register, isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return (
            <section className=" outer-container signin">
                <div className="inner-container">
                <h2>You are already signed in!</h2>
                <p>Welcome to Receta.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="outer-container  signin">
            <div className="inner-container">

            <h1>Welcome to Receta</h1>

            <p className="margin-bottom">
                Sign in to discover your personal
                recipe collection.
            </p>

            <button className="green-filled margin-bottom" onClick={login}>
                Sign in
            </button>

            <button className="green-outline" onClick={register}>
                Create an account
            </button>
            </div>
        </section>


    );
}

export default SignInKeycloak;
