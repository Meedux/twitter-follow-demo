"use client"
import { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

export function FollowButton({ targetUserId, loggedInUserId }: { targetUserId: string, loggedInUserId: string }) {
  const { data: session, status } = useSession()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [popup, setPopup] = useState<Window | null>(null)

  const handleLogin = () => {
    signIn('twitter')
  }

  const handleFollow = async () => {
    setLoading(true)
    setError('')

    const followUrl = `https://twitter.com/intent/follow?user_id=${targetUserId}`
    const newPopup = window.open(followUrl, 'Follow', 'width=600,height=400')
    setPopup(newPopup)
  }

  const checkFollowStatus = async () => {
    try {
      console.log('Checking follow status...')
      console.log(session?.userId)
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUserId, loggedInUserId: session?.userId })
      })

      if (response.ok) {
        setFollowing(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to verify follow status')
      }
    } catch (err) {
      setError('Failed to verify follow status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (popup) {
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval)
          checkFollowStatus()
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [popup])

  const handleButtonClick = async () => {
    if (!session) {
      handleLogin()
    } else {
      await handleFollow()
    }
  }

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center">
        <button
          onClick={handleLogin}
          className="bg-[#2CC562] text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Sign in with Twitter
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleButtonClick}
        disabled={following || loading}
        className="bg-[#2CC562] text-white px-6 py-4 rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? 'Loading...' : following ? 'Following' : 'Follow'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}