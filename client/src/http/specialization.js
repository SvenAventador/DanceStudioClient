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

export const create = async (specialization) => {
    const {data} = await $authHost.post('specialization', specialization)
    return data
}

export const edit = async (specialization) => {
    console.log(specialization)
    const {data} = await $authHost.put(`specialization`, specialization)
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