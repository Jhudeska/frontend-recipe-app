import "./CookingSpinner.css";

function CookingSpinner({text}) {
    return (
        <div className="cooking-loader" role="status"
             aria-label="Recepten laden">
            <svg
                className="pot"
                viewBox="0 0 120 120"
                width="120"
                height="120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Steam */}
                <g className="steam" stroke="#E99A62"
                   strokeWidth="4" strokeLinecap="round">
                    <path d="M40 37 C30 28 48 23 40 13" />
                    <path d="M60 32 C50 23 68 18 60 8" />
                    <path d="M80 37 C70 28 88 23 80 13" />
                </g>

                {/* Pot handles */}
                <path d="M27 55 H16 Q10 55 10 63
                 Q10 72 22 72 H29"
                      fill="#D97745" />
                <path d="M93 55 H104 Q110 55 110 63
                 Q110 72 98 72 H91"
                      fill="#D97745" />

                {/* Pot body */}
                <path d="M28 48 H92 L86 88
                 Q60 101 34 88 Z"
                      fill="#E98550" />

                {/* Rim */}
                <rect x="24" y="43" width="72" height="10"
                      rx="5" fill="#B95732" />

                {/* Bubbling soup */}
                <ellipse cx="60" cy="48" rx="30" ry="5"
                         fill="#FFD29D" />
                <g className="bubbles" fill="#D97745">
                    <circle cx="45" cy="46" r="2.5" />
                    <circle cx="61" cy="49" r="2" />
                    <circle cx="75" cy="45" r="3" />
                </g>

                {/* Base */}
                <path d="M38 94 Q60 101 82 94"
                      stroke="#B95732" strokeWidth="5"
                      strokeLinecap="round" />
            </svg>

            <p className="loading-text">
                {text}
            </p>
        </div>
    );
}

export default CookingSpinner;