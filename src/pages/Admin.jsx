import { useState, useEffect } from 'react'
import api from '../api'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ email: '', username: '', password: '' })
  const [formError, setFormError] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => { loadUsers() }, [])

  const loadUsers = () => {
    api.get('auth/users/')
      .then(res => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'analyst' : 'admin'
    await api.patch(`auth/users/${user.id}/`, { role: newRole })
    loadUsers()
  }

  const toggleActive = async (user) => {
    await api.patch(`auth/users/${user.id}/`, { is_active: !user.is_active })
    loadUsers()
  }

  const deleteUser = async (user) => {
    if (!confirm(`Eliminar usuario ${user.email}?`)) return
    await api.delete(`auth/users/${user.id}/`)
    loadUsers()
  }

  const openModal = () => {
    setForm({ email: '', username: '', password: '' })
    setFormError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setFormError('')
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')
    setCreating(true)
    try {
      await api.post('auth/register/', {
        email: form.email,
        username: form.username,
        password: form.password,
      })
      closeModal()
      loadUsers()
    } catch (err) {
      const data = err?.response?.data
      if (data && typeof data === 'object') {
        const messages = Object.values(data).flat().join(' ')
        setFormError(messages || 'Error al crear el usuario')
      } else {
        setFormError('Error al crear el usuario')
      }
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-violet-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gestion de usuarios</h1>
        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Crear usuario
        </button>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {users.map(user => (
          <div key={user.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-sm">{user.email}</p>
                <p className="text-xs text-neutral-500">{user.first_name} {user.last_name}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                ${user.role === 'admin'
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                  : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                {user.role === 'admin' ? 'Admin' : 'Analista'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${user.is_active ? 'text-green-600' : 'text-red-500'}`}>
                {user.is_active ? 'Activo' : 'Inactivo'}
              </span>
              <div className="flex gap-3">
                <button onClick={() => toggleRole(user)} className="text-xs text-violet-600 dark:text-violet-400">Cambiar rol</button>
                <button onClick={() => toggleActive(user)} className="text-xs text-yellow-600 dark:text-yellow-400">{user.is_active ? 'Desactivar' : 'Activar'}</button>
                <button onClick={() => deleteUser(user)} className="text-xs text-red-500">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800">
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Registro</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4 text-sm">{user.email}</td>
                <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{user.first_name} {user.last_name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                    ${user.role === 'admin'
                      ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                      : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                    {user.role === 'admin' ? 'Admin' : 'Analista'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium
                    ${user.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">{new Date(user.date_joined).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button onClick={() => toggleRole(user)} className="text-xs text-violet-600 dark:text-violet-400 hover:underline">Cambiar rol</button>
                    <button onClick={() => toggleActive(user)} className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline">{user.is_active ? 'Desactivar' : 'Activar'}</button>
                    <button onClick={() => deleteUser(user)} className="text-xs text-red-500 hover:underline">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create user modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal}></div>
          <div className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Crear usuario</h2>
              <button onClick={closeModal} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5">Username</label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="nombre_usuario"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5">Contraseña</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>

              {formError && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2">
                  {formError}
                </p>
              )}

              <p className="text-xs text-neutral-500">El usuario se creará con rol <span className="font-medium text-neutral-700 dark:text-neutral-300">Analista</span> por defecto.</p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-medium transition-colors"
                >
                  {creating ? 'Creando...' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
