import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
        ${isActive(path)
          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
        }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">UML Converter</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navLink('/', 'Convertir')}
            {navLink('/history', 'Historial')}
            {user?.role === 'admin' && navLink('/admin', 'Admin')}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-xs text-neutral-500 dark:text-neutral-500 hidden md:block">
              {user?.email}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
