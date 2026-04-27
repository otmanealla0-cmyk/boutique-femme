'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MaintenanceLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    document.cookie = `maintenance-access=${password}; path=/; max-age=86400`
    router.push('/')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAFAF6',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    }}>
      <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: 4, color: '#1A1512', marginBottom: 8 }}>
        DRESS BY ME
      </p>
      <p style={{ color: '#9E8E7C', marginBottom: 40, fontSize: 14 }}>
        Site en maintenance — accès restreint
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 320 }}>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(false) }}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #EDE5D8',
            background: '#fff',
            fontSize: 14,
            marginBottom: 12,
            outline: 'none',
            boxSizing: 'border-box',
          }}
          autoFocus
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '13px',
            background: '#1A1512',
            color: '#fff',
            border: 'none',
            fontSize: 12,
            letterSpacing: 3,
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Accéder
        </button>
      </form>
    </div>
  )
}
