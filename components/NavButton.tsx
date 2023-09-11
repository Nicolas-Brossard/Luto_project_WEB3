import React from 'react'

interface Props {
  title: string
  isActive?: boolean
  handleLogout?: () => Promise<void>
}

function NavButton({ title, isActive, handleLogout }: Props) {
  return (
    <button
      onClick={handleLogout}
      className={`${
        isActive && 'bg-[#61dad6]'
      } hover:bg-[#61dad6] hover:shadow-xl p-3 bg-[#2b4343] text-white rounded-md m-2 text-sm `}
    >
      {title}
    </button>
  )
}

export default NavButton
