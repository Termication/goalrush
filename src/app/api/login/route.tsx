'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      window.location.href = '/admin'
    } else {
      const { error } = await res.json()
      window.location.href = `/login?error=${encodeURIComponent(error)}`
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-sm w-full">
      <h1 className="text-xl font-bold mb-4">Admin Login</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Admin Password"
        className="border border-gray-300 p-2 w-full rounded mb-4"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        {submitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
