import { gql, useQuery } from '@apollo/client'
import { Address, getAddress } from 'viem'

export interface ChallengeQuery {
	position: Address
	challenger: Address
	number: bigint
	start: bigint
	duration: bigint
	size: bigint
	filledSize: bigint
	acquiredCollateral: bigint
	bid: bigint
	status: string
}

interface Props {
	position?: Address
	challenger?: Address
}

export const useChallengeLists = ({ position }: Props) => {
	const { data, loading } = useQuery(
		gql`query {
      challenges (
        orderBy: "status",
        where: {
          ${position ? `position: "${position}",` : ''}
        }
      ) {
        items {
          id
          challenger
          position
          start
          duration
          size
          filledSize
          acquiredCollateral
          number
          bid
          status
        }
      }
    }`,
		{
			fetchPolicy: 'no-cache',
		}
	)

	const challenges: ChallengeQuery[] = []
	if (data && data.challenges) {
		data.challenges.items.forEach((challenge: any) => {
			challenges.push({
				acquiredCollateral: BigInt(challenge.acquiredCollateral),
				bid: BigInt(challenge.bid),
				challenger: getAddress(challenge.challenger),
				duration: BigInt(challenge.duration),
				filledSize: BigInt(challenge.filledSize),
				number: BigInt(challenge.number),
				position: getAddress(challenge.position),
				size: BigInt(challenge.size),
				start: BigInt(challenge.start),
				status: challenge.status,
			})
		})
	}

	challenges.sort((a, b) => {
		if (a.status === b.status) return a.start > b.start ? 1 : -1
		else return a.status > b.status ? 1 : -1
	})

	return { challenges, loading }
}
