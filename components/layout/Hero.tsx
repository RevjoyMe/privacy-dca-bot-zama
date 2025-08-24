"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, Users, DollarSign } from "lucide-react"

const Hero = () => {
  return (
    <section className="relative py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Predict the Future
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join the world's most advanced prediction market platform. Make informed bets on real-world events with
          encrypted, secure transactions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            Start Predicting
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Markets</h3>
            <p className="text-muted-foreground text-center">
              Trade on live prediction markets with real-time odds and data
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
            <p className="text-muted-foreground text-center">
              Join thousands of predictors in our decentralized ecosystem
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Betting</h3>
            <p className="text-muted-foreground text-center">Encrypted transactions with smart contract security</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
export default Hero
