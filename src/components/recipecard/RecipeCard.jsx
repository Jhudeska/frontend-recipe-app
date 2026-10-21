import './RecipeCard.css'
import {useEffect, useState} from "react";

function RecipeCard({
                        recipeId,
                        imageUrl,
                        fallbackImage,
                        title ,
                        servings,
                        preparationTime,
                        ratingSore,
                        isFavorite = false,
                        onToggleFavorite
                        }) {

    const [image, setImage] = useState(imageUrl || fallbackImage);
    const [usingFallback, setUsingFallback] = useState(!imageUrl);

    // Reset the image when the recipe or its images change
    useEffect(() => {
        setImage(imageUrl || fallbackImage);
        setUsingFallback(!imageUrl);
    }, [imageUrl, fallbackImage]);

    function handleImageError() {
        if (!usingFallback && fallbackImage) {
            // Backend URL failed: try the local asset
            setImage(fallbackImage);
            setUsingFallback(true);
        } else {
            // Both images failed
            setImage(null);
        }
    }


    const score = Math.max(
        0,
        Math.min(5, Math.round(Number(ratingSore) || 0))
    );

    return (

        <div className="rcard">
            {image ? (
            <img src={image} alt={title}  onError={handleImageError} />
            ) : (
                <div className="rcard__image-placeholder">
                    <p>Geen image beschikbaar</p>
                    {/*{imageUrl && <img src={imageUrl} alt={name} />}*/}
                </div>
            )}

            <div className="body">
                <div className="title">{title}</div>

                <div className="sub">
                    {servings != null && `${servings} p.p.`} &middot; {servings != null && preparationTime != null && ' · '}
                    {preparationTime != null &&
                        `${preparationTime} min`}
                </div>

                <div className="foot">
                    <span className="stars" aria-label={`Rating: ${score} van 5`}>
                        {Array.from({ length: 5 }, (_, index) =>
                            index < score ? '\u2605' : '\u2606'
                        )}
                    </span>


                    <button
                        type="button"
                        className={`heart ${isFavorite ? "heart--active" : ""}`}
                        onClick={() => onToggleFavorite?.(recipeId)}
                        aria-label={
                            isFavorite
                                ? `${title} verwijderen uit favorieten`
                                : `${title} toevoegen aan favorieten`
                        }
                        aria-pressed={isFavorite}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M12 21s-7-4.4-9.3-8.1C.7 9.8 1.9 6 5.4 5c2-.6 3.9.3 5.1 1.9C11.6 5.3 13.5 4.4 15.5 5c3.5 1 4.7 4.8 2.6 7.9C19 16.6 12 21 12 21z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RecipeCard;