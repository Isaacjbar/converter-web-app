import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PlantUMLRenderer from '../components/PlantUMLRenderer'

const TABS = [
  { key: 'class', label: 'Clases' },
  { key: 'usecase', label: 'Casos de Uso' },
  { key: 'flow', label: 'Flujo' },
  { key: 'source', label: 'Codigo Fuente' },
]

export default function DiagramView() {
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState('class')
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = sessionStorage.getItem('diagrams')
    if (stored) setData(JSON.parse(stored))
    else navigate('/')
  }, [navigate])

  if (!data) return null

  const copyCode = () => {
    navigator.clipboard.writeText(data.diagrams?.[activeTab] || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">Diagramas generados</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200"
          >
            Nueva conversion
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-violet-500/25"
          >
            Imprimir
          </button>
        </div>
      </div>

      {/* Errors */}
      {data.errors?.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 p-4 rounded-xl mb-6 text-sm border border-yellow-200 dark:border-yellow-900">
          <strong>Advertencias:</strong>
          <ul className="list-disc ml-4 mt-1">
            {data.errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl mb-6 print:hidden overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 min-w-0 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
              ${activeTab === tab.key
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'source' ? (
        <div className="space-y-4">
          {data.sources?.map((src, i) => (
            <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <div className="bg-neutral-50 dark:bg-neutral-800 px-5 py-3 text-sm font-medium border-b border-neutral-200 dark:border-neutral-700">
                {src.filename}
              </div>
              <pre className="p-5 text-sm font-mono overflow-x-auto text-neutral-700 dark:text-neutral-300">{src.code}</pre>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-3 print:hidden">
            <button
              onClick={copyCode}
              className="text-sm text-neutral-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Copiado
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copiar PlantUML
                </>
              )}
            </button>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 overflow-auto">
            <PlantUMLRenderer code={data.diagrams?.[activeTab]} />
          </div>
        </div>
      )}

      {/* Print: show all diagrams */}
      <div className="hidden print:block">
        <h2 className="text-xl font-bold mb-4">Diagrama de Clases</h2>
        <PlantUMLRenderer code={data.diagrams?.class} />
        <div className="page-break"></div>
        <h2 className="text-xl font-bold mb-4 mt-8">Casos de Uso</h2>
        <PlantUMLRenderer code={data.diagrams?.usecase} />
        <div className="page-break"></div>
        <h2 className="text-xl font-bold mb-4 mt-8">Diagrama de Flujo</h2>
        <PlantUMLRenderer code={data.diagrams?.flow} />
      </div>
    </div>
  )
}
