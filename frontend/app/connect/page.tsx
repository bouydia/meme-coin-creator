'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@/components/ui/button'
import { WalletIcon } from 'lucide-react'
import { useAccount } from 'wagmi'

export default function ConnectWalletButton() {
  const { address, isConnecting } = useAccount()

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted

        if (!ready) {
          return (
            <Button disabled className="w-full">
              <WalletIcon className="mr-2 h-4 w-4" />
              Loading...
            </Button>
          )
        }

        if (account && chain) {
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={openChainModal}
                className="flex-1 bg-white"
              >
                {chain.hasIcon && (
                  <div className="mr-2">
                    {chain.iconUrl && (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        className="h-4 w-4"
                      />
                    )}
                  </div>
                )}
                {chain.name}
              </Button>
              <Button
                onClick={openAccountModal}
                className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
              >
                <WalletIcon className="mr-2 h-4 w-4" />
                {account.displayName}
              </Button>
            </div>
          )
        }

        return (
          <Button
            onClick={openConnectModal}
            className="w-full bg-purple-600 text-white hover:bg-purple-700"
          >
            <WalletIcon className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        )
      }}
    </ConnectButton.Custom>
  )
}
