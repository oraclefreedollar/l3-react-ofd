import { gql } from '@apollo/client'
import { NextApiResponse } from 'next'
import { getAddress } from 'viem'
import { clientPonder } from 'app.config'

import { PositionQuery } from 'meta/positions'

type HandlerParams = { chainId: number }

export async function fetchPositions(props: HandlerParams): Promise<PositionQuery[]> {
	const { chainId } = props

	const { data } = await clientPonder.query({
		query: gql`
			query {
				positions(orderBy: "availableForClones", orderDirection: "desc", where: { chainId: "${chainId}" }) {
					items {
						position
						owner
						ofd
						collateral
						cooldown
						price

						created
						isOriginal
						isClone
						denied
						closed
						original

						minimumCollateral
						riskPremiumPPM
						reserveContribution
						start

						expiration
						challengePeriod

						ofdName
						ofdSymbol
						ofdDecimals

						collateralName
						collateralSymbol
						collateralDecimals
						collateralBalance

						limitForClones
						availableForMinting
						availableForClones
						minted
					}
				}
			}
		`,
	})
	// console.log(data.positions);
	if (!data || !data.positions) {
		return []
	}

	const list: PositionQuery[] = []
	if (data && data.positions) {
		for (const p of data.positions.items) {
			list.push({
				position: getAddress(p.position),
				owner: getAddress(p.owner),
				ofd: p.ofd && getAddress(p?.ofd).toLowerCase(),
				collateral: getAddress(p.collateral),
				price: p.price,

				created: p.created,
				isOriginal: p.isOriginal,
				isClone: p.isClone,
				denied: p.denied,
				closed: p.closed,
				original: getAddress(p.original),

				minimumCollateral: p.minimumCollateral,
				riskPremiumPPM: p.riskPremiumPPM,
				reserveContribution: p.reserveContribution,
				start: p.start,
				cooldown: p.cooldown,
				expiration: p.expiration,
				challengePeriod: p.challengePeriod,

				ofdName: p.ofdName,
				ofdSymbol: p.ofdSymbol,
				ofdDecimals: p.ofdDecimals,

				collateralName: p.collateralName,
				collateralSymbol: p.collateralSymbol,
				collateralDecimals: p.collateralDecimals,
				collateralBalance: p.collateralBalance,

				// TODO: check if limit is required
				//limit: p.limit,
				limitForClones: p.limitForClones,
				availableForMinting: p.availableForMinting,
				availableForClones: p.availableForClones,
				minted: p.minted,
			})
		}
	}

	// console.log("List:", list);
	return list
}

export default async function handler(props: HandlerParams, res: NextApiResponse<Array<PositionQuery>>) {
	res.status(200).json(await fetchPositions(props))
}
