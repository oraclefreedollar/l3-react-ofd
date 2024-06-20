import { gql } from "@apollo/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getAddress } from "viem";
import { clientPonder } from "../../app.config";
import { PositionQuery } from "../../redux/slices/positions.types";

export async function fetchPositions(): Promise<PositionQuery[]> {
	const { data } = await clientPonder.query({
		query: gql`
			query {
				positions(orderBy: "availableForClones", orderDirection: "desc") {
					items {
						position
						owner
						zchf
						collateral
						price

						created
						isOriginal
						isClone
						denied
						closed
						original

						minimumCollateral
						annualInterestPPM
						reserveContribution
						start

						expiration
						challengePeriod

						zchfName
						zchfSymbol
						zchfDecimals

						collateralName
						collateralSymbol
						collateralDecimals
						collateralBalance

						limitForPosition
						limitForClones
						availableForPosition
						availableForClones
						minted
					}
				}
			}
		`,
	});

	if (!data || !data.positions) {
		return [];
	}

	const list: PositionQuery[] = [];
	if (data && data.positions) {
		data.positions.items.forEach(async (p: PositionQuery) => {
			list.push({
				position: getAddress(p.position),
				owner: getAddress(p.owner),
				ofd: getAddress(p.ofd),
				collateral: getAddress(p.collateral),
				price: p.price,

				created: p.created,
				isOriginal: p.isOriginal,
				isClone: p.isClone,
				denied: p.denied,
				closed: p.closed,
				original: getAddress(p.original),

				minimumCollateral: p.minimumCollateral,
				annualInterestPPM: p.annualInterestPPM,
				reserveContribution: p.reserveContribution,
				start: p.start,
				// cooldown: p.cooldown,
				expiration: p.expiration,
				challengePeriod: p.challengePeriod,

				ofdName: p.ofdName,
				ofdSymbol: p.ofdSymbol,
				ofdDecimals: p.ofdDecimals,

				collateralName: p.collateralName,
				collateralSymbol: p.collateralSymbol,
				collateralDecimals: p.collateralDecimals,
				collateralBalance: p.collateralBalance,

				limitForPosition: p.limitForPosition,
				limitForClones: p.limitForClones,
				availableForPosition: p.availableForPosition,
				availableForClones: p.availableForClones,
				minted: p.minted,
			});
		});
	}

	return list;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	res.status(200).json(await fetchPositions());
}
