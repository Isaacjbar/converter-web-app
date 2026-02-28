import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import PlantUMLRenderer from '../components/PlantUMLRenderer'

export default function History() {
  const [entries, setEntries] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('class')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('history/')
      .then(res => setEntries(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const viewEntry = async (id) => {
    const { data } = await api.get(`history/${id}/`)
    setSelected(data)
    setActiveTab('class')
  }

  const deleteEntry = async (id) => {
    if (!confirm('Eliminar este registro?')) return
    await api.delete(`history/${id}/`)
    setEntries(entries.filter(e => e.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const diagramTabs = [
    { key: 'class', label: 'Clases', field: 'class_diagram' },
    { key: 'usecase', label: 'Casos de Uso', field: 'usecase_diagram' },
    { key: 'flow', label: 'Flujo', field: 'flow_diagram' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-violet-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Historial de versiones</h1>

      {entries.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-neutral-500 mb-4">No hay registros aun</p>
          <button
            onClick={() => navigate('/')}
            className="text-violet-600 dark:text-violet-400 hover:underline font-medium text-sm"
          >
            Convertir tu primer archivo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-2">
            {entries.map(entry => (
              <div
                key={entry.id}
                onClick={() => viewEntry(entry.id)}
                className={`p-4 rounded-xl cursor-pointer border transition-all duration-200
                  ${selected?.id === entry.id
                    ? 'bg-violet-50 dark:bg-violet-950/30 border-violet-300 dark:border-violet-800'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{entry.filename}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      v{entry.version} &middot; {new Date(entry.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id) }}
                    className="text-neutral-400 hover:text-red-500 transition-colors ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-bold text-lg">{selected.filename}</h2>
                    <p className="text-sm text-neutral-500">
                      Version {selected.version} &middot; {new Date(selected.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    Imprimir
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl mb-5">
                  {diagramTabs.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${activeTab === tab.key
                          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="overflow-auto">
                  <PlantUMLRenderer code={selected[diagramTabs.find(t => t.key === activeTab)?.field]} />
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-16 text-center text-neutral-400">
                Selecciona un registro para ver los diagramas
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
