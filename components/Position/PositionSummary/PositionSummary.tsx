import React, { useEffect } from 'react'
import { usePositionFormContext } from 'contexts/position'

type SummaryRowProps = {
  label: string
  value: string
  tooltip?: string
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-purple-500/20">
    <div className="text-gray-300">{label}</div>
    <div className="text-white font-medium">{value}</div>
  </div>
)

type Props = {
  onValidationChange: (isValid: boolean) => void
}

const PositionSummary: React.FC<Props> = (props: Props) => {
  const { onValidationChange } = props
  const { collTokenData, form } = usePositionFormContext()
  
  const formatBigInt = (value: bigint, decimals: number) => {
    if (value === 0n) return '0'
    const divisor = BigInt(10 ** decimals)
    const integerPart = value / divisor
    const fractionalPart = value % divisor
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
    return `${integerPart}.${fractionalStr}`
  }

  const formatPercentage = (value: bigint) => {
    return (Number(value) / 10000).toFixed(2) + '%'
  }

  useEffect(() => {
    onValidationChange(true)
  }, [onValidationChange])

  return (
    <div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50">
      <div className="text-lg font-bold text-center mb-6">Position Summary</div>
      
      <div className="space-y-2">
        <SummaryRow 
          label="Collateral Token" 
          value={`${collTokenData.symbol} (${collTokenData.address})`}
        />
        
        <SummaryRow 
          label="Minimum Collateral" 
          value={`${Number(formatBigInt(form.minCollAmount, Number(collTokenData.decimals))).toString()} ${collTokenData.symbol}`}
        />
        
        <SummaryRow 
          label="Initial Collateral" 
          value={`${Number(formatBigInt(form.initialCollAmount, Number(collTokenData.decimals))).toString()} ${collTokenData.symbol}`}
        />
        
        <SummaryRow 
          label="Initialization Period" 
          value={`${form.initPeriod.toString()} days`}
        />
        
        <SummaryRow 
          label="Minting Limit" 
          value={`${Number(formatBigInt(form.limitAmount, 18)) % 1 === 0 ? Number(formatBigInt(form.limitAmount, 18)).toFixed(0) : Number(formatBigInt(form.limitAmount, 18)).toFixed(2)} OFD`}
        />
        
        <SummaryRow 
          label="Annual Interest Rate" 
          value={formatPercentage(form.interest)}
        />
        
        <SummaryRow 
          label="Maturity Period" 
          value={`${form.maturity.toString()} days`}
        />

        <SummaryRow 
          label="Liquidation Price" 
          value={`${Number(formatBigInt(form.liqPrice, Number(collTokenData.decimals))).toString()} OFD`}
        />

        <SummaryRow 
          label="Retained Reserve" 
          value={formatPercentage(form.buffer)}
        />

        <SummaryRow 
          label="Auction Duration" 
          value={`${form.auctionDuration.toString()} hours`}
        />
      </div>
      
      <div className="mt-6 text-sm text-gray-400 text-center">
        Please review all details carefully before proceeding with the position creation.
      </div>
    </div>
  )
}

export default PositionSummary