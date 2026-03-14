import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Upload from './pages/Upload'
import DiagramView from './pages/DiagramView'
import History from './pages/History'
import Admin from './pages/Admin'

export default function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {user && <Navbar />}
      <main className={user ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/diagrams" element={<ProtectedRoute><DiagramView /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}
