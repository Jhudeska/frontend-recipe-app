import "./MessageLabel.css";
import {VARIANTS} from "../../constants/constants.jsx";

function MessageLabel({
                          children,
                          variant = "error",
                          className = "",
                          ...rest
                      }) {
    if (
        children === null ||
        children === undefined ||
        children === ""
    ) {
        return null;
    }

    const variantClass = VARIANTS[variant] ?? VARIANTS.error;

    return (
        <p
            role={variant === "error" ? "alert" : "status"}
            className={`message-label ${variantClass} ${className}`.trim()}
            {...rest}
        >
            {children}
        </p>
    );
}

export default MessageLabel;
