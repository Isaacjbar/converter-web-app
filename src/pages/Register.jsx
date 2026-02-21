import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Register() {
  const { register } = useAuth()
  const [form, setForm] = useState({
    email: '', username: '', first_name: '', last_name: '', password: '', password2: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password2) {
      setError('Las contrasenas no coinciden')
      return
    }
    setLoading(true)
    try {
      const { password2, ...data } = form
      await register(data)
    } catch (err) {
      const errors = err.response?.data
      if (errors) {
        const msg = Object.values(errors).flat().join('. ')
        setError(msg)
      } else {
        setError('Error al registrarse')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all duration-200 placeholder:text-neutral-400"

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">U</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Crear cuenta</h1>
          <p className="text-neutral-500 mt-2">Registrate como Analista/Programador</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Nombre</label>
                <input name="first_name" value={form.first_name} onChange={handleChange} required className={inputClass} placeholder="Juan" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Apellido</label>
                <input name="last_name" value={form.last_name} onChange={handleChange} required className={inputClass} placeholder="Perez" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Usuario</label>
              <input name="username" value={form.username} onChange={handleChange} required className={inputClass} placeholder="juanperez" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Correo electronico</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Contrasena</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} className={inputClass} placeholder="••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Confirmar contrasena</label>
              <input type="password" name="password2" value={form.password2} onChange={handleChange} required minLength={6} className={inputClass} placeholder="••••••" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-violet-500/25 mt-2"
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Ya tienes cuenta?{' '}
          <Link to="/login" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  )
}
