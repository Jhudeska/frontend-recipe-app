
import { useAuth } from "../../context/AuthContext.jsx";
import "./SignInKeycloak.css";

function SignInKeycloak() {

    const { login, register, isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return (
            <section className="signin">
                <h2>You are already signed in!</h2>
                <p>Welcome to Receta.</p>
            </section>
        );
    }

    return (
        <section className="signin">

            <h1>Welcome to Receta</h1>

            <p>
                Sign in to discover your personal
                recipe collection.
            </p>

            <button onClick={login}>
                Sign in
            </button>

            <button onClick={register}>
                Create an account
            </button>

        </section>
    );
}

export default SignInKeycloak;
