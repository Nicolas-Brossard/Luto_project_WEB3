import { useMetamask } from '@thirdweb-dev/react'
import React from 'react'
import Logo from '../public/logo.png'

function Login() {
  const connectWithMetamask = useMetamask()

  return (
    <div className="text-white h-screen	flex flex-col items-center justify-center ">
      <img src={Logo.src} alt="" className="w-48 mb-4" />
      <h1 className="text-4xl font-bold">Welcome to Luto</h1>
      <p className="text-xl p-4">
        You must use your metamask wallet to using Luto{' '}
      </p>
      <button
        className="bg-[#61dad6] hover:bg-[#61dad6] hover:shadow-xl p-3 bg-[#2b4343] text-white rounded-md m-2 text-sm "
        onClick={() => {
          connectWithMetamask()
        }}
      >
        Login with Metamask
      </button>
    </div>
  )
}

export default Login
