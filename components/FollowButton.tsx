"use client"
import { useState } from 'react'

export function FollowButton({ targetUserId, loggedInUserId, accessToken }: { targetUserId: string, loggedInUserId: string, accessToken: string }) {
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = () => {
    window.location.href = 'http://192.168.100.36:3000/api/auth/oauth2'
  }

  const handleFollow = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ targetUserId, loggedInUserId })
      })

      if (response.ok) {
        setFollowing(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to follow user')
      }
    } catch (err) {
      setError('Failed to follow user')
    } finally {
      setLoading(false)
    }
  }

  const handleButtonClick = async () => {
    if (!accessToken) {
      handleLogin()
    } else {
      await handleFollow()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleButtonClick}
        disabled={following || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Loading...' : following ? 'Following' : 'Follow'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}