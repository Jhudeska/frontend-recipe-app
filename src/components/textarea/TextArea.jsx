import {useState} from "react";

function TextArea(){
    const [message, setMessage] = useState("");
    return (
        <textarea
            className="message-input"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-label="Message"
        />
    )
}

export default TextArea;