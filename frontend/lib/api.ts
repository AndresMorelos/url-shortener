import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  withCredentials: true,
})

// Optional: Add interceptors for auth, error handling, etc.
// api.interceptors.request.use(config => {
//   // Attach token if needed
//   return config
// })

export default api 