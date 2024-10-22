'use client'

import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import { useTokenData, useUserBalance } from 'hooks'
import Head from 'next/head'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { isAddress } from 'viem'
import { envConfig } from 'app.env.config'
import { useOpenPosition } from 'hooks/positions'
import PositionInitialization from 'components/Position/PositionInitialization'
import PositionProposeCollateral from 'components/Position/PositionProposeCollateral'
import PositionFinancialTerms from 'components/Position/PositionFinancialTerms'
import PositionLiquidation from 'components/Position/PositionLiquidation'

export default function PositionCreate({}) {
	const [auctionDuration, setAuctionDuration] = useState(24n)
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [auctionError, setAuctionError] = useState('')
	const [buffer, setBuffer] = useState(200000n)
	const [bufferError, setBufferError] = useState('')
	const [collTokenAddrError, setCollTokenAddrError] = useState('')
	const [collateralAddress, setCollateralAddress] = useState('')
	const [initError, setInitError] = useState('')
	const [initPeriod, setInitPeriod] = useState(5n)
	const [initialCollAmount, setInitialCollAmount] = useState(0n)
	const [initialCollAmountError, setInitialCollAmountError] = useState('')
	const [interest, setInterest] = useState(30000n)
	const [interestError, setInterestError] = useState('')
	const [limitAmount, setLimitAmount] = useState(1_000_000n * BigInt(1e18))
	const [limitAmountError, setLimitAmountError] = useState('')
	const [liqPrice, setLiqPrice] = useState(0n)
	const [liqPriceError, setLiqPriceError] = useState('')
	const [maturity, setMaturity] = useState(12n)
	const [minCollAmount, setMinCollAmount] = useState(0n)
	const [minCollAmountError, setMinCollAmountError] = useState('')

	const collTokenData = useTokenData(collateralAddress)
	const userBalance = useUserBalance()

	useEffect(() => {
		if (isAddress(collateralAddress)) {
			if (collTokenData.name == 'NaN') {
				setCollTokenAddrError('Could not obtain token data')
			} else if (collTokenData.decimals > 24n) {
				setCollTokenAddrError('Token decimals should be less than 24.')
			} else {
				setCollTokenAddrError('')
			}
		} else {
			setLiqPriceError('')
			setLimitAmountError('')
			setMinCollAmountError('')
			setInitialCollAmountError('')
			setCollTokenAddrError('')
		}
	}, [collateralAddress, collTokenData])

	const checkCollateralAmount = useCallback((coll: bigint, price: bigint) => {
		if (coll * price < 5000n * 10n ** 36n) {
			setLiqPriceError('The liquidation value of the collateral must be at least 5000 OFD')
			setMinCollAmountError('The collateral must be worth at least 5000 OFD')
		} else {
			setLiqPriceError('')
			setMinCollAmountError('')
		}
	}, [])

	const onChangeInitialCollAmount = useCallback(
		(value: string) => {
			const valueBigInt = BigInt(value)
			setInitialCollAmount(valueBigInt)
			if (valueBigInt < minCollAmount) {
				setInitialCollAmountError('Must be at least the minimum amount.')
			} else if (valueBigInt > collTokenData.balance) {
				setInitialCollAmountError(`Not enough ${collTokenData.symbol} in your wallet.`)
			} else {
				setInitialCollAmountError('')
			}
		},
		[collTokenData.balance, collTokenData.symbol, minCollAmount]
	)

	const onChangeMinCollAmount = useCallback(
		(value: string) => {
			const valueBigInt = BigInt(value)
			setMinCollAmount(valueBigInt)
			if (valueBigInt > initialCollAmount) {
				setInitialCollAmount(valueBigInt)
				onChangeInitialCollAmount(valueBigInt.toString())
			}
			checkCollateralAmount(valueBigInt, liqPrice)
		},
		[checkCollateralAmount, initialCollAmount, liqPrice, onChangeInitialCollAmount]
	)

	const onChangeLimitAmount = useCallback((value: string) => {
		const valueBigInt = BigInt(value)
		setLimitAmount(valueBigInt)
	}, [])

	const onChangeCollateralAddress = useCallback((addr: string) => {
		setCollateralAddress(addr)
		setMinCollAmount(0n)
		setInitialCollAmount(0n)
		setLiqPrice(0n)
	}, [])

	const onChangeInterest = useCallback((value: string) => {
		const valueBigInt = BigInt(value)
		setInterest(valueBigInt)

		if (valueBigInt > 100_0000n) {
			setInterestError('Annual Interest Rate should be less than 100%')
		} else {
			setInterestError('')
		}
	}, [])

	const onChangeMaturity = useCallback((value: string) => {
		const valueBigInt = BigInt(value)
		setMaturity(valueBigInt)
	}, [])

	const onChangeInitPeriod = useCallback((value: string) => {
		const valueBigInt = BigInt(value)
		setInitPeriod(valueBigInt)
		if (valueBigInt < 3n) {
			setInitError('Initialization Period must be at least 3 days.')
		} else {
			setInitError('')
		}
	}, [])

	const onChangeLiqPrice = useCallback(
		(value: string) => {
			const valueBigInt = BigInt(value)
			setLiqPrice(valueBigInt)
			checkCollateralAmount(minCollAmount, valueBigInt)
		},
		[checkCollateralAmount, minCollAmount]
	)

	const onChangeBuffer = useCallback((value: string) => {
		const valueBigInt = BigInt(value)
		setBuffer(valueBigInt)
		if (valueBigInt > 1000_000n) {
			setBufferError('Buffer cannot exceed 100%')
		} else if (valueBigInt < 100_000) {
			setBufferError('Buffer must be at least 10%')
		} else {
			setBufferError('')
		}
	}, [])

	const onChangeAuctionDuration = useCallback((value: string) => {
		const valueBigInt = BigInt(value)
		setAuctionDuration(valueBigInt)
	}, [])

	const hasFormError = useMemo(() => {
		return (
			!!minCollAmountError ||
			!!initialCollAmountError ||
			!!collTokenAddrError ||
			!!limitAmountError ||
			!!interestError ||
			!!liqPriceError ||
			!!bufferError ||
			!!auctionError ||
			!!initError
		)
	}, [
		auctionError,
		bufferError,
		collTokenAddrError,
		initError,
		initialCollAmountError,
		interestError,
		limitAmountError,
		liqPriceError,
		minCollAmountError,
	])

	const { openPosition, openingPosition } = useOpenPosition({
		auctionDuration,
		buffer,
		collTokenData,
		initPeriod,
		initialCollAmount,
		interest,
		limitAmount,
		liqPrice,
		maturity,
		minCollAmount,
	})

	const showApproveButton = useMemo(
		() =>
			collTokenData.symbol != 'NaN' &&
			(collTokenData.allowance == 0n || collTokenData.allowance < minCollAmount || collTokenData.allowance < initialCollAmount),
		[collTokenData.allowance, collTokenData.symbol, initialCollAmount, minCollAmount]
	)

	return (
		<>
			<Head>
				<title>{envConfig.AppName} - Propose Position</title>
			</Head>
			<div>
				<AppPageHeader
					backText="Back to positions"
					backTo={`/positions`}
					title="Propose New Position Type"
					tooltip="Propose a completely new position with a collateral of your choice."
				/>
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<PositionInitialization
						initError={initError}
						initPeriod={initPeriod}
						onChangeInitialCollAmount={onChangeInitialCollAmount}
						onChangeInitPeriod={onChangeInitPeriod}
						userOFDBalance={userBalance.ofdBalance}
					/>
					<PositionProposeCollateral
						collateralAddress={collateralAddress}
						collTokenAddrError={collTokenAddrError}
						collTokenData={collTokenData}
						initialCollAmount={initialCollAmount}
						initialCollAmountError={initialCollAmountError}
						minCollAmount={minCollAmount}
						minCollAmountError={minCollAmountError}
						onChangeCollateralAddress={onChangeCollateralAddress}
						onChangeInitialCollAmount={onChangeInitialCollAmount}
						onChangeMinCollAmount={onChangeMinCollAmount}
						showApproveButton={showApproveButton}
						userBalanceRefetch={userBalance.refetch}
					/>
					<PositionFinancialTerms
						interest={interest}
						interestError={interestError}
						limitAmount={limitAmount}
						limitAmountError={limitAmountError}
						maturity={maturity}
						onChangeInterest={onChangeInterest}
						onChangeLimitAmount={onChangeLimitAmount}
						onChangeMaturity={onChangeMaturity}
					/>
					<PositionLiquidation
						auctionDuration={auctionDuration}
						auctionError={auctionError}
						buffer={buffer}
						bufferError={bufferError}
						collateralDecimals={collTokenData.decimals}
						liqPrice={liqPrice}
						liqPriceError={liqPriceError}
						minCollAmount={minCollAmount}
						onChangeAuctionDuration={onChangeAuctionDuration}
						onChangeBuffer={onChangeBuffer}
						onChangeLiqPrice={onChangeLiqPrice}
					/>
				</section>
				<div className="mx-auto mt-8 w-72 max-w-full flex-col">
					<GuardToAllowedChainBtn>
						<Button
							disabled={minCollAmount == 0n || collTokenData.allowance < initialCollAmount || initialCollAmount == 0n || hasFormError}
							isLoading={openingPosition}
							onClick={openPosition}
							variant="primary"
						>
							Propose Position
						</Button>
					</GuardToAllowedChainBtn>
				</div>
			</div>
		</>
	)
}
