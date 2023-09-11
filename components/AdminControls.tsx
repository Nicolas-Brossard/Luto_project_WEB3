import { currency } from '@/constants'
import {
  ArrowPathIcon,
  ArrowUturnDownIcon,
  CurrencyDollarIcon,
  StarIcon,
} from '@heroicons/react/24/solid'
import { useContractRead, useContractWrite } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import React from 'react'
import toast from 'react-hot-toast'

function AdminControls({ contract }: { contract: any }) {
  const { data: totalCommission } = useContractRead(
    contract,
    'operatorTotalCommission'
  )

  const { mutateAsync: DrawWinnerTicket } = useContractWrite(
    contract,
    'DrawWinnerTicket'
  )
  const { mutateAsync: RefundAll } = useContractWrite(contract, 'RefundAll')
  const { mutateAsync: restartDraw } = useContractWrite(contract, 'restartDraw')
  const { mutateAsync: WithdrawCommission } = useContractWrite(
    contract,
    'WithdrawCommission'
  )

  const handleDrawWinner = async () => {
    const notification = toast.loading('Processing your transaction...')
    try {
      await DrawWinnerTicket({})
      toast.success('Winner Drawn', { id: notification })
    } catch (error) {
      toast.error('Whoops something went wrong ', { id: notification })
    }
  }

  const handleRefundAll = async () => {
    const notification = toast.loading('Processing your transaction...')
    try {
      await RefundAll({})
      toast.success('All partipants are refunded', { id: notification })
    } catch (error) {
      toast.error('Whoops something went wrong ', { id: notification })
    }
  }

  const handleRestartDraw = async () => {
    const notification = toast.loading('Processing your transaction...')
    try {
      await restartDraw({})
      toast.success('Draw Restarted', { id: notification })
    } catch (error) {
      toast.error('Whoops something went wrong ', { id: notification })
    }
  }

  const handleWithdrawCommission = async () => {
    const notification = toast.loading('Processing your transaction...')
    try {
      await WithdrawCommission({})
      toast.success('Commission Withdrawn', { id: notification })
    } catch (error) {
      toast.error('Whoops something went wrong ', { id: notification })
    }
  }

  return (
    <div className="text-white text-center px-5 py-3 border-[#61dad6] border rounded-md m-5">
      Admin Controls
      {totalCommission && (
        <p className="mb-1">
          Total Commision to be withdrawn :{' '}
          {ethers.utils.formatEther(totalCommission?.toString())} {currency}
        </p>
      )}
      <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
        <button className="admin-button" onClick={handleDrawWinner}>
          <StarIcon className="h-8 w-8 text-white mx-auto mb-2" />
          Draw Winner
        </button>
        <button className="admin-button" onClick={handleWithdrawCommission}>
          <CurrencyDollarIcon className="h-8 w-8 text-white mx-auto mb-2" />
          Withdraw Commision
        </button>
        <button className="admin-button" onClick={handleRestartDraw}>
          <ArrowPathIcon className="h-8 w-8 text-white mx-auto mb-2" />
          Restart Draw
        </button>
        <button className="admin-button" onClick={handleRefundAll}>
          <ArrowUturnDownIcon className="h-8 w-8 text-white mx-auto mb-2" />
          Refund All
        </button>
      </div>
    </div>
  )
}

export default AdminControls
