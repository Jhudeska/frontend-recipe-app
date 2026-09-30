import { useEffect } from "react";
import "./Splash.css";
import Logo from "../../assets/receta-logo.svg";

function Splash({ onContinue }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onContinue();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onContinue]);

    return (
        <section className="outer_container splash">
            <div className="inner-container splash__content">
                <img
                    src={Logo}
                    alt="Receta Logo"
                    className="splash__img"
                />
            </div>
        </section>
    );
}

export default Splash;