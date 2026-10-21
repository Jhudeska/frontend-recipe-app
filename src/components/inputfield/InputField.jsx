import "./InputField.css"

function InputField({label, type , onChange, inputColor}) {

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
            />

        </>
    )
}

export default InputField;