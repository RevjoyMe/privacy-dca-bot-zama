"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string
  connect: () => Promise<void>
  disconnect: () => void
  chainId: number
  isConnecting: boolean
}

const WalletContext = createContext<WalletContextType | null>(null)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider")
  }
  return context
}

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.0")
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = async () => {
    setIsConnecting(true)
    try {
      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsConnected(true)
      setAddress("0x742d35Cc6634C0532925a3b8D4C9db96590c6C87")
      setBalance("1.2345")
      localStorage.setItem("wallet_connected", "true")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance("0.0")
    localStorage.removeItem("wallet_connected")
  }

  useEffect(() => {
    const wasConnected = localStorage.getItem("wallet_connected")
    if (wasConnected) {
      setIsConnected(true)
      setAddress("0x742d35Cc6634C0532925a3b8D4C9db96590c6C87")
      setBalance("1.2345")
    }
  }, [])

  const walletValue: WalletContextType = {
    isConnected,
    address,
    balance,
    connect,
    disconnect,
    chainId: 11155111, // Sepolia testnet
    isConnecting,
  }

  return <WalletContext.Provider value={walletValue}>{children}</WalletContext.Provider>
}

export { Providers }
export default Providers
