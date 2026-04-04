import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, GraduationCap, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../auth/AuthContext'
import { getApiErrorMessage } from '../services/api'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import AnimatedBackdrop from '../components/layout/AnimatedBackdrop'

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    guardianContact: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.name.trim()) nextErrors.name = 'Name is required'
    if (!formData.email) nextErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = 'Please enter a valid email'

    if (formData.phoneNumber && !/^\+?[\d\s()-]{7,20}$/.test(formData.phoneNumber)) {
      nextErrors.phoneNumber = 'Please enter a valid phone number'
    }

    if (!formData.password) nextErrors.password = 'Password is required'
    else if (formData.password.length < 6) nextErrors.password = 'Password must be at least 6 characters'

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      await register(
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          guardianContact: formData.guardianContact.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        'Student'
      )

      toast.success('Student registration successful!')
      navigate('/student', { replace: true })
    } catch (error) {
      const message = getApiErrorMessage(error, 'Student registration failed.')
      toast.error(message)
      setErrors({ general: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AnimatedBackdrop variant="auth" />

      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Registration</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Create your hostel student account in the MSSQL database
            </p>
          </div>

          <Card className="border-0 p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.general ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                </div>
              ) : null}

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Student Name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={<User className="h-5 w-5 text-gray-400" />}
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<Mail className="h-5 w-5 text-gray-400" />}
                />

                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={errors.phoneNumber}
                  icon={<Phone className="h-5 w-5 text-gray-400" />}
                />

                <Input
                  label="Guardian Contact"
                  name="guardianContact"
                  placeholder="Enter guardian phone number"
                  value={formData.guardianContact}
                  onChange={handleChange}
                  error={errors.guardianContact}
                  icon={<ShieldCheck className="h-5 w-5 text-gray-400" />}
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={<Lock className="h-5 w-5 text-gray-400" />}
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  icon={<Lock className="h-5 w-5 text-gray-400" />}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Create Student Account
              </Button>
            </form>

            <div className="mt-6 space-y-2 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already registered?{' '}
                <Link to="/student/login" className="font-medium text-primary hover:underline dark:text-blue-400">
                  Student sign in
                </Link>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Admin account instead?{' '}
                <Link to="/register" className="font-medium text-primary hover:underline dark:text-blue-400">
                  Use admin registration
                </Link>
              </p>
            </div>
          </Card>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-cyan-400/40 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:text-cyan-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentRegister
