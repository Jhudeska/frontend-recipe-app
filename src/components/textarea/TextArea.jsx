import "./TextArea.css"

function TextArea({
                      label,
                      className,
                      name,
                      placeholder,
                      value,
                      onChange
                  }){

    return (
        <>
                <label htmlFor={name}>
                    {label}
                </label>

                <textarea
                    id={name}
                    className={className}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
        </>

    )
}

export default TextArea;