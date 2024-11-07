import { gql, useQuery } from '@apollo/client'
import { Address, getAddress } from 'viem'

export interface PositionQuery {
	closed: boolean
	collateral: Address
	collateralBalance: bigint
	created: number
	denied: boolean
	ofd: Address
	owner: Address
	position: Address
	price: bigint
}

export const usePositionLists = () => {
	const { data, loading } = useQuery(
		gql`
			query {
				positions(orderBy: "limitForClones", orderDirection: "desc") {
					items {
						id
						position
						owner
						ofd
						collateral
						price
						created
						limitForClones
						collateralBalance
						denied
						closed
					}
				}
			}
		`,
		{
			fetchPolicy: 'no-cache',
		}
	)

	const positions: PositionQuery[] = []
	if (data && data.positions) {
		data.positions.items.forEach((position: any) => {
			positions.push({
				closed: position.closed,
				collateral: getAddress(position.collateral),
				collateralBalance: BigInt(position?.collateralBalance),
				created: position.created,
				denied: position.denied,
				ofd: getAddress(position.ofd),
				owner: getAddress(position.owner),
				position: getAddress(position.position),
				price: BigInt(position.price),
			})
		})
	}

	return {
		loading,
		positions,
	}
}
