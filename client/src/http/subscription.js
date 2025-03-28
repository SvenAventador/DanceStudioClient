import {
    $authHost,
    $host
} from "./index.js"

export const getOne = async (id) => {
    const {data} = await $host.get(`subscription/${id}`)
    return data
}

export const getAll = async () => {
    const {data} = await $host.get('subscription')
    return data
}

export const create = async (subscription) => {
    const {data} = await $authHost.post('subscription', subscription)
    return data
}

export const edit = async (subscription) => {
    const {data} = await $authHost.put(`subscription`, subscription)
    return data
}

export const deleteOne = async (id) => {
    const {data} = await $authHost.delete(`subscription/${id}`)
    return data
}

export const deleteAll = async () => {
    const {data} = await $authHost.delete(`subscription`)
    return data
}

export const buy = async (buy) => {
    const {data} = await $authHost.post('subscription/buy', buy)
    return data
}