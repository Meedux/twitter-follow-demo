"use client"
import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'

export function FollowButton() {
  const { data: session } = useSession()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFollow = async () => {
    if (!session) {
      signIn('twitter')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await res.json()
      
      if (res.ok && data.success) {
        setFollowing(true)
      } else {
        setError(data.error || 'Failed to follow')
      }
    } catch (error) {
      setError('Failed to process request')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleFollow}
        disabled={following || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {!session ? "Sign in to Follow" : loading ? 'Loading...' : following ? 'Following' : 'Follow'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}