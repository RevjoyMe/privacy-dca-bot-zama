"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WalletConnectModal } from "./wallet-connect-modal"
import { useWallet } from "./providers/Providers"

export function WalletButton() {
  const [showModal, setShowModal] = useState(false)
  const { isConnected, address, balance, disconnect } = useWallet()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="crypto-glow">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>{formatAddress(address)}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">Wallet Connected</p>
              <p className="text-xs text-muted-foreground">{formatAddress(address)}</p>
              {balance && <p className="text-xs text-muted-foreground mt-1">Balance: {balance} ETH</p>}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View on Explorer</DropdownMenuItem>
            <DropdownMenuItem>Copy Address</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={disconnect} className="text-destructive">
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  }

  return (
    <>
      <Button onClick={() => setShowModal(true)} className="crypto-glow">
        Connect Wallet
      </Button>
      <WalletConnectModal open={showModal} onOpenChange={setShowModal} />
    </>
  )
}
