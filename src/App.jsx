import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import PublicRooms from './pages/PublicRooms'
import PublicRoomDetails from './pages/PublicRoomDetails'
import Dashboard from './pages/dashboard'
import Students from './pages/Students'
import Rooms from './pages/Rooms'
import Blocks from './pages/Blocks'
import Visitors from './pages/Visitors'
import Payments from './pages/Payments'
import FeeStructure from './pages/FeeStructure'
import MessMenu from './pages/MessMenu'
import Maintenance from './pages/Maintenance'
import LeaveRequests from './pages/LeaveRequests'
import ProfileSettings from './pages/ProfileSettings'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './auth/ProtectedRoute'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { ThemeProvider } from './theme/ThemeContext'

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null // or a loading spinner

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/rooms" element={<PublicRooms />} />
      <Route path="/rooms/:roomId" element={<PublicRoomDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/admin" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/admin" replace /> : <Register />}
      />
      <Route
        path="/forgot-password"
        element={isAuthenticated ? <Navigate to="/admin" replace /> : <ForgotPassword />}
      />
      <Route
        path="/reset-password"
        element={isAuthenticated ? <Navigate to="/admin" replace /> : <ResetPassword />}
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="students" element={<Students />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="blocks" element={<Blocks />} />
          <Route path="visitors" element={<Visitors />} />
          <Route path="payments" element={<Payments />} />
          <Route path="fees" element={<FeeStructure />} />
          <Route path="mess" element={<MessMenu />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="leaves" element={<LeaveRequests />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>

        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="/students" element={<Navigate to="/admin/students" replace />} />
        <Route path="/blocks" element={<Navigate to="/admin/blocks" replace />} />
        <Route path="/visitors" element={<Navigate to="/admin/visitors" replace />} />
        <Route path="/payments" element={<Navigate to="/admin/payments" replace />} />
        <Route path="/fees" element={<Navigate to="/admin/fees" replace />} />
        <Route path="/mess" element={<Navigate to="/admin/mess" replace />} />
        <Route path="/maintenance" element={<Navigate to="/admin/maintenance" replace />} />
        <Route path="/leaves" element={<Navigate to="/admin/leaves" replace />} />
        <Route path="/profile" element={<Navigate to="/admin/profile" replace />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? "/admin" : "/" } replace />} />
    </Routes>
  )
}

// Main App
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
