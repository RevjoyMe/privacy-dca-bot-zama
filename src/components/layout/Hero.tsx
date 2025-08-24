"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  const scrollToMarkets = () => {
    const marketsSection = document.getElementById("featured-markets")
    marketsSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Decentralized Prediction Markets
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Trade on future events with encrypted betting, oracle integration, and transparent blockchain technology
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
            onClick={scrollToMarkets}
          >
            Start Predicting
          </Button>
          <Link href="/oracles">
            <Button
              variant="outline"
              size="lg"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 px-8 py-3 bg-transparent"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
