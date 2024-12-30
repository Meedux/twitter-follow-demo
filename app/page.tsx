"use client"
import { useEffect, useState } from 'react'
import { TwitterCard } from '@/components/TwitterCard'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()
  const [loggedInUserId, setLoggedInUserId] = useState('')

  useEffect(() => {
    if (session) {
      setLoggedInUserId(session.userId)
    }
  }, [session])

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#111827]">
      <TwitterCard
        username="EDITH"
        profileImage="https://pbs.twimg.com/profile_images/1866592205369958405/UiQ0nqRA_400x400.jpg"
        bio="Decentralized Super AI and Multi-Model AI Agents Platform."
        targetUserId="1856996371292680192" // Replace with the actual target user ID
        loggedInUserId={loggedInUserId}
      />
    </main>
  )
}