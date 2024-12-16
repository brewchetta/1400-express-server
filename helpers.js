export function toTitleCase(str) {
    return str.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

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

export function checkExistence(item, res, next) {
    try {
        if (!item) {
        throw Error('Not found')
        }
        return true
    } catch (err) {
        res.status(404)
        next(err)
    }
}