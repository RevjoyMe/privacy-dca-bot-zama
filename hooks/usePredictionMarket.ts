"use client"

import { useState } from "react"

export function usePredictionMarket() {
  const [isPending, setIsPending] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [hash, setHash] = useState<string | undefined>()

  const placeBet = async (marketId: number, outcome: boolean, amount: bigint) => {
    try {
      setIsPending(true)
      // Mock transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setHash("0x" + Math.random().toString(16).substr(2, 64))
      setIsPending(false)
      setIsConfirming(true)

      // Mock confirmation delay
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setIsConfirming(false)
      setIsConfirmed(true)
    } catch (error) {
      console.error("Error placing bet:", error)
      setIsPending(false)
      setIsConfirming(false)
      throw error
    }
  }

  // Mock market data
  const marketData = [
    {
      id: 1,
      question: "Will Bitcoin reach $100,000 by end of 2024?",
      endTime: Math.floor(Date.now() / 1000) + 86400 * 30,
      totalYesBets: BigInt("2500000000000000000"),
      totalNoBets: BigInt("1500000000000000000"),
      resolved: false,
    },
  ]

  return {
    placeBet,
    marketData,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  }
}
