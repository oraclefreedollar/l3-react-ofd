import AppCard from 'components/AppCard'
import TokenInput from 'components/Input/TokenInput'
import { ADDRESS, ABIS } from 'contracts'
import { useAccount, useBlockNumber, useChainId } from 'wagmi'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import { zeroAddress } from 'viem'
import { useEffect, useState } from 'react'
import SavingsDetailsCard from './SavingsDetailsCard'
import { readContract } from 'wagmi/actions'
import { WAGMI_CONFIG } from 'app.config'
import { useSelector } from 'react-redux'
import SavingsActionInterest from './SavingsActionInterest'
import SavingsActionSave from './SavingsActionSave'
import SavingsActionWithdraw from './SavingsActionWithdraw'
import { RootState } from 'store/types'

export default function SavingsInteractionCard() {
	const [amount, setAmount] = useState(0n)
	const [error, setError] = useState('')
	const [isLoaded, setLoaded] = useState<boolean>(false)

	const [userBalance, setUserBalance] = useState(0n)
	const [userSavingsBalance, setUserSavingsBalance] = useState(0n)
	const [userSavingsInterest, setUserSavingsInterest] = useState(0n)
	const [userSavingsLocktime, setUserSavingsLocktime] = useState(0n)

	const leadrate = useSelector((state: RootState) => state.savings.savingsInfo.rate)

	const { data } = useBlockNumber({ watch: true })
	const { address } = useAccount()
	const chainId = useChainId()
	const account = address || zeroAddress
	const ADDR = ADDRESS[chainId]

	const fromSymbol = 'OFD'
	const change: bigint = amount - (userSavingsBalance + userSavingsInterest)
	const direction: boolean = amount >= userSavingsBalance + userSavingsInterest

	// ---------------------------------------------------------------------------

	useEffect(() => {
		if (account === zeroAddress) return

		const fetchAsync = async function () {
			const _balance = await readContract(WAGMI_CONFIG, {
				address: ADDR.oracleFreeDollar,
				abi: ABIS.OracleFreeDollarABI,
				functionName: 'balanceOf',
				args: [account],
			})
			setUserBalance(_balance)

			const [_userSavings, _userTicks] = await readContract(WAGMI_CONFIG, {
				address: ADDR.savings,
				abi: ABIS.SavingsABI,
				functionName: 'savings',
				args: [account],
			})
			setUserSavingsBalance(_userSavings)

			const _current = await readContract(WAGMI_CONFIG, {
				address: ADDR.savings,
				abi: ABIS.SavingsABI,
				functionName: 'currentTicks',
			})

			const _locktime = _userTicks >= _current && leadrate !== 0 ? (_userTicks - _current) / BigInt(leadrate) : 0n
			setUserSavingsLocktime(_locktime)

			const _tickDiff = _current - _userTicks
			const _interest = _userTicks == 0n || _locktime > 0 ? 0n : (_tickDiff * _userSavings) / (1_000_000n * 365n * 24n * 60n * 60n)

			setUserSavingsInterest(_interest)

			if (!isLoaded) {
				setAmount(_userSavings)
				setLoaded(true)
			}
		}

		fetchAsync()
	}, [data, account, ADDR, isLoaded, leadrate])

	useEffect(() => {
		setLoaded(false)
	}, [account])

	// ---------------------------------------------------------------------------

	const onChangeAmount = (value: string) => {
		const valueBigInt = BigInt(value)
		setAmount(valueBigInt)
		if (valueBigInt > userBalance + userSavingsBalance + userSavingsInterest) {
			setError(`Not enough ${fromSymbol} in your wallet.`)
		} else {
			setError('')
		}
	}

	return (
		<section className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
			<AppCard>
				<div className="text-lg font-bold text-center">Adjustment</div>

				<div className="mt-8">
					<TokenInput
						balanceLabel="Max:"
						error={error}
						label="Your savings"
						max={userBalance + userSavingsBalance + userSavingsInterest}
						onChange={onChangeAmount}
						placeholder={fromSymbol + ' Amount'}
						symbol={fromSymbol}
						value={amount.toString()}
					/>
				</div>

				<div className="mx-auto my-4 w-72 max-w-full flex-col flex gap-4">
					<GuardToAllowedChainBtn>
						{userSavingsInterest > 0 && amount == userSavingsBalance ? (
							<SavingsActionInterest balance={userSavingsBalance} disabled={!!error} interest={userSavingsInterest} />
						) : amount > userSavingsBalance ? (
							<SavingsActionSave amount={amount} disabled={!!error} interest={userSavingsInterest} />
						) : (
							<SavingsActionWithdraw balance={amount} change={change} disabled={userSavingsBalance == 0n || !!error} />
						)}
					</GuardToAllowedChainBtn>
				</div>
			</AppCard>

			<SavingsDetailsCard
				balance={userSavingsBalance}
				change={isLoaded ? change : 0n}
				direction={direction}
				interest={isLoaded ? userSavingsInterest : 0n}
				locktime={userSavingsLocktime}
			/>
		</section>
	)
}
