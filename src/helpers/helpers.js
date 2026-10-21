const longOptions = {
    weekday : 'long',
    year : 'numeric',
    month : 'long',
    day : 'numeric',
};

export function convertTimeStampToDate(timeStamp) {
    return timeStamp.toLocaleDateString('nl-NL', {longOptions});
}