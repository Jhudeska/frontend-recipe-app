import "./Button.css"

function Button({text, buttonType = "button", handleClick, btnColor}) {

    if(btnColor === "transparent"){
        btnColor = "transparent";
    }else if(btnColor === "green"){
        btnColor = "green";
    }

    return (
        <button
            className={`${btnColor}`}
            onClick={handleClick}
            type={buttonType}
        >
            {text}
        </button>
    )
}

export default Button;