import { gql, useQuery } from '@apollo/client'
import { Address, getAddress } from 'viem'
import { useChainId } from 'wagmi'

export interface ChallengeQuery {
	position: Address
	challenger: Address
	number: bigint
	start: bigint
	duration: bigint
	size: bigint
	filledSize: bigint
	acquiredCollateral: bigint
	status: string
}

interface Props {
	position?: Address
	challenger?: Address
}

export const useChallengeLists = ({ position }: Props) => {
	const chainId = useChainId()

	const { data, loading } = useQuery(
		gql`query GetChallenges($chainId: String!) {
      challenges (
        orderBy: "status",
        where: {
        	chainId: $chainId,
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
          status
        }
      }
    }`,
		{
			variables: { chainId: chainId.toString() },
			fetchPolicy: 'no-cache',
		}
	)

	const challenges: ChallengeQuery[] = []
	if (data && data.challenges) {
		data.challenges.items.forEach((challenge: any) => {
			challenges.push({
				acquiredCollateral: BigInt(challenge.acquiredCollateral),
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
