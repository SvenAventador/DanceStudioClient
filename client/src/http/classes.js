import {
    $authHost,
    $host
} from "./index"

export const getCurrentTrainer = async (userId) => {
    const {data} = await $authHost.get('classes/trainer/current/?userId=' + userId)
    return data
}

export const getOne = async (id) => {
    const {data} = await $host.get(`classes/${id}`)
    return data
}

export const getAll = async (params = {}) => {
    const {data} = await $host.get('classes', {
        params: {
            level: params.level || undefined,
            trainerId: params.trainerId || undefined,
            specializationId: params.specializationId || undefined
        }
    })
    return data
}

export const create = async (classes) => {
    const {data} = await $authHost.post(`classes`, classes)
    return data
}

export const edit = async (classes) => {
    const {data} = await $authHost.put(`classes`, classes)
    return data
}

export const deleteOne = async (id) => {
    const {data} = await $authHost.delete(`classes/${id}`)
    return data
}

export const deleteAll = async () => {
    const {data} = await $authHost.delete(`classes`)
    return data
}