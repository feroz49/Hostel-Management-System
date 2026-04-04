import api from './api'

export const studentPortalService = {
  getDashboard: async () => {
    const response = await api.get('/student/dashboard')
    return response.data
  },
}

export default studentPortalService
