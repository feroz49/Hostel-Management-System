import api from './api'
import { mockStudents } from '../utils/mockData'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// For demo purposes, using mock data
// Replace with actual API calls in production
export const studentService = {
  getAll: async () => {
    await delay(500)
    return { data: mockStudents }
  },

  getById: async (id) => {
    await delay(300)
    const student = mockStudents.find(s => s.id === id)
    return { data: student }
  },

  create: async (data) => {
    await delay(500)
    const newStudent = {
      ...data,
      id: mockStudents.length + 1,
      student_id: `STU${String(mockStudents.length + 1).padStart(3, '0')}`
    }
    return { data: newStudent }
  },

  update: async (id, data) => {
    await delay(500)
    const index = mockStudents.findIndex(s => s.id === id)
    if (index !== -1) {
      return { data: { ...mockStudents[index], ...data } }
    }
    throw new Error('Student not found')
  },

  delete: async (id) => {
    await delay(500)
    return { data: { success: true } }
  }
}

export default studentService

