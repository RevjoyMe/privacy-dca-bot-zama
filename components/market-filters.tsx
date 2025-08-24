"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface MarketFiltersProps {
  onCategoryChange: (category: string) => void
  onStatusChange: (status: string) => void
  onSortChange: (sort: string) => void
  onSearchChange: (search: string) => void
}

export function MarketFilters({ onCategoryChange, onStatusChange, onSortChange, onSearchChange }: MarketFiltersProps) {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { value: "all", label: "All Markets" },
    { value: "crypto", label: "Crypto" },
    { value: "sports", label: "Sports" },
    { value: "politics", label: "Politics" },
    { value: "tech", label: "Technology" },
  ]

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    onCategoryChange(category)
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input placeholder="Search markets..." className="pl-10" onChange={(e) => onSearchChange(e.target.value)} />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={activeCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick(category.value)}
            className={activeCategory === category.value ? "crypto-glow" : ""}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Status and Sort */}
      <div className="flex gap-4">
        <Select onValueChange={onStatusChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="participants">Participants</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="ending">Ending Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
