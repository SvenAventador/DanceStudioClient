import {
    $authHost,
    $host
} from "./index"

export const getOne = async (id) => {
    const {data} = await $host.get(`specialization/${id}`)
    return data
}

export const getAll = async () => {
    const {data} = await $host.get('specialization')
    return data
}

export const create = async (name) => {
    const {data} = await $authHost.post('specialization', {name})
    return data
}

export const edit = async (id, name) => {
    const {data} = await $authHost.put(`specialization`, {id, name})
    return data
}

export const deleteOne = async (id) => {
    const {data} = await $authHost.delete(`specialization/${id}`)
    return data
}

export const deleteAll = async () => {
    const {data} = await $authHost.delete(`specialization`)
    return data
}