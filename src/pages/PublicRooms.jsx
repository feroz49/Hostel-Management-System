import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BedDouble, Building2, ShieldCheck, Sparkles, Users } from 'lucide-react'
import AnimatedBackdrop from '../components/layout/AnimatedBackdrop'
import PublicNavbar from '../components/layout/PublicNavbar'
import Footer from '../components/layout/Footer'
import { getApiErrorMessage } from '../services/api'
import publicRoomsService from '../services/publicRoomsService'
import { handleRoomImageError } from '../utils/roomImageFallback'

const roomTypes = [
  {
    name: 'Single Room',
    subtitle: 'Quiet private living',
    description: 'A focused setup for students who want privacy, calm study time, and simple day-to-day comfort.',
    capacity: '1 Student',
    highlight: 'Best for quiet study',
    accent: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/20',
    icon: BedDouble,
  },
  {
    name: 'Double Room',
    subtitle: 'Balanced shared space',
    description: 'A practical option for students who want shared living with enough space for daily routines.',
    capacity: '2 Students',
    highlight: 'Popular shared option',
    accent: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    icon: Users,
  },
  {
    name: 'Triple Room',
    subtitle: 'Community-friendly stay',
    description: 'A more social room arrangement designed for students who prefer an active shared environment.',
    capacity: '3 Students',
    highlight: 'Good for groups',
    accent: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/20',
    icon: Building2,
  },
]

const features = [
  'Live room availability can be managed from the admin dashboard',
  'Student room assignments stay connected to hostel records',
  'Blocks, occupancy, and room details can be updated by admins',
]

const defaultCategories = [
  { value: 'single', label: 'Single Room' },
  { value: 'double', label: 'Double Room' },
  { value: 'triple', label: 'Triple Room' },
  { value: 'shared', label: 'Shared Room' },
]

const PublicRooms = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('single')
  const [roomCategories, setRoomCategories] = useState(defaultCategories)
  const [rooms, setRooms] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [roomsError, setRoomsError] = useState('')

  useEffect(() => {
    let active = true

    const fetchRooms = async () => {
      setLoadingRooms(true)
      setRoomsError('')

      try {
        const response = await publicRoomsService.getByCategory(selectedCategory)

        if (!active) {
          return
        }

        if (Array.isArray(response.categories) && response.categories.length > 0) {
          setRoomCategories(response.categories)
        }

        setRooms(Array.isArray(response.rooms) ? response.rooms : [])
      } catch (error) {
        if (!active) {
          return
        }

        setRooms([])
        setRoomsError(getApiErrorMessage(error, 'Unable to load room options right now.'))
      } finally {
        if (active) {
          setLoadingRooms(false)
        }
      }
    }

    fetchRooms()

    return () => {
      active = false
    }
  }, [selectedCategory])

  const selectedCategoryLabel =
    roomCategories.find((category) => category.value === selectedCategory)?.label || 'Single Room'

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <AnimatedBackdrop variant="public" />

      <div className="relative z-10">
        <PublicNavbar />

        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-700 dark:text-cyan-200">
                <Sparkles className="h-4 w-4" />
                Public Rooms Page
              </div>

              <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Explore the main room options available in HostelMS.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                This page gives visitors a simple overview of the main room categories. Admins can manage the
                actual room data inside the dashboard, while this public page helps users understand the available
                accommodation styles before signing in.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Register Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-6 py-3 text-base font-semibold text-slate-800 transition hover:border-cyan-400/50 hover:bg-white/70 dark:border-white/15 dark:text-white dark:hover:bg-white/5"
                >
                  Contact Hostel Team
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-2xl shadow-cyan-100/60 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/20">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-6 dark:border-white/10 dark:bg-slate-900/80">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Room Highlights</p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Why it works</h3>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {features.map((feature) => (
                    <div key={feature} className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/70">
                      <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-20 grid gap-6 md:grid-cols-3">
            {roomTypes.map(({ name, subtitle, description, capacity, highlight, accent, icon: Icon }) => (
              <article
                key={name}
                className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-slate-950/20"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${accent}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-5 text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">{subtitle}</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{name}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>

                <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-100/90 px-4 py-3 dark:border-white/10 dark:bg-slate-950/70">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{capacity}</span>
                  <span className="text-xs uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">{highlight}</span>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-20">
            <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-300">Room Gallery</p>
                <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Browse room cards by category.
                </h3>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                Choose a category and the cards are now fetched live from backend with real availability status.
              </p>
            </div>

            <div className="mb-8 max-w-sm">
              <label htmlFor="room-category" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Room Category
              </label>
              <select
                id="room-category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="mt-2 w-full rounded-xl border border-cyan-500/30 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/30"
              >
                {roomCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white">{selectedCategoryLabel} Options</h4>
            </div>

            {loadingRooms && (
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-8 text-center text-sm text-slate-300">
                Loading room cards...
              </div>
            )}

            {!loadingRooms && roomsError && (
              <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-sm text-red-300">
                {roomsError}
              </div>
            )}

            {!loadingRooms && !roomsError && rooms.length === 0 && (
              <div className="rounded-2xl border border-slate-300/20 bg-slate-900/60 p-6 text-sm text-slate-300">
                No rooms found for this category right now.
              </div>
            )}

            {!loadingRooms && !roomsError && rooms.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {rooms.map((room) => {
                  const isAvailable = Boolean(room.is_available)
                  const availabilityLabel = room.availability_status || (isAvailable ? 'Available' : 'Unavailable')

                  return (
                    <article
                      key={room.id}
                      className="group overflow-hidden rounded-[1.6rem] border border-cyan-500/20 bg-slate-900/85 shadow-xl shadow-slate-950/40 backdrop-blur"
                    >
                      <button
                        type="button"
                        onClick={() => navigate(`/rooms/${room.id}`)}
                        className="block w-full text-left"
                      >
                        <div className="overflow-hidden rounded-t-[1.6rem]">
                          <img
                            src={room.image}
                            alt={room.title}
                            loading="lazy"
                            onError={handleRoomImageError}
                            className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-xl font-semibold text-white">{room.title}</h4>
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
                          <p className="mt-2 text-sm text-slate-300">{room.capacity}</p>
                          <p className="mt-3 text-base font-semibold text-cyan-300">{room.price_range}</p>
                          <p className="mt-3 text-sm leading-7 text-slate-400">{room.description}</p>
                          <p className="mt-4 text-sm font-medium text-cyan-300">Click to view details</p>
                        </div>
                      </button>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </main>

        <Footer variant="public" />
      </div>
    </div>
  )
}

export default PublicRooms
