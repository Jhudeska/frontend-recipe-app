import './SignIn.css'
import logo from "../../assets/receta-logo.svg"
import signInImg from "../../assets/signin-img.jpg"

function SignIn() {
    return (
        <section className=" outer-container sign-in">
            <div className="inner-container">

                <section className=" outer-container sign-in__1">
                    <div className="inner-container">
                        <div className="sign-in__form-container">
                            <div className="logo-badge">
                                <img src={logo} alt="logo" className="logo" />
                            </div>

                            <h1 className="sign-in__heading">Sign In</h1>

                            <form className="sign-in__form">
                                <input
                                    className="field"
                                    type="text"
                                    placeholder="Username"
                                />

                                <input
                                    className="field"
                                    type="password"
                                    placeholder="Password"
                                />

                                <div className="sign-in__links">
                                    <a href="/forgot-password">
                                        Forgot your password?
                                    </a>

                                    <a href="/forgot-username">
                                        Forgot your username?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Sign In
                                </button>
                            </form>

                            <p className="sign-in__signup-text">
                                Don't have an account?
                            </p>

                            <a href="/signup" className="btn btn-outline">
                                Sign Up
                            </a>
                        </div>
                    </div>
                    </section>

                <section className=" outer-container sign-in__2">
                    <div className="inner-container">
                        <img
                            className="sign-in__image"
                            src={signInImg}
                            alt="Cooking a dish"
                        />
                    </div>
                    </section>


            </div>
        </section>
    )
}

export default SignIn
