import {
    $authHost,
    $host
} from "./index";
import {jwtDecode} from "jwt-decode";

export const registration = async (user) => {
    const {data} = await $host.post('auth/registration', user)
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const login = async (user) => {
    const {data} = await $host.post('auth/login', user)
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const auth = async () => {
    const {data} = await $authHost.get('auth/check')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const logout = async () => {
    const {data} = await $authHost.get('auth/logout')
    localStorage.removeItem('token')
    return data
}

export const getVerifyCode = async (email) => {
    const {data} = await $host.post('auth/forgot', {email})
    return data
}

export const changePassword = async (email, password) => {
    const {data} = await $host.put('auth/', {email, password})
    return data
}