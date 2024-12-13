export function titleCase (str) {
    return str.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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