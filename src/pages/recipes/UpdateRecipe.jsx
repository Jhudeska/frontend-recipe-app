import {useRef, useState} from "react";
import "./UpdateRecipe.css";
import Button from "../../components/button/Button.jsx";

function UpdateRecipe() {
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        image: "",
        preparation_time: "",
        ingredients: "",
        difficulty: "",
        instructions: "",
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


    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <section className="outer-container page-container">
            <div className="inner-container">
                <h1>Update Recipe</h1>

                <form className="form-narrow" onSubmit={handleSubmit}>
                    <input
                        className="field"
                        name="title"
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="field"
                        name="category"
                        type="category"
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />

                    <div className="image-upload">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            name="image"
                            placeholder="Image"
                            onChange={handleImageChange}
                            hidden
                        />

                        <button
                            type="button"
                            className="upload-button"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Upload image
                        </button>
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="image-preview"
                            />
                        )}
                    </div>

                    <input
                        className="field"
                        name="ingredients"
                        type="text"
                        placeholder="Ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                    />
                    <input
                        className="field"
                        name="preparation_time"
                        type="text"
                        placeholder="Preparation time"
                        value={formData.preparation_time}
                        onChange={handleChange}
                    />
                    <input
                        className="field"
                        name="difficulty"
                        type="text"
                        placeholder="Difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                    />
                    <textarea
                        className="field"
                        name="instructions"
                        placeholder="Instrunctions"
                        value={formData.instructions}
                        onChange={handleChange}
                        required
                    />
                    <div className="navigate-buttons">
                        <Button  text="Cancel" buttonType="submit" btnColor="green-filled"></Button>
                        <Button text="Save" buttonType="submit" btnColor="green-filled"></Button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default UpdateRecipe;
