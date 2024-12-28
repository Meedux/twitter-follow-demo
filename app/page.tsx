"use client"
import { TwitterCard } from '@/components/TwitterCard'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <TwitterCard
        username="EDITH"
        profileImage="https://pbs.twimg.com/profile_images/1866592205369958405/UiQ0nqRA_400x400.jpg"
        bio="Decentralized Super AI and Multi-Model AI Agents Platform."
      />
    </main>
  )
}