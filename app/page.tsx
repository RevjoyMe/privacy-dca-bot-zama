"use client"

import { Button } from "@/components/ui/button"
import { WalletButton } from "@/components/wallet-button"
import Link from "next/link"
import { Hero } from "@/components/layout/Hero"
import { StatsCard } from "@/components/ui/StatsCard"
import { MarketCard } from "@/components/markets/MarketCard"
import { usePredictionMarket } from "@/hooks/usePredictionMarket"

export default function HomePage() {
  const { marketData } = usePredictionMarket()

  const featuredMarkets = [
    {
      id: 1,
      question: "Was Kanye hacked?",
      endTime: Math.floor(Date.now() / 1000) + 86400 * 7,
      totalYesBets: BigInt("10000000000000000"),
      totalNoBets: BigInt("9900000000000000000"),
      resolved: false,
      volume: "$641k",
      category: "Entertainment",
    },
    {
      id: 2,
      question: "Democratic Presidential Nominee 2028",
      endTime: Math.floor(Date.now() / 1000) + 86400 * 1460,
      totalYesBets: BigInt("2900000000000000000"),
      totalNoBets: BigInt("7100000000000000000"),
      resolved: false,
      volume: "$13m",
      category: "Politics",
    },
    {
      id: 3,
      question: "Presidential Election Winner 2028",
      endTime: Math.floor(Date.now() / 1000) + 86400 * 1460,
      totalYesBets: BigInt("2700000000000000000"),
      totalNoBets: BigInt("7300000000000000000"),
      resolved: false,
      volume: "$11m",
      category: "Politics",
    },
    {
      id: 4,
      question: "Russia x Ukraine ceasefire in 2025?",
      endTime: Math.floor(Date.now() / 1000) + 86400 * 365,
      totalYesBets: BigInt("2700000000000000000"),
      totalNoBets: BigInt("7300000000000000000"),
      resolved: false,
      volume: "$18m",
      category: "Geopolitics",
    },
    {
      id: 5,
      question: "Will Putin meet with Zelenskyy in 2025?",
      endTime: Math.floor(Date.now() / 1000) + 86400 * 365,
      totalYesBets: BigInt("2800000000000000000"),
      totalNoBets: BigInt("7200000000000000000"),
      resolved: false,
      volume: "$1m",
      category: "Geopolitics",
    },
    {
      id: 6,
      question: "Fed decision in September?",
      endTime: Math.floor(Date.now() / 1000) + 86400 * 30,
      totalYesBets: BigInt("8300000000000000000"),
      totalNoBets: BigInt("1700000000000000000"),
      resolved: false,
      volume: "$37m",
      category: "Economics",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SP</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">SecretPredictions</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-4">
                <Link href="/markets" className="text-muted-foreground hover:text-foreground transition-colors">
                  Markets
                </Link>
                <Link href="/oracles" className="text-muted-foreground hover:text-foreground transition-colors">
                  Oracles
                </Link>
              </nav>
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* Featured Markets */}
      <section id="featured-markets" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-foreground">Featured Markets</h3>
            <Link href="/markets">
              <Button
                variant="outline"
                className="border-border text-muted-foreground hover:bg-muted hover:text-foreground bg-transparent"
              >
                View All Markets
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatsCard title="Total Volume" value="$200M+" description="Total Volume" />
            <StatsCard title="Active Markets" value="150+" description="Active Markets" />
            <StatsCard title="Daily Traders" value="5,000+" description="Daily Traders" />
            <StatsCard title="Accuracy Rate" value="94.2%" description="Prediction Accuracy" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">© 2024 SecretPredictions. Powered by blockchain technology.</p>
        </div>
      </footer>
    </div>
  )
}
