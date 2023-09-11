'use client'
import React from 'react'
import NavButton from './NavButton'
import { Bars3BottomRightIcon } from '@heroicons/react/24/solid'
import { useAddress, useDisconnect } from '@thirdweb-dev/react'
import Logo from '../public/logo.png'

export default function Header() {
  const address = useAddress()
  const handleLogout = useDisconnect()
  return (
    <header className="grid grid-cols-2 md:grid-cols-5 shadow-2xl rounded-md">
      <div className="flex flex-row">
        <img
          src={Logo.src}
          alt="Lottery"
          className="w-16 h-16 rounded-full m-4"
        />
        {address && (
          <p className="text-xs text-[#61dad6] my-auto">
            address : {address.substring(0, 5)}...
            {address.substring(address.length - 4, address.length)}
          </p>
        )}
      </div>
      <div className="hidden md:flex md:col-span-3 items-center justify-center rounded-md">
        {address && (
          <>
            <NavButton isActive title={'Buy tickets'} />
            <NavButton title={'Logout'} handleLogout={handleLogout} />
          </>
        )}
      </div>
      <div className="flex md:hidden flex-col ml-auto text-right items-center justify-center ">
        <Bars3BottomRightIcon className="h-8 w-8 text-[#61dad6] cursor-pointer mr-4" />
      </div>
    </header>
  )
}
