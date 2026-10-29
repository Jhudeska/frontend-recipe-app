import "./Form.css"

function Form({button, children, onChange}) {
    return (
        <>
            <form onChange={onChange}>
                {children}
                {button}
            </form>
        </>
    )
}

export default Form;