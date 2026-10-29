import {useState} from "react";

function TextArea(){
    const [message, setMessage] = useState("");
    return (
        <textarea
            className="message-textarea field"
            name="message"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-label="Message"
            required
        />
    )
}

export default TextArea;