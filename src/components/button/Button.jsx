import "./Button.css"

function Button({text, buttonType = "button", handleClick, btnColor}) {

    if(btnColor === "green-filled"){
        btnColor = "green-filled";
    }else if(btnColor === "green-outline"){
        btnColor = "green-outline";
    }else {
        btnColor = "gray-outline";
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