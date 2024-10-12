import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import DisplayAmount from 'components/DisplayAmount'
import Table from 'components/Table'
import TableBody from 'components/Table/TableBody'
import TableHeader from 'components/Table/TableHead'
import TableRow from 'components/Table/TableRow'
import TokenLogo from 'components/TokenLogo'
import { TxToast, renderErrorToast } from 'components/TxToast'
import { ABIS } from 'contracts'
import { useFaucetStats } from 'hooks'
import Head from 'next/head'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Address, parseUnits, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { WAGMI_CHAIN, WAGMI_CONFIG } from 'app.config'
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { bsc } from 'viem/chains'

interface RowProps {
	addr: Address
	name: string
	symbol: string
	balance: bigint
	decimal: bigint
}

export function FaucetRow({ name, symbol, balance, decimal, addr }: RowProps) {
	const { address } = useAccount()
	const account = address || zeroAddress
	const [isConfirming, setIsConfirming] = useState(false)

	const handleFaucet = async () => {
		try {
			setIsConfirming(true)

			const mintWriteHash = await writeContract(WAGMI_CONFIG, {
				address: addr,
				abi: ABIS.MockVolABI,
				functionName: 'mint',
				args: [account, parseUnits('1000', Number(decimal))],
			})

			const toastContent = [
				{
					title: 'Amount:',
					value: '1000 ' + symbol,
				},
				{
					title: 'Transaction:',
					hash: mintWriteHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: mintWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Fauceting ${symbol}`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title={`Successfully Fauceted ${symbol}`} />,
				},
				error: {
					render(error: unknown) {
						return renderErrorToast(error)
					},
				},
			})
		} catch (e) {
			console.log(e)
			setIsConfirming(false)
		}
	}

	return (
		<TableRow
			actionCol={
				<Button isLoading={isConfirming} onClick={() => handleFaucet()} variant="primary">
					+1000 {symbol}
				</Button>
			}
			colSpan={6}
		>
			<div className="col-span-3">
				<div className="text-gray-400 md:hidden">Token</div>
				<div className="flex items-center">
					<TokenLogo currency={symbol} size={10} />
					<div>
						<div className="ml-2">{name}</div>
						<span className="ml-2 font-bold">{symbol}</span>
					</div>
				</div>
			</div>
			<div>
				<div className="text-gray-400 md:hidden">Decimals</div>
				{decimal.toString()}
			</div>
			<div>
				<div className="text-gray-400 md:hidden">Your Balance</div>
				<DisplayAmount address={addr} amount={balance} currency={symbol} digits={decimal} hideLogo />
			</div>
		</TableRow>
	)
}

export default function Faucet() {
	const faucetStats = useFaucetStats()
	if ((WAGMI_CHAIN.id as number) === (bsc.id as number)) return <></>

	return (
		<>
			<Head>
				<title>OracleFreeDollar - Faucet</title>
			</Head>
			<div>
				<AppPageHeader title="Faucets" />
				<Table>
					<TableHeader actionCol colSpan={6} headers={['Token', '', '', 'Decimals', 'Your Balance']} />
					<TableBody>
						{Object.keys(faucetStats).map((key) => (
							<FaucetRow
								addr={faucetStats[key].address}
								balance={faucetStats[key].balance}
								decimal={faucetStats[key].decimals}
								key={key}
								name={faucetStats[key].name}
								symbol={faucetStats[key].symbol}
							/>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	)
}
