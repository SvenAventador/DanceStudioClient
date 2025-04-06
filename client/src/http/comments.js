import {$host} from "./index.js"

export const getAllComments = async (id) => {
    const {data} = await $host.get(`/comments/${id}`)
    return data
}

export const createComment = async (comment) => {
    const {data} = await $host.post(`/comments`, comment)
    return data
}