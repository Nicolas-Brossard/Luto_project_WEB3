import {
  useAddress,
  useContractRead,
  useContractWrite,
  useDisconnect,
} from '@thirdweb-dev/react'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { currency } from '@/constants'
import { disabledButtonVerifications } from '@/app/actions'
import CountdownTimer from './CountdownTimer'
import toast from 'react-hot-toast'
import Header from './Header'
import Marquee from 'react-fast-marquee'
import AdminControls from './AdminControls'

function Lottery({ contract }: { contract: any }) {
  const address = useAddress()
  const { data: remainingTickets } = useContractRead(
    contract,
    'RemainingTickets'
  )
  const { data: currentWinningReward } = useContractRead(
    contract,
    'CurrentWinningReward'
  )
  const { data: ticketPrice } = useContractRead(contract, 'ticketPrice')
  const { data: ticketCommission } = useContractRead(
    contract,
    'ticketCommission'
  )
  const { data: winnings } = useContractRead(
    contract,
    'getWinningsForAddress',
    [address]
  )
  const { mutateAsync: WithdrawWinnings, isLoading } = useContractWrite(
    contract,
    'WithdrawWinnings'
  )
  const { data: expiration } = useContractRead(contract, 'expiration')
  const [quantity, setQuantity] = useState<number>(1)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [userTickets, setUserTickets] = useState<number>(0)
  const { data: tickets } = useContractRead(contract, 'getTickets')
  const { mutateAsync: BuyTickets } = useContractWrite(contract, 'BuyTickets')
  const { data: lastWinner } = useContractRead(contract, 'lastWinner')
  const { data: lastWinnerAmount } = useContractRead(
    contract,
    'lastWinnerAmount'
  )
  const { data: lotteryOperator } = useContractRead(contract, 'lotteryOperator')

  const handleClick = async () => {
    if (!ticketPrice) return

    const notification = toast.loading('Processing your transaction...')

    try {
      const value = ethers.utils
        .parseEther(
          ethers.utils.formatEther(
            ethers.BigNumber.from(quantity.toString()).mul(ticketPrice)
          )
        )
        .toString()

      const data = await BuyTickets({
        overrides: {
          value: value,
        },
      })
      toast.success('Tickets purchased ', { id: notification })
    } catch (error) {
      toast.error('Whoops, something went wrong.', { id: notification })
    }
  }

  const handleOnWithdrawWinnings = async () => {
    const notification = toast.loading('Processing your transaction...')
    try {
      const data = await WithdrawWinnings({})
      toast.success('Winnings withdrawn', { id: notification })
    } catch (error) {
      toast.error('Whoops, something went wrong.', { id: notification })
    }
  }

  useEffect(() => {
    if (!tickets) return
    const totalTickets: string[] = tickets
    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAdress) => (ticketAdress === address ? total + 1 : total),
      0
    )
    setUserTickets(noOfUserTickets)
  }, [tickets, address])
  console.log(userTickets)

  useEffect(() => {
    async function getIsDisabled() {
      const isDisabled = await disabledButtonVerifications(
        expiration?.toString(),
        remainingTickets?.toNumber()
      )
      setDisabled(isDisabled)
    }
    getIsDisabled()
  }, [expiration, remainingTickets])

  return (
    <>
      <Header />
      <div className="flex flex-col justify-center items-center">
        <Marquee
          className="bg-[#61dad6ba] p-5 mb-5 "
          gradient={false}
          speed={100}
        >
          <div className="flex flex-row space-x-2 mx-10 ">
            <h4 className="text-white font-bold">
              Last winner : {lastWinner?.toString()}
            </h4>
            <h4 className="text-white font-bold">
              Previous winnings :{' '}
              {lastWinner &&
                lastWinnerAmount &&
                ethers.utils.formatEther(lastWinnerAmount?.toString())}{' '}
              {currency}
            </h4>
          </div>
        </Marquee>

        {lotteryOperator && (
          <div className="flex justify-center items-center">
            <AdminControls contract={contract} />
          </div>
        )}

        {winnings > 0 && (
          <div className="max-w-md md:max-w-2xl lg:max-w-4xl">
            <button
              onClick={handleOnWithdrawWinnings}
              className="p-10 bg-gradient-to-b from-[#f98a5e] to-[#642852] animate-pulse text-center rounded-xl  text-white font-semibold shadow-xl w-full "
            >
              <p className="font-bold">Winner Winner Chicken Diner !</p>
              <p>
                Total Winnings: {ethers.utils.formatEther(winnings.toString())}{' '}
                {currency}
              </p>
              <br />
              <p className="font-semibold">Click here to withdraw</p>
            </button>
          </div>
        )}
        <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
          <div className="stats-container">
            <h1 className="text-5xl text-white font-semibold text-center">
              Next Draw
            </h1>
            <div className="flex justify-between p-2 space-x-2 ">
              <div className="stats bg-[#101217] border-[#101217]">
                <h2 className="text-sm ">Total Pool</h2>
                <p className="text-xl">
                  {currentWinningReward &&
                    ethers.utils.formatEther(
                      currentWinningReward.toString()
                    )}{' '}
                  {currency}
                </p>
              </div>
              <div className="stats bg-[#101217] border-[#101217]">
                <h2 className="text-sm">Tickets remaining</h2>
                <p className="text-xl">{remainingTickets?.toNumber()}</p>
              </div>
            </div>
            <div className="mt-5 mb-3">
              <CountdownTimer expiration={expiration} />
            </div>
          </div>
          <div className="stats-container space-y-2">
            <div className="stats-container">
              <div className="flex justify-between items-center text-white pb-2 space-x-2">
                <h2>Price per ticket</h2>
                <p>
                  {ticketPrice &&
                    ethers.utils.formatEther(ticketPrice.toString())}{' '}
                  {currency}
                </p>
              </div>
              <div className=" flex text-white items-center space-x-2 bg-[#101217] border-[#101217] border p-4">
                <p>TICKETS</p>
                <input
                  type="number"
                  className=" flex w-full bg-transparent text-right outline-none"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2 mt-5">
                <div className="flex items-center justify-between text-cyan-300 text-sm italic font-extrabold">
                  <p>Total cost of tickets</p>
                  <p>
                    {quantity &&
                      ticketPrice &&
                      ethers.utils.formatEther(
                        ethers.BigNumber.from(quantity.toString()).mul(
                          ethers.BigNumber.from(ticketPrice.toString())
                        )
                      )}
                  </p>
                </div>
                <div className="flex items-center justify-between text-cyan-300 text-xs italic">
                  <p>Service fees</p>
                  <p>
                    {ticketCommission &&
                      ethers.utils.formatEther(
                        ticketCommission.toString()
                      )}{' '}
                    {currency}
                  </p>
                </div>
                <div className="flex items-center justify-between text-cyan-300 text-xs italic">
                  <p>+ Network Fees</p>
                  <p>TBC</p>
                </div>
              </div>
              <button
                disabled={disabled}
                onClick={handleClick}
                className="mt-5 w-full bg-gradient-to-br from-[#f98a5e] to-[#642852] px-10 py-5 rounded-md font-semibold text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600 disabled:text-gray-100 disabled:cursor-not-allowed"
              >
                Buy {quantity} Tickets for{' '}
                {quantity &&
                  ticketPrice &&
                  ethers.utils.formatEther(
                    ethers.BigNumber.from(quantity.toString()).mul(
                      ethers.BigNumber.from(ticketPrice.toString())
                    )
                  )}{' '}
                {currency}
              </button>
            </div>
            {userTickets > 0 && (
              <div className="stats">
                <p className="text-lg mb-2">
                  You have {userTickets} tickets for this draw. Good luck!
                </p>
                <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
                  {Array(userTickets)
                    .fill('')
                    .map((_, i) => (
                      <p
                        className="text-cyan-300 h-12 w-12 bg-[#101217] rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic "
                        key={i}
                      >
                        {i + 1}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Lottery
