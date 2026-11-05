import {API_BASE_URL, longOptions} from "../constants/constants.jsx"

export function convertTimeStampToDate(timeStamp) {
    return new Date(timeStamp).toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function getImageUrl(imageUrl) {

    if (!imageUrl) {
        return null;
    }

    // Controleer of de URL al volledig is
    if (imageUrl.startsWith("http")) {
        return imageUrl;
    }

    // Voeg backend URL en afbeeldingspad samen
    return `${API_BASE_URL}/${imageUrl.replace(/^\/+/, "")}`;
}