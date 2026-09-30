import "./GetStarted.css"

function GetStarted({ onStart }) {
    return (
        <section className="get-started">

            <button onClick={onStart}>
                Get Started
            </button>

        </section>
    );
}

export default GetStarted;