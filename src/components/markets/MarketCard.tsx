"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, TrendingUp } from "lucide-react"
import { BettingModal } from "./BettingModal"

interface Market {
  id: number
  question: string
  endTime: number
  totalYesBets: bigint
  totalNoBets: bigint
  resolved: boolean
}

interface MarketCardProps {
  market: Market
}

export function MarketCard({ market }: MarketCardProps) {
  const [showBettingModal, setShowBettingModal] = useState(false)
  const [selectedOutcome, setSelectedOutcome] = useState<boolean | null>(null)

  const totalVolume = Number(market.totalYesBets + market.totalNoBets) / 1e18
  const yesPercentage = totalVolume > 0 ? (Number(market.totalYesBets) / 1e18 / totalVolume) * 100 : 50
  const noPercentage = 100 - yesPercentage

  const endDate = new Date(market.endTime * 1000)
  const isExpired = endDate < new Date()

  const handleBet = (outcome: boolean) => {
    setSelectedOutcome(outcome)
    setShowBettingModal(true)
  }

  return (
    <>
      <Card className="bg-gray-900/50 border-gray-800 hover:border-emerald-500/50 transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold text-white leading-tight">{market.question}</CardTitle>
            <Badge variant={market.resolved ? "secondary" : isExpired ? "destructive" : "default"}>
              {market.resolved ? "Resolved" : isExpired ? "Expired" : "Active"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Betting Options */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleBet(true)}
              disabled={market.resolved || isExpired}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center py-6"
            >
              <span className="text-lg font-bold">YES</span>
              <span className="text-sm opacity-90">{yesPercentage.toFixed(1)}%</span>
            </Button>
            <Button
              onClick={() => handleBet(false)}
              disabled={market.resolved || isExpired}
              variant="destructive"
              className="flex flex-col items-center py-6"
            >
              <span className="text-lg font-bold">NO</span>
              <span className="text-sm opacity-90">{noPercentage.toFixed(1)}%</span>
            </Button>
          </div>

          {/* Market Stats */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{totalVolume.toFixed(3)} ETH</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Market #{market.id}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{endDate.toLocaleDateString()}</span>
            </div>
          </div>

          <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">
            View Details
          </Button>
        </CardContent>
      </Card>

      <BettingModal
        isOpen={showBettingModal}
        onClose={() => setShowBettingModal(false)}
        market={market}
        selectedOutcome={selectedOutcome}
      />
    </>
  )
}
