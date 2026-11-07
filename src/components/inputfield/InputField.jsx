import "./InputField.css"

function InputField({label, placeholder, type = "text", name, value , onChange, inputColor , disabled = false}) {


    if(inputColor === "transparent"){
        inputColor = "transparent";
    }else if(inputColor === "green"){
        inputColor = "green";
    }

    return (
        <>
            {label && (
                <label htmlFor={name}>
                    {label}
                </label>
            )}

            <input
                id={name}
                name={name}
                className={inputColor}
                type={type}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
            />

        </>
    )
}

export default InputField;