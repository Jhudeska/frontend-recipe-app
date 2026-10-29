import "./Button.css"

function Button({text: label, buttonType: type = "button", handleClick: onClick, btnColor: btnVariant}) {

    if(btnVariant === "green-filled"){
        btnVariant = "green-filled";
    }else if(btnVariant === "green-outline"){
        btnVariant = "green-outline";
    }else {
        btnVariant = "gray-outline";
    }

    return (
        <button
            className={`${btnVariant}`}
            onClick={onClick}
            type={type}
        >
            {label}
        </button>
    );
}

export default Button;