import "./MessageLabel.css";

const VARIANTS = {
    error: "message-label--error",
    success: "message-label--success",
    info: "message-label--info",
};

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
