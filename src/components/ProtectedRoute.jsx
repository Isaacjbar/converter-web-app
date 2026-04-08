import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../AuthContext'

export default function ProtectedRoute({ children, adminOnly }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
}

ProtectedRoute.defaultProps = {
  adminOnly: false,
}
