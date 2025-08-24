"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp } from "lucide-react"
import { BettingModal } from "@/components/betting-modal"
import { useState } from "react"

interface Market {
  id: number
  question: string
  endTime: number
  totalYesBets: bigint
  totalNoBets: bigint
  resolved: boolean
  volume: string
  category: string
}

interface MarketCardProps {
  market: Market
}

const MarketCard = ({ market }: MarketCardProps) => {
  const [showBettingModal, setShowBettingModal] = useState(false)
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no">("yes")

  const totalBets = market.totalYesBets + market.totalNoBets
  const yesPercentage = totalBets > 0n ? Number((market.totalYesBets * 100n) / totalBets) : 50
  const noPercentage = 100 - yesPercentage

  const timeRemaining = market.endTime - Math.floor(Date.now() / 1000)
  const daysRemaining = Math.floor(timeRemaining / 86400)

  const handleBet = (outcome: "yes" | "no") => {
    setSelectedOutcome(outcome)
    setShowBettingModal(true)
  }

  return (
    <>
      <Card className="bg-card border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-card-foreground text-sm leading-tight line-clamp-2">{market.question}</h3>
            <Badge variant="secondary" className="text-xs shrink-0 bg-muted text-muted-foreground">
              {market.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{market.volume}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{daysRemaining}d left</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleBet("yes")}
              className="h-16 flex flex-col items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
              disabled={market.resolved}
            >
              <span className="text-xs font-medium whitespace-nowrap">YES</span>
              <span className="text-lg font-bold">{yesPercentage}¢</span>
            </Button>
            <Button
              onClick={() => handleBet("no")}
              className="h-16 flex flex-col items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white border-0"
              disabled={market.resolved}
            >
              <span className="text-xs font-medium whitespace-nowrap">NO</span>
              <span className="text-lg font-bold">{noPercentage}¢</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <BettingModal
        open={showBettingModal}
        onOpenChange={setShowBettingModal}
        market={{
          id: market.id.toString(),
          title: market.question,
          description: market.question,
          yesPrice: yesPercentage,
          noPrice: noPercentage,
          volume: market.volume,
          participants: Math.floor(Math.random() * 1000) + 100,
          timeRemaining: `${daysRemaining}d`,
          category: market.category,
          status: market.resolved ? "resolved" : "active",
        }}
        side={selectedOutcome}
      />
    </>
  )
}

export { MarketCard }
export default MarketCard
