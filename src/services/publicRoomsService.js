import api from './api'

export const publicRoomsService = {
  getByCategory: async (category) => {
    const response = await api.get('/public/rooms', {
      params: category ? { category } : undefined,
    })
    return response.data
  },

  getById: async (roomId) => {
    const response = await api.get(`/public/rooms/${encodeURIComponent(roomId)}`)
    return response.data
  },

  bookRoom: async (roomId) => {
    const response = await api.post(`/public/rooms/${encodeURIComponent(roomId)}/book`)
    return response.data
  },
}

export default publicRoomsService
