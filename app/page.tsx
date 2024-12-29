"use client"
import { useEffect, useState } from 'react'
import { TwitterCard } from '@/components/TwitterCard'

export default function Home() {
  const [loggedInUserId, setLoggedInUserId] = useState('')
  const [accessToken, setAccessToken] = useState('')

  useEffect(() => {
    // Fetch or retrieve the loggedInUserId and accessToken from your authentication flow
    // For simplicity, we'll use globalThis here, but you should use a proper state management or context
    setLoggedInUserId((globalThis as any).loggedInUserId || '')
    setAccessToken((globalThis as any).accessToken || '')
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <TwitterCard
        username="EDITH"
        profileImage="https://pbs.twimg.com/profile_images/1866592205369958405/UiQ0nqRA_400x400.jpg"
        bio="Decentralized Super AI and Multi-Model AI Agents Platform."
        targetUserId={loggedInUserId} // Use loggedInUserId as targetUserId
        loggedInUserId={loggedInUserId}
        accessToken={accessToken}
      />
    </main>
  )
}