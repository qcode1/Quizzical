

/**
   * We loop through the array, and for each element, we generate a random number, and swap the current
   * element with the element at the random index
   * @param array - The array to shuffle
   * @returns The array is being returned with the values shuffled.
   */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {

        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));

        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

/**
 * It replaces all instances of the following strings with the corresponding string
 * @param text - The text to be cleaned
 * @returns the text that is passed in, but with all the characters that are in the parentheses
 * replaced with the character that is in the quotes.
 */
function cleanText(text) {
    return text
        .replaceAll(/(#039\;)/g, "\"")
        // .replace(/#039;/g, "'")
        .replaceAll(/&#039;/g, "'")
        .replaceAll(/(&quot\;)/g, '"')
        .replaceAll(/(&#quot\;)/g, '"')
        .replaceAll(/(&')/g, "\"")
        .replaceAll("/quot;/g", '"')
        .replace('&"', "'")
        .replace("&'", "'")
}

export {shuffleArray, cleanText}