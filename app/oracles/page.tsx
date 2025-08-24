"use client"
import { OracleDataDisplay, type OracleData } from "@/components/oracle-data-display"
import { WalletButton } from "@/components/wallet-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Database, TrendingUp, Shield } from "lucide-react"

// Mock oracle data
const mockOracleData: OracleData[] = [
  {
    id: "oracle-1",
    name: "Bitcoin Price Feed",
    source: "Chainlink",
    status: "active",
    lastUpdate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    confidence: 98,
    value: 67500,
    dataType: "price",
    marketId: "1",
  },
  {
    id: "oracle-2",
    name: "Ethereum Price Feed",
    source: "Band Protocol",
    status: "active",
    lastUpdate: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    confidence: 96,
    value: 3200,
    dataType: "price",
    marketId: "2",
  },
  {
    id: "oracle-3",
    name: "DeFi TVL Tracker",
    source: "DeFiLlama API",
    status: "active",
    lastUpdate: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    confidence: 94,
    value: 185000000000,
    dataType: "event",
    marketId: "3",
  },
  {
    id: "oracle-4",
    name: "Super Bowl Results",
    source: "ESPN API",
    status: "inactive",
    lastUpdate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    confidence: 100,
    value: "Chiefs Won",
    dataType: "sports",
    marketId: "4",
  },
  {
    id: "oracle-5",
    name: "AI Development Tracker",
    source: "Custom Oracle",
    status: "active",
    lastUpdate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    confidence: 87,
    value: "No AGI Yet",
    dataType: "event",
    marketId: "5",
  },
  {
    id: "oracle-6",
    name: "Election Results Feed",
    source: "AP News API",
    status: "active",
    lastUpdate: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    confidence: 92,
    value: "Pending",
    dataType: "event",
    marketId: "6",
  },
]

export default function OraclesPage() {
  const activeOracles = mockOracleData.filter((oracle) => oracle.status === "active")
  const totalConfidence = activeOracles.reduce((sum, oracle) => sum + oracle.confidence, 0) / activeOracles.length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SP</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">SecretPredictions</h1>
            </div>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Oracle Network</h2>
          <p className="text-muted-foreground">
            Real-time data feeds powering our prediction markets with transparent, verifiable information
          </p>
        </div>

        {/* Oracle Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Oracles</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activeOracles.length}</div>
              <p className="text-xs text-muted-foreground">of {mockOracleData.length} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{totalConfidence.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">across all feeds</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">6</div>
              <p className="text-xs text-muted-foreground">unique providers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">99.2%</div>
              <p className="text-xs text-muted-foreground">uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Oracle Data Display */}
        <OracleDataDisplay oracleData={mockOracleData} />

        {/* Oracle Network Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Oracle Network Information</span>
            </CardTitle>
            <CardDescription>Understanding our decentralized oracle infrastructure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Supported Data Types</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400">
                    Price Feeds
                  </Badge>
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400">
                    Event Data
                  </Badge>
                  <Badge variant="outline" className="bg-orange-500/20 text-orange-400">
                    Sports Results
                  </Badge>
                  <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400">
                    Weather Data
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Oracle Providers</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chainlink:</span>
                    <span>Price Feeds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Band Protocol:</span>
                    <span>Cross-chain Data</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Custom APIs:</span>
                    <span>Event Tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
