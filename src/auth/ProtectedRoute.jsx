import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getDashboardPathForRole, useAuth } from './AuthContext'
import Loader from '../components/common/Loader'

const ProtectedRoute = ({ allowedRoles = [], loginPath = '/login' }) => {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <Loader size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  const hasAllowedRole =
    allowedRoles.length === 0 ||
    allowedRoles.includes(user?.role) ||
    (user?.role === 'SuperAdmin' && allowedRoles.includes('Admin'))

  if (!hasAllowedRole) {
    return <Navigate to={getDashboardPathForRole(user?.role)} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
