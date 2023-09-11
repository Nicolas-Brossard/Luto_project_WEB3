'use client'
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'
import React from 'react'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      activeChain={ChainId.Mumbai}
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
    >
      {children}
    </ThirdwebProvider>
  )
}

export default Providers
