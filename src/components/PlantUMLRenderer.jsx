import { useState, useEffect } from 'react'
import pako from 'pako'

function encode6bit(b) {
  if (b < 10) return String.fromCharCode(48 + b)
  b -= 10
  if (b < 26) return String.fromCharCode(65 + b)
  b -= 26
  if (b < 26) return String.fromCharCode(97 + b)
  b -= 26
  if (b === 0) return '-'
  if (b === 1) return '_'
  return '?'
}

function append3bytes(b1, b2, b3) {
  const c1 = b1 >> 2
  const c2 = ((b1 & 0x3) << 4) | (b2 >> 4)
  const c3 = ((b2 & 0xF) << 2) | (b3 >> 6)
  const c4 = b3 & 0x3F
  return encode6bit(c1 & 0x3F) + encode6bit(c2 & 0x3F) + encode6bit(c3 & 0x3F) + encode6bit(c4 & 0x3F)
}

function encodePlantUML(text) {
  const data = pako.deflateRaw(new TextEncoder().encode(text))
  let result = ''
  for (let i = 0; i < data.length; i += 3) {
    if (i + 2 === data.length) {
      result += append3bytes(data[i], data[i + 1], 0)
    } else if (i + 1 === data.length) {
      result += append3bytes(data[i], 0, 0)
    } else {
      result += append3bytes(data[i], data[i + 1], data[i + 2])
    }
  }
  return result
}

export default function PlantUMLRenderer({ code }) {
  const [svgUrl, setSvgUrl] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!code) { setSvgUrl(null); return }
    try {
      const encoded = encodePlantUML(code)
      setSvgUrl(`https://www.plantuml.com/plantuml/svg/${encoded}`)
      setError(false)
      setLoading(true)
    } catch {
      setError(true)
      setLoading(false)
    }
  }, [code])

  if (!code) {
    return (
      <div className="flex items-center justify-center py-12 text-neutral-400">
        <p className="text-sm italic">No se genero diagrama</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-sm text-neutral-500 mb-2">Vista previa no disponible. Codigo PlantUML:</p>
        <pre className="text-xs bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-x-auto font-mono">{code}</pre>
      </div>
    )
  }

  if (!svgUrl) return null

  return (
    <div className="diagram-container flex justify-center">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-violet-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        </div>
      )}
      <img
        src={svgUrl}
        alt="UML Diagram"
        className={`max-w-full ${loading ? 'hidden' : ''}`}
        onLoad={() => setLoading(false)}
        onError={() => { setError(true); setLoading(false) }}
      />
    </div>
  )
}
