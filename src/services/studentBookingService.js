import api from './api'

export const studentBookingService = {
  checkout: async (payload) => {
    const response = await api.post('/student/bookings/checkout', payload)
    return response.data
  },
}

export default studentBookingService

