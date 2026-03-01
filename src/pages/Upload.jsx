import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Upload() {
  const [files, setFiles] = useState([])
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef()
  const navigate = useNavigate()

  const handleFiles = (fileList) => {
    const valid = Array.from(fileList).filter(
      f => f.name.endsWith('.java') || f.name.endsWith('.zip')
    )
    setFiles(prev => [...prev, ...valid])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (index) => setFiles(files.filter((_, i) => i !== index))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!files.length && !code.trim()) {
      setError('Sube al menos un archivo .java/.zip o pega codigo Java')
      return
    }
    setError('')
    setLoading(true)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      if (code.trim()) formData.append('code', code.trim())
      const { data } = await api.post('convert/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      sessionStorage.setItem('diagrams', JSON.stringify(data))
      navigate('/diagrams')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al convertir')
    } finally {
      setLoading(false)
    }
  }

  const loadExamples = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('examples/')
      sessionStorage.setItem('diagrams', JSON.stringify(data))
      navigate('/diagrams')
    } catch {
      setError('Error al cargar ejemplos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Convierte tu codigo Java
          <br />
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            a diagramas UML
          </span>
        </h1>
        <p className="text-neutral-500 dark:text-neutral-500 mt-3 text-lg">
          Sube archivos .java o .zip y genera diagramas de clases, casos de uso y flujo automaticamente.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm border border-red-200 dark:border-red-900">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drop zone */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer
            ${dragActive
              ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20'
              : 'border-neutral-300 dark:border-neutral-700 hover:border-violet-400 dark:hover:border-violet-600 bg-white dark:bg-neutral-900'
            }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".java,.zip"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className="font-medium text-neutral-700 dark:text-neutral-300">
            Arrastra archivos .java o .zip aqui
          </p>
          <p className="text-neutral-400 text-sm mt-1">o haz clic para seleccionar</p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                    <span className="text-violet-600 dark:text-violet-400 text-xs font-bold">
                      {f.name.endsWith('.zip') ? 'ZIP' : 'J'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-neutral-400">{(f.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Separator */}
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-neutral-200 dark:border-neutral-800"></div>
          <span className="text-neutral-400 text-xs uppercase tracking-widest font-medium">o pega codigo</span>
          <div className="flex-1 border-t border-neutral-200 dark:border-neutral-800"></div>
        </div>

        {/* Code paste */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="public class MyClass {&#10;    // tu codigo Java aqui...&#10;}"
          rows={8}
          className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all duration-200 resize-y placeholder:text-neutral-400"
        />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-violet-500/25"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Convirtiendo...
              </span>
            ) : 'Generar diagramas'}
          </button>
          <button
            type="button"
            onClick={loadExamples}
            disabled={loading}
            className="px-6 py-3 rounded-xl text-sm font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200"
          >
            Ver ejemplo
          </button>
        </div>
      </form>
    </div>
  )
}
