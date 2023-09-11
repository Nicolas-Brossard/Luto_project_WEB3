'use client'
import {
  useAddress,
  useContract,
  useContractRead,
  useDisconnect,
  useMetamask,
} from '@thirdweb-dev/react'
import React from 'react'
import Lottery from './Lottery'
import LandingLoader from './LandingLoader'
import Login from './Login'

function Landing() {
  const address = useAddress()
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  )

  if (!address) return <Login />

  if (isLoading) return <LandingLoader />

  return <Lottery contract={contract} />
}

export default Landing
