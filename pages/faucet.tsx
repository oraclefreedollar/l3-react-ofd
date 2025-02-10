import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import DisplayAmount from 'components/DisplayAmount'
import Table from 'components/Table'
import TableBody from 'components/Table/TableBody'
import TableHeader from 'components/Table/TableHead'
import TableRow from 'components/Table/TableRow'
import TokenLogo from 'components/TokenLogo'
import { ABIS } from 'contracts'
import { useFaucetStats, useWriteContractWithToast } from 'hooks'
import Head from 'next/head'
import { useMemo } from 'react'
import { Address, parseUnits, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { WAGMI_CHAIN } from 'app.config'
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

	const toastContent = useMemo(
		() => [
			{
				title: 'Amount:',
				value: '1000 ' + symbol,
			},
		],
		[symbol]
	)

	const { loading: isConfirming, writeFunction: handleFaucet } = useWriteContractWithToast({
		contractParams: {
			address: addr,
			abi: ABIS.MockVolABI,
			functionName: 'mint',
			args: [account, parseUnits('1000', Number(decimal))],
		},
		toastSuccess: {
			title: `Successfully Fauceted ${symbol}`,
			rows: toastContent,
		},
		toastPending: {
			title: `Fauceting ${symbol}`,
			rows: toastContent,
		},
	})

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
