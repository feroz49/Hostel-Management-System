const BOOKING_INTENT_STORAGE_KEY = 'pendingRoomBookingIntent'
const BOOKING_INTENT_TTL_MS = 6 * 60 * 60 * 1000

const toPositiveInt = (value) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

export const buildStudentPaymentPath = (roomId) => {
  const parsedRoomId = toPositiveInt(roomId)
  return parsedRoomId ? `/student/payment?roomId=${parsedRoomId}` : '/student/payment'
}

export const saveBookingIntent = (intent = {}) => {
  const roomId = toPositiveInt(intent.roomId)

  if (!roomId || typeof window === 'undefined') {
    return
  }

  const payload = {
    roomId,
    roomTitle: intent.roomTitle || null,
    priceRange: intent.priceRange || null,
    createdAt: Date.now(),
  }

  window.localStorage.setItem(BOOKING_INTENT_STORAGE_KEY, JSON.stringify(payload))
}

export const getBookingIntent = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(BOOKING_INTENT_STORAGE_KEY)
  if (!rawValue) {
    return null
  }

  try {
    const parsed = JSON.parse(rawValue)
    const roomId = toPositiveInt(parsed?.roomId)
    const createdAt = Number(parsed?.createdAt)

    if (!roomId || !Number.isFinite(createdAt)) {
      window.localStorage.removeItem(BOOKING_INTENT_STORAGE_KEY)
      return null
    }

    if (Date.now() - createdAt > BOOKING_INTENT_TTL_MS) {
      window.localStorage.removeItem(BOOKING_INTENT_STORAGE_KEY)
      return null
    }

    return {
      roomId,
      roomTitle: parsed?.roomTitle || null,
      priceRange: parsed?.priceRange || null,
      createdAt,
    }
  } catch (error) {
    window.localStorage.removeItem(BOOKING_INTENT_STORAGE_KEY)
    return null
  }
}

export const clearBookingIntent = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(BOOKING_INTENT_STORAGE_KEY)
}

