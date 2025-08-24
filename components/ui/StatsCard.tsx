import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
}

const StatsCard = ({ title, value, description, icon, trend }: StatsCardProps) => {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            {trend && (
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${trend.isPositive ? "text-emerald-400" : "text-red-400"}`}>
                  {trend.isPositive ? "+" : ""}
                  {trend.value}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">{icon}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { StatsCard }
export default StatsCard
