import "./InputField.css"

function InputField({label, placeholder, type , onChange, inputColor}) {

    if(inputColor === "transparent"){
        inputColor = "transparent";
    }else if(inputColor === "green"){
        inputColor = "green";
    }

    return (
        <>
            <label>{label}</label>
            <input
                className={inputColor}
                type={type}
                onChange={onChange}
                placeholder={placeholder}
            />

        </>
    )
}

export default InputField;