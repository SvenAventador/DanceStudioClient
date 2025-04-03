import {
    $authHost,
    $host
} from "./index"

export const getOne = async (id) => {
    const {data} = await $host.get(`schedule/${id}`)
    return data
}

export const getAll = async () => {
    const {data} = await $host.get('schedule')
    return data
}

export const create = async (schedule) => {
    const {data} = await $authHost.post(`schedule`, schedule)
    return data
}

export const signUp = async (signUpData) => {
    const {data} = await $authHost.post(`schedule/sign-up`, signUpData)
    return data
}

export const edit = async (schedule) => {
    const {data} = await $authHost.put(`schedule`, schedule)
    return data
}

export const deleteOne = async (id) => {
    const {data} = await $authHost.delete(`schedule/${id}`)
    return data
}

export const deleteAll = async () => {
    const {data} = await $authHost.delete(`schedule`)
    return data
}