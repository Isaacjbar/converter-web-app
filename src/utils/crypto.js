const KEY_HEX = import.meta.env.VITE_AES_KEY

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

async function getKey() {
  const keyBytes = hexToBytes(KEY_HEX)
  return crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  )
}

function bytesToBase64(bytes) {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCodePoint(bytes[i])
  }
  return btoa(binary)
}

function base64ToBytes(b64) {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.codePointAt(i)
  }
  return bytes
}

export async function encryptPayload(data) {
  const key = await getKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(JSON.stringify(data))
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), iv.byteLength)
  return bytesToBase64(combined)
}

export async function decryptPayload(b64) {
  const key = await getKey()
  const data = base64ToBytes(b64)
  const iv = data.slice(0, 12)
  const ciphertext = data.slice(12)
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
  return JSON.parse(new TextDecoder().decode(decrypted))
}
