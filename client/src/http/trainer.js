import {
    $authHost, $host
} from "./index.js"

export const getOne = async (id) => {
    const {data} = await $host.get(`trainer/${id}`)
    return data
}

export const getAll = async () => {
    const {data} = await $host.get('trainer')
    return data
}

export const create = async (trainer) => {
    const {data} = await $authHost.post('trainer', trainer)
    return data
}

export const edit = async (trainer) => {
    const {data} = await $authHost.put(`trainer`, trainer)
    return data
}

export const deleteOne = async (id) => {
    const {data} = await $authHost.delete(`trainer/${id}`)
    return data
}
export const deleteAll = async () => {
    const {data} = await $authHost.delete(`trainer`)
    return data
}