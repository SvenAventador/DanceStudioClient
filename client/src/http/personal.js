import {$authHost} from "./index.js"
import {jwtDecode} from "jwt-decode"

export const getCurrentClass = async (userId) => {
    const {data} = await $authHost.get('/personal/classes', {
        params: {userId}
    })
    return data
}

export const getCurrentSubscription = async (userId) => {
    const {data} = await $authHost.get('/personal/subscription', {
        params: {userId}
    })
    return data
}

export const editData = async (edit) => {
    const {data} = await $authHost.put('/personal', edit)
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const deleteCurrentClass = async (id) => {
    return await $authHost.delete(`/personal/current/${id}`)
}