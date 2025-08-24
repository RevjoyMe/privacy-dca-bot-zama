"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MarketCard, type Market } from "@/components/market-card"
import { MarketFilters } from "@/components/market-filters"
import { WalletButton } from "@/components/wallet-button"

// Real Polymarket predictions
const mockMarkets: Market[] = [
  {
    id: "1",
    title: "Was Kanye hacked?",
    description: "Was Kanye West's social media account hacked recently?",
    category: "entertainment",
    status: "active",
    yesPrice: 1,
    noPrice: 99,
    volume: "$621K",
    participants: 1247,
    endDate: "2025-01-31T23:59:59Z",
    createdBy: "CelebWatcher",
    liquidity: "$150K",
  },
  {
    id: "2",
    title: "Democratic Presidential Nominee 2028",
    description: "Who will be the Democratic Party's presidential nominee in 2028?",
    category: "politics",
    status: "active",
    yesPrice: 29, // Gavin Newsom leading
    noPrice: 71,
    volume: "$13M",
    participants: 5420,
    endDate: "2028-08-31T23:59:59Z",
    createdBy: "PoliticalAnalyst",
    liquidity: "$2.1M",
  },
  {
    id: "3",
    title: "Presidential Election Winner 2028",
    description: "Who will win the 2028 US Presidential Election?",
    category: "politics",
    status: "active",
    yesPrice: 27, // JD Vance leading
    noPrice: 73,
    volume: "$11M",
    participants: 4832,
    endDate: "2028-11-07T23:59:59Z",
    createdBy: "ElectionExpert",
    liquidity: "$1.8M",
  },
  {
    id: "4",
    title: "Russia x Ukraine ceasefire in 2025?",
    description: "Will there be a ceasefire between Russia and Ukraine in 2025?",
    category: "geopolitics",
    status: "active",
    yesPrice: 27,
    noPrice: 73,
    volume: "$18M",
    participants: 7234,
    endDate: "2025-12-31T23:59:59Z",
    createdBy: "GeopoliticsTrader",
    liquidity: "$3.2M",
  },
  {
    id: "5",
    title: "Bolivia Presidential Election",
    description: "Will Rodrigo Paz win the Bolivia Presidential Election?",
    category: "politics",
    status: "active",
    yesPrice: 77,
    noPrice: 23,
    volume: "$1.1M",
    participants: 892,
    endDate: "2025-05-31T23:59:59Z",
    createdBy: "LatAmAnalyst",
    liquidity: "$220K",
  },
  {
    id: "6",
    title: "Fed decision in September?",
    description: "Will the Fed decrease rates by 25+ bps in September?",
    category: "economics",
    status: "active",
    yesPrice: 83,
    noPrice: 17,
    volume: "$37M",
    participants: 12450,
    endDate: "2024-09-30T23:59:59Z",
    createdBy: "FedWatcher",
    liquidity: "$5.8M",
  },
  {
    id: "7",
    title: "Will Putin meet with Zelensky in 2025?",
    description: "Will Vladimir Putin and Volodymyr Zelensky meet in person during 2025?",
    category: "geopolitics",
    status: "active",
    yesPrice: 28,
    noPrice: 72,
    volume: "$8.4M",
    participants: 3421,
    endDate: "2025-12-31T23:59:59Z",
    createdBy: "DiplomacyTracker",
    liquidity: "$1.4M",
  },
  {
    id: "8",
    title: "Israel x Hamas ceasefire by August 31?",
    description: "Will there be a ceasefire between Israel and Hamas by August 31?",
    category: "geopolitics",
    status: "active",
    yesPrice: 9,
    noPrice: 91,
    volume: "$6M",
    participants: 2156,
    endDate: "2024-08-31T23:59:59Z",
    createdBy: "MiddleEastExpert",
    liquidity: "$980K",
  },
  {
    id: "9",
    title: "Nobel Peace Prize Winner 2025",
    description: "Will Yulia Navalnaya win the Nobel Peace Prize in 2025?",
    category: "politics",
    status: "active",
    yesPrice: 18,
    noPrice: 82,
    volume: "$2M",
    participants: 1340,
    endDate: "2025-10-31T23:59:59Z",
    createdBy: "NobelWatcher",
    liquidity: "$350K",
  },
  {
    id: "10",
    title: "Bitcoin above $100k on August 22?",
    description: "Will Bitcoin be above $100,000 on August 22nd?",
    category: "crypto",
    status: "active",
    yesPrice: 100, // Extremely unlikely given date
    noPrice: 0,
    volume: "$2M",
    participants: 3200,
    endDate: "2024-08-22T23:59:59Z",
    createdBy: "CryptoOracle",
    liquidity: "$400K",
  },
  {
    id: "11",
    title: "Ethereum above $4000 on August 22?",
    description: "Will Ethereum be above $4,000 on August 22nd?",
    category: "crypto",
    status: "active",
    yesPrice: 95,
    noPrice: 5,
    volume: "$1M",
    participants: 2100,
    endDate: "2024-08-22T23:59:59Z",
    createdBy: "EthTrader",
    liquidity: "$180K",
  },
  {
    id: "12",
    title: "Bitcoin Up or Down on August 22?",
    description: "Will Bitcoin price go up or down on August 22nd?",
    category: "crypto",
    status: "active",
    yesPrice: 98, // Up
    noPrice: 2, // Down
    volume: "$407K",
    participants: 1850,
    endDate: "2024-08-22T23:59:59Z",
    createdBy: "DayTrader",
    liquidity: "$85K",
  },
  {
    id: "13",
    title: "UFC Fight Night: Walker vs Zhang",
    description: "Will Walker defeat Zhang in their upcoming UFC fight?",
    category: "sports",
    status: "active",
    yesPrice: 69,
    noPrice: 31,
    volume: "$439K",
    participants: 1200,
    endDate: "2024-09-15T23:59:59Z",
    createdBy: "UFCExpert",
    liquidity: "$120K",
  },
  {
    id: "14",
    title: "Elon Musk # of tweets August 15-22?",
    description: "Will Elon Musk tweet more than 250 times between August 15-22?",
    category: "entertainment",
    status: "active",
    yesPrice: 98,
    noPrice: 2,
    volume: "$6M",
    participants: 4500,
    endDate: "2024-08-22T23:59:59Z",
    createdBy: "TwitterTracker",
    liquidity: "$850K",
  },
]

export default function MarketsPage() {
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("volume")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAndSortedMarkets = useMemo(() => {
    let filtered = mockMarkets

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((market) => market.category === categoryFilter)
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((market) => market.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (market) =>
          market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          market.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Sort markets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "volume":
          return Number.parseFloat(b.volume.replace(/[$MK]/g, "")) - Number.parseFloat(a.volume.replace(/[$MK]/g, ""))
        case "participants":
          return b.participants - a.participants
        case "newest":
          return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        case "ending":
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [categoryFilter, statusFilter, sortBy, searchQuery])

  const handlePlaceBet = (marketId: string, side: "yes" | "no") => {
    console.log(`[v0] Opening betting modal for ${side} bet on market ${marketId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SP</span>
              </div>
              <Link href="/" className="hover:text-primary transition-colors">
                <h1 className="text-xl font-bold text-foreground">SecretPredictions</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to main
                </Button>
              </Link>
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Prediction Markets</h2>
          <p className="text-muted-foreground">
            Trade on future events with transparent, decentralized prediction markets
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <MarketFilters
            onCategoryChange={setCategoryFilter}
            onStatusChange={setStatusFilter}
            onSortChange={setSortBy}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedMarkets.map((market) => (
            <MarketCard key={market.id} market={market} onPlaceBet={handlePlaceBet} />
          ))}
        </div>

        {filteredAndSortedMarkets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No markets found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}
