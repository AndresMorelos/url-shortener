import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import api from '@/lib/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'

interface User {
    id: number
    createdAt: string
    updatedAt: string
    deleted: boolean
    deletedAt: string | null
    name?: string | null
    username: string
}

interface Url {
    id: number
    url: string
    urlCode: string
    visitCount: number
    shortUrl?: string
    deleted: boolean
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}

interface ApiState {
    user: User | null
    urls: Url[]
    access_token: string | null
    loading: boolean
    loadingUrls: boolean
    error: string | null
}

interface ApiActions {
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    signUp: (user: { name?: string, username: string, password: string }) => Promise<void>
    fetchUser: () => Promise<void>
    fetchUrls: () => Promise<void>
    createUrl: (url: string) => Promise<string | undefined>
    deleteUrl: (id: number) => Promise<void>
}

const initialState: ApiState = {
    user: null,
    urls: [],
    access_token: null,
    loading: false,
    loadingUrls: false,
    error: null,
}

export const useApiStore = create<ApiState & ApiActions>()(persist((set, get) => ({
    ...initialState,
    login: async (username, password) => {
        set({ loading: true, error: null })
        try {
            const response = await api.post('/v1/auth/login', { username, password })
            set({ access_token: response.data.access_token })
            await get().fetchUser()
            await get().fetchUrls()
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Login failed' })
        } finally {
            set({ loading: false })
        }
    },

    logout: () => {
        set(initialState)
    },

    signUp: async ({ name, username, password }) => {
        set({ loading: true, error: null })
        try {
            const response = await api.post('/v1/auth/signUp', { name, username, password })
            set({ access_token: response.data.access_token })
            await get().fetchUser()
            await get().fetchUrls()
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Sign up failed' })
        } finally {
            set({ loading: false })
        }
    },

    fetchUser: async () => {
        set({ loading: true, error: null })
        try {
            const { data } = await api.get<User>('/v1/users', { headers: { Authorization: `Bearer ${get().access_token}` } })
            set({ user: data })
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Fetch user failed' })
        } finally {
            set({ loading: false })
        }
    },

    fetchUrls: async () => {
        set({ loadingUrls: true, error: null })
        try {
            const { data } = await api.get<Url[]>('/v1/urls', { headers: { Authorization: `Bearer ${get().access_token}` } })

            set({
                urls: data.map((url) => {
                    return { ...url, shortUrl: `${API_BASE_URL}/${url.urlCode}` }
                })
            })
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Fetch URLs failed' })
        } finally {
            set({ loadingUrls: false })
        }
    },

    createUrl: async (url): Promise<string | undefined> => {
        set({ loadingUrls: true, error: null })
        try {
            const { data } = await api.post('/v1/urls', { url }, { headers: { Authorization: `Bearer ${get().access_token}` } })
            await get().fetchUrls()
            return `${API_BASE_URL}/${data.urlCode}`
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Create URL failed' })
        } finally {
            set({ loadingUrls: false })
        }
    },

    deleteUrl: async (id) => {
        set({ loading: true, error: null })
        try {
            await api.delete(`/v1/urls/${id}`, { headers: { Authorization: `Bearer ${get().access_token}` } })
            await get().fetchUrls()
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Delete URL failed' })
        } finally {
            set({ loading: false })
        }
    },
}), {
    name: 'short-url',
    storage: createJSONStorage(() => sessionStorage),
})) 