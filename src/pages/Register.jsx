// src/pages/Register.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { getApiErrorMessage } from '../services/api'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import { useAuth } from '../auth/AuthContext'
import AnimatedBackdrop from '../components/layout/AnimatedBackdrop'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email'

    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      await register({ email: formData.email, password: formData.password })
      toast.success('Registration successful! You are now logged in.')
      navigate('/admin', { replace: true })
    } catch (err) {
      const message = getApiErrorMessage(err, 'Registration failed.')
      toast.error(message)
      setErrors({ general: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AnimatedBackdrop variant="auth" />
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary dark:bg-blue-500 rounded-2xl mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Register a new admin account for HostelMS</p>
          </div>

          <Card className="p-8 shadow-xl border-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.general && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                </div>
              )}

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail className="w-5 h-5 text-gray-400" />}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock className="w-5 h-5 text-gray-400" />}
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={<Lock className="w-5 h-5 text-gray-400" />}
              />

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Register
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary dark:text-blue-400 font-medium hover:underline">
                  Sign In
                </Link>
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Student account instead?{' '}
                <Link to="/student/register" className="text-primary dark:text-blue-400 font-medium hover:underline">
                  Use student registration
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

export default Register
