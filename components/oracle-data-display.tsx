"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, Database, CheckCircle, AlertCircle, Clock } from "lucide-react"

export interface OracleData {
  id: string
  name: string
  source: string
  status: "active" | "inactive" | "error"
  lastUpdate: string
  confidence: number
  value: string | number
  dataType: "price" | "event" | "weather" | "sports"
  marketId?: string
}

export interface OracleHistoryPoint {
  timestamp: string
  value: number
  confidence: number
}

interface OracleDataDisplayProps {
  oracleData: OracleData[]
  marketId?: string
}

export function OracleDataDisplay({ oracleData, marketId }: OracleDataDisplayProps) {
  const [selectedOracle, setSelectedOracle] = useState<OracleData | null>(null)
  const [historyData, setHistoryData] = useState<OracleHistoryPoint[]>([])

  // Filter oracles by market if marketId is provided
  const filteredOracles = marketId ? oracleData.filter((oracle) => oracle.marketId === marketId) : oracleData

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "inactive":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "inactive":
        return <Clock className="w-4 h-4" />
      case "error":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Database className="w-4 h-4" />
    }
  }

  const getDataTypeColor = (dataType: string) => {
    switch (dataType) {
      case "price":
        return "bg-blue-500/20 text-blue-400"
      case "event":
        return "bg-purple-500/20 text-purple-400"
      case "weather":
        return "bg-cyan-500/20 text-cyan-400"
      case "sports":
        return "bg-orange-500/20 text-orange-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  // Mock history data generation
  useEffect(() => {
    if (selectedOracle) {
      const mockHistory: OracleHistoryPoint[] = []
      const now = new Date()

      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString()
        const baseValue = typeof selectedOracle.value === "number" ? selectedOracle.value : 50000
        const variation = (Math.random() - 0.5) * 0.1 * baseValue
        const value = baseValue + variation
        const confidence = 85 + Math.random() * 10

        mockHistory.push({
          timestamp,
          value,
          confidence,
        })
      }

      setHistoryData(mockHistory)
    }
  }, [selectedOracle])

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatValue = (oracle: OracleData) => {
    if (typeof oracle.value === "number") {
      return oracle.dataType === "price" ? `$${oracle.value.toLocaleString()}` : oracle.value.toString()
    }
    return oracle.value
  }

  return (
    <div className="space-y-6">
      {/* Oracle Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOracles.map((oracle) => (
          <Card
            key={oracle.id}
            className={`cursor-pointer transition-all duration-200 hover:crypto-glow ${
              selectedOracle?.id === oracle.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedOracle(oracle)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(oracle.status)}
                  <CardTitle className="text-sm">{oracle.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(oracle.status)} variant="outline">
                  {oracle.status}
                </Badge>
              </div>
              <CardDescription className="text-xs">Source: {oracle.source}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={getDataTypeColor(oracle.dataType)} variant="outline">
                  {oracle.dataType.toUpperCase()}
                </Badge>
                <span className="text-sm font-mono">{formatValue(oracle)}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Confidence</span>
                  <span>{oracle.confidence}%</span>
                </div>
                <Progress value={oracle.confidence} className="h-1" />
              </div>

              <div className="text-xs text-muted-foreground">Last update: {formatTimestamp(oracle.lastUpdate)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Oracle View */}
      {selectedOracle && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>{selectedOracle.name}</CardTitle>
                  <CardDescription>Oracle Data Analysis</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedOracle(null)}>
                Close
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="current">Current Data</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{formatValue(selectedOracle)}</div>
                        <p className="text-xs text-muted-foreground">Current Value</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">{selectedOracle.confidence}%</div>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {getStatusIcon(selectedOracle.status)}
                          <span className="text-sm font-medium">{selectedOracle.status.toUpperCase()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Status</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Oracle Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-mono">{selectedOracle.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Source:</span>
                        <span>{selectedOracle.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data Type:</span>
                        <Badge className={getDataTypeColor(selectedOracle.dataType)} variant="outline">
                          {selectedOracle.dataType}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Market ID:</span>
                        <span className="font-mono">{selectedOracle.marketId || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Performance Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uptime:</span>
                        <span className="text-green-400">99.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Response:</span>
                        <span>1.2s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Updates/Day:</span>
                        <span>1,440</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Accuracy:</span>
                        <span className="text-primary">96.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
