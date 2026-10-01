import { useState } from "react";
import "./Contact.css";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        description: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formData);
        // Send formData to your backend here
    };

    return (
        <section className="outer-container page-container">
            <div className="inner-container">
                <h1>Contact</h1>

                <form className="form-narrow" onSubmit={handleSubmit}>
                    <input
                        className="field"
                        name="name"
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="field"
                        name="email"
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="field"
                        name="description"
                        type="text"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <textarea
                        className="field"
                        name="message"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />

                    <div>
                        <button type="submit">Send</button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Contact;
