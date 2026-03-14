import { useState, useEffect } from 'react'
import api from '../api'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-violet-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Gestion de usuarios</h1>

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
    </div>
  )
}
