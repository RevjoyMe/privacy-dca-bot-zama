"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/components/providers/Providers"

interface WalletConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletConnectModal({ open, onOpenChange }: WalletConnectModalProps) {
  const { connect } = useWallet()

  const handleConnect = async (walletType: string) => {
    console.log(`[v0] Connecting to ${walletType} wallet`)
    await connect()
    onOpenChange(false)
  }

  const wallets = [
    {
      name: "MetaMask",
      icon: "🦊",
      description: "Connect using browser wallet",
      popular: true,
    },
    {
      name: "WalletConnect",
      icon: "🔗",
      description: "Connect using mobile wallet",
      popular: false,
    },
    {
      name: "Coinbase Wallet",
      icon: "🔵",
      description: "Connect using Coinbase",
      popular: false,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md !bg-gray-900 !border-gray-700 shadow-2xl backdrop-blur-none">
        <DialogHeader>
          <DialogTitle className="text-center text-white">Connect Wallet</DialogTitle>
          <DialogDescription className="text-center text-gray-300">
            Choose your preferred wallet to connect to SecretPredictions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-6">
          {wallets.map((wallet) => (
            <Button
              key={wallet.name}
              variant="outline"
              className="w-full h-16 justify-start space-x-4 hover:crypto-glow transition-all duration-300 !bg-gray-800 hover:!bg-gray-700 !border-gray-600 text-white bg-transparent"
              onClick={() => handleConnect(wallet.name)}
            >
              <span className="text-2xl">{wallet.icon}</span>
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{wallet.name}</span>
                  {wallet.popular && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Popular</span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{wallet.description}</p>
              </div>
            </Button>
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            By connecting a wallet, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
