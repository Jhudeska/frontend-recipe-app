import { useState } from "react";
import "./Contact.css"
import TextArea from "../../components/textarea/TextArea.jsx";

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

        const receiver = "jvsignacia@live.nl";

        const subject = encodeURIComponent(formData.description);
        const message = encodeURIComponent(
            `Naam: ${formData.name}\n` +
            `E-mailadres: ${formData.email}\n\n` +
            `${formData.message}`
        );

        const mailtoUrl =
            `mailto:${receiver}?subject=${subject}&body=${message}`;

        window.open(mailtoUrl, "_blank");
    };

    return (
        <section className="outer-container page-container">
            <div className="inner-container">
                <h1>Contact</h1>
                <p>Heb je een vraag over een recept? Stuur ons een bericht!</p>

                <form className="form-narrow" onSubmit={handleSubmit}>
                    <label htmlFor="name">Name*</label>
                    <input
                        className="field"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="email">Email*</label>
                    <input
                        className="field"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="description">Description* </label>
                    <input
                        className="field"
                        id="description"
                        name="description"
                        type="text"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    <TextArea
                        label="Message*"
                        className="field"
                        id="message"
                        name="message"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />

                        <button type="submit" className="green-filled">Send</button>

                </form>
            </div>
        </section>
    );
}

export default Contact;
