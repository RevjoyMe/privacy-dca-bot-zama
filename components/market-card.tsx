"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BettingModal } from "./betting-modal"
import { Clock, Users, TrendingUp, DollarSign, Database } from "lucide-react"

export interface Market {
  id: string
  title: string
  description: string
  category: "crypto" | "sports" | "politics" | "tech"
  status: "active" | "closed" | "pending"
  yesPrice: number
  noPrice: number
  volume: string
  participants: number
  endDate: string
  createdBy: string
  liquidity: string
}

interface MarketCardProps {
  market: Market
  onPlaceBet?: (marketId: string, side: "yes" | "no") => void
  showOracleInfo?: boolean
}

export function MarketCard({ market, onPlaceBet, showOracleInfo = false }: MarketCardProps) {
  const [hoveredSide, setHoveredSide] = useState<"yes" | "no" | null>(null)
  const [showBettingModal, setShowBettingModal] = useState(false)
  const [selectedSide, setSelectedSide] = useState<"yes" | "no" | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "crypto":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "sports":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "politics":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "tech":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400"
      case "closed":
        return "bg-red-500/20 text-red-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const formatTimeRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  const handleBetClick = (side: "yes" | "no") => {
    setSelectedSide(side)
    setShowBettingModal(true)
    onPlaceBet?.(market.id, side)
  }

  // Mock oracle info based on market category
  const getOracleInfo = () => {
    switch (market.category) {
      case "crypto":
        return { source: "Chainlink", confidence: 98 }
      case "sports":
        return { source: "ESPN API", confidence: 95 }
      case "politics":
        return { source: "AP News", confidence: 92 }
      case "tech":
        return { source: "Custom Oracle", confidence: 87 }
      default:
        return { source: "Unknown", confidence: 0 }
    }
  }

  const oracleInfo = getOracleInfo()

  return (
    <>
      <Card className="market-card hover:crypto-glow transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <Badge className={getCategoryColor(market.category)} variant="outline">
              {market.category.toUpperCase()}
            </Badge>
            <Badge className={getStatusColor(market.status)} variant="outline">
              {market.status.toUpperCase()}
            </Badge>
          </div>
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
            {market.title}
          </CardTitle>
          <CardDescription className="text-sm">{market.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Market Stats */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <DollarSign className="w-3 h-3" />
              <span>Vol: {market.volume}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{market.participants} traders</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formatTimeRemaining(market.endDate)}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              <span>Liq: {market.liquidity}</span>
            </div>
          </div>

          {showOracleInfo && (
            <div className="flex items-center justify-between p-2 bg-card/50 rounded border">
              <div className="flex items-center space-x-2">
                <Database className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">Oracle: {oracleInfo.source}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {oracleInfo.confidence}% confidence
              </Badge>
            </div>
          )}

          {/* Price Display */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Market Odds</span>
              <Progress value={market.yesPrice} className="w-20 h-2" />
            </div>

            {/* Yes/No Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="default"
                className={`relative overflow-hidden transition-all duration-200 h-16 ${
                  hoveredSide === "yes"
                    ? "bg-green-500/20 border-green-500 text-green-400"
                    : "hover:bg-green-500/10 hover:border-green-500/50"
                }`}
                onMouseEnter={() => setHoveredSide("yes")}
                onMouseLeave={() => setHoveredSide(null)}
                onClick={() => handleBetClick("yes")}
                disabled={market.status !== "active"}
              >
                <div className="flex flex-col items-center justify-center w-full">
                  <span className="text-sm font-semibold whitespace-nowrap">YES</span>
                  <span className="text-xl font-bold whitespace-nowrap">{market.yesPrice}%</span>
                </div>
              </Button>

              <Button
                variant="outline"
                size="default"
                className={`relative overflow-hidden transition-all duration-200 h-16 ${
                  hoveredSide === "no"
                    ? "bg-red-500/20 border-red-500 text-red-400"
                    : "hover:bg-red-500/10 hover:border-red-500/50"
                }`}
                onMouseEnter={() => setHoveredSide("no")}
                onMouseLeave={() => setHoveredSide(null)}
                onClick={() => handleBetClick("no")}
                disabled={market.status !== "active"}
              >
                <div className="flex flex-col items-center justify-center w-full">
                  <span className="text-sm font-semibold whitespace-nowrap">NO</span>
                  <span className="text-xl font-bold whitespace-nowrap">{market.noPrice}%</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Creator Info */}
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Created by <span className="text-foreground font-medium">{market.createdBy}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <BettingModal open={showBettingModal} onOpenChange={setShowBettingModal} market={market} side={selectedSide} />
    </>
  )
}
