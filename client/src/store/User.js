import {create} from 'zustand';
import {
    auth,
    login,
    logout,
    registration
} from '../http/auth';

export const useUser = create((set) => ({
    user: null,
    isAuth: false,
    error: null,
    message: null,

    registrationUser: async (user) => {
        try {
            const data = await registration(user)

            set({
                user: data,
                isAuth: true,
                error: null,
                message: null
            })

            return data
        } catch (error) {
            set({
                user: null,
                isAuth: false,
                error,
                message: error.response.data.message
            })

            throw error
        }
    },

    loginUser: async (user) => {
        try {
            const data = await login(user)

            set({
                user: data,
                isAuth: true,
                error: null,
                message: null
            })

            return data
        } catch (error) {
            set({
                user: null,
                isAuth: false,
                error,
                message: error.response.data.message
            })

            throw error
        }
    },

    checkUser: async () => {
        try {
            const data = await auth()

            set({
                user: data,
                isAuth: true,
                error: null,
                message: null
            })

            return data;
        } catch (error) {
            set({
                user: null,
                isAuth: false,
                error,
                message: error.response.data.message
            })
        }
    },

    logoutUser: async () => {
        try {
            set({
                user: null,
                isAuth: false,
                error: null,
                message: null
            })

            return await logout()
        } catch (error) {
            set({
                user: null,
                isAuth: false,
                error,
                message: error.response.data.message
            })
        }
    }
}))