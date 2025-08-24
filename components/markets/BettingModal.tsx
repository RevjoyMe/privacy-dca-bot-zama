"use client"

import { useState } from "react"
import { useWallet } from "@/components/providers/Providers"
import { usePredictionMarket } from "@/hooks/usePredictionMarket"
import { toast } from "sonner"

interface Market {
  id: number
  question: string
  endTime: number
  totalYesBets: bigint
  totalNoBets: bigint
  resolved: boolean
}

interface BettingModalProps {
  isOpen: boolean
  onClose: () => void
  market: Market
  selectedOutcome: boolean | null
}

export function BettingModal({ isOpen, onClose, market, selectedOutcome }: BettingModalProps) {
  const [betAmount, setBetAmount] = useState("")
  const { isConnected } = useWallet()
  const { placeBet, isPending, isConfirming } = usePredictionMarket()

  const handlePlaceBet = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!betAmount || Number.parseFloat(betAmount) <= 0) {
      toast.error("Please enter a valid bet amount")
      return
    }

    if (selectedOutcome === null) {
      toast.error("Please select an outcome")
      return
    }

    try {
      const amountInWei = BigInt(Math.floor(Number.parseFloat(betAmount) * 1e18))
      await placeBet(market.id, selectedOutcome, amountInWei)
      toast.success("Bet placed successfully!")
      onClose()
      setBetAmount("")
    } catch (error) {
      console.error("Error placing bet:", error)
      toast.error("Failed to place bet. Please try again.")
    }
  }
}
