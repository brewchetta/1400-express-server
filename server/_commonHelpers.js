/* i am not title cased --> I Am Not Title Cased */
export function toTitleCase(str) {
    return str.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/* i am not camel cased --> iAmNotCamelCased */
export function toCamelCase(str) {
    const words = str.split(' ')
    for (let i = 0; i < words.length; i++) {
        if (i == 0) {
            words[i] = words[i].toLowerCase()
        } else {
            words[i] = toTitleCase(words[i])
        }
    }
    return words.join('')
}