import { gql, useQuery } from '@apollo/client'
import { Address, getAddress } from 'viem'

export interface PositionQuery {
	position: Address
	owner: Address
	ofd: Address
	collateral: Address
	price: bigint
	created: number
	denied: boolean
	closed: boolean
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
				position: getAddress(position.position),
				owner: getAddress(position.owner),
				ofd: getAddress(position.ofd),
				collateral: getAddress(position.collateral),
				price: BigInt(position.price),
				created: position.created,
				denied: position.denied,
				closed: position.closed,
			})
		})
	}

	return {
		loading,
		positions,
	}
}
