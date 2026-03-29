import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, BadgeCheck, BedDouble, CalendarClock } from 'lucide-react'
import toast from 'react-hot-toast'
import AnimatedBackdrop from '../components/layout/AnimatedBackdrop'
import PublicNavbar from '../components/layout/PublicNavbar'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'
import { useAuth } from '../auth/AuthContext'
import { getApiErrorMessage } from '../services/api'
import publicRoomsService from '../services/publicRoomsService'
import { handleRoomImageError } from '../utils/roomImageFallback'

const categoryLabels = {
  single: 'Single Room',
  double: 'Double Room',
  triple: 'Triple Room',
  shared: 'Shared Room',
}

const PublicRoomDetails = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    let active = true

    const fetchRoom = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await publicRoomsService.getById(roomId)
        if (active) {
          setRoom(response)
        }
      } catch (err) {
        if (active) {
          setRoom(null)
          setError(getApiErrorMessage(err, 'Unable to load room details right now.'))
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchRoom()

    return () => {
      active = false
    }
  }, [roomId])

  const handleBook = async () => {
    if (!room) {
      return
    }

    if (!room.is_available) {
      toast.error('This room is currently unavailable.')
      return
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }

    setBooking(true)
    try {
      const response = await publicRoomsService.bookRoom(room.id)
      toast.success(response.message || 'Booking request sent successfully.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to submit booking request.'))
    } finally {
      setBooking(false)
    }
  }

  const isAvailable = Boolean(room?.is_available)
  const availabilityLabel = room?.availability_status || (isAvailable ? 'Available' : 'Unavailable')
  const categoryLabel = categoryLabels[room?.category] || room?.category || 'Room'

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <AnimatedBackdrop variant="public" />

      <div className="relative z-10">
        <PublicNavbar />

        <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-6">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-400/40 hover:text-cyan-700 dark:border-white/15 dark:bg-slate-900/80 dark:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to room categories
            </Link>
          </div>

          {loading && (
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-8 text-center text-sm text-slate-300">
              Loading room details...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-6 text-sm text-rose-300">
              {error}
            </div>
          )}

          {!loading && !error && room && (
            <section className="overflow-hidden rounded-[1.8rem] border border-cyan-500/20 bg-slate-900/85 shadow-2xl shadow-slate-950/40">
              <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                <div className="h-full">
                  <img
                    src={room.image}
                    alt={room.title}
                    onError={handleRoomImageError}
                    className="h-full min-h-[320px] w-full object-cover"
                  />
                </div>

                <div className="p-8 sm:p-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                      <BedDouble className="h-3.5 w-3.5" />
                      {categoryLabel}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        isAvailable
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                      }`}
                    >
                      {availabilityLabel}
                    </span>
                  </div>

                  <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">{room.title}</h1>
                  <p className="mt-3 text-sm text-slate-300">{room.capacity}</p>
                  <p className="mt-4 text-xl font-semibold text-cyan-300">{room.price_range}</p>
                  <p className="mt-5 text-sm leading-7 text-slate-300">{room.description}</p>

                  <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <CalendarClock className="h-4 w-4 text-cyan-300" />
                      Monthly billing cycle
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      {isAvailable ? (
                        <>
                          <BadgeCheck className="h-4 w-4 text-emerald-300" />
                          Ready for booking requests
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4 text-rose-300" />
                          Currently not accepting new bookings
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      type="button"
                      onClick={handleBook}
                      loading={booking}
                      disabled={!isAvailable}
                      size="lg"
                      className="w-full"
                    >
                      {isAvailable ? 'Book This Room' : 'Unavailable for Booking'}
                    </Button>
                    {!isAuthenticated && isAvailable && (
                      <p className="mt-3 text-xs text-slate-400">
                        You will be redirected to login if you try to book without signing in.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer variant="public" />
      </div>
    </div>
  )
}

export default PublicRoomDetails
