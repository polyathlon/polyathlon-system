import {HOST} from "./polyathlon-system-config.mjs";

export default async function refreshToken(token) {
    const response = await fetch(`https://${HOST}:4500/api/refresh-token`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: "include",
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.error)
    }

    const newToken = result.token
    saveToken(newToken)
    return newToken
}

export function  getToken() {
    return localStorage.getItem('rememberMe') ? localStorage.getItem('accessUserToken') : sessionStorage.getItem('accessUserToken')
}

export function saveToken(token) {
    if (localStorage.getItem('rememberMe')) {
        localStorage.setItem('accessUserToken', token)
    }
    else {
        sessionStorage.setItem('accessUserToken', token)
    }
    return token;
}