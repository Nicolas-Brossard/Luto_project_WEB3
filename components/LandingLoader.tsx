import React from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import Header from './Header'

function LandingLoader() {
  return (
    <>
      <Header />
      <div className="text-white">
        <div className="flex flex-col items-center justify-center">
          <PulseLoader color={'#61dad6'} size={10} />
          <p className="text-xl p-4">Loading Luto</p>
        </div>
      </div>
    </>
  )
}

export default LandingLoader
