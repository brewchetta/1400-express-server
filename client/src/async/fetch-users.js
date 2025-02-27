const router = '/api/users'

const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }


export async function getCurrentUser() {
    return await fetch(`${router}/current`)
}

export async function postUserLogin(body) {
    return await fetch(`${router}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
    })
}

export async function postUserCreate(body) {
    await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
    })
}

export async function deleteUserLogout() {
    return await fetch(`${router}/logout`, { method: 'DELETE' })
}