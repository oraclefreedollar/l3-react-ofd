import TableHeader from "../Table/TableHead";
import TableBody from "../Table/TableBody";
import Table from "../Table";
import TableRowEmpty from "../Table/TableRowEmpty";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/redux.store";
import { Address, formatUnits } from "viem";
import MonitoringRow from "./MonitoringRow";
import { useMemo } from "react";
import { ChallengesQueryItem } from "redux/slices/challenges.types";
import { PositionQuery } from "redux/slices/positions.types";
export default function MonitoringTable() {
    const headers: string[] = ["Collateral", "Collateralization", "Expiration", "Challenged"];

    const { openPositions } = useSelector((state: RootState) => state.positions);
    const challenges = useSelector((state: RootState) => state.challenges.positions);
    const { coingecko } = useSelector((state: RootState) => state.prices);

    // Combine position data with challenges data
    const enrichedPositions = useMemo(() => {
        return openPositions.map((position: PositionQuery) => {
            // Get active challenges for this position
            const positionChallenges: ChallengesQueryItem[] =
                challenges.map[position.position.toLowerCase() as Address]?.filter(
                    (c) => c.status === "Active"
                ) || [];

            // Calculate total challenge size
            const totalChallengeSize = positionChallenges.reduce((total, challenge) => {
                const size = parseFloat(formatUnits(BigInt(challenge.size.toString()), position.collateralDecimals));
                const filled = parseFloat(formatUnits(BigInt(challenge.filledSize.toString()), position.collateralDecimals));
                return total + (size - filled);
            }, 0);

            // Calculate collateral value
            const collateralSize = parseFloat(formatUnits(BigInt(position.collateralBalance), position.collateralDecimals));
            const collateralPrice = coingecko[position.collateral.toLowerCase() as Address]?.price?.usd || 1;
            const collateralValue = collateralSize * collateralPrice;

            return {
                ...position,
                activeChallenges: positionChallenges,
                totalChallengeSize,
                challengeRatio: totalChallengeSize / collateralSize,
                collateralValue
            };
        });
    }, [openPositions, challenges.map, coingecko]);

    return (
        <Table>
            <TableHeader actionCol={true} headers={headers} />
            <TableBody>
                {enrichedPositions.length === 0 ? (
                    <TableRowEmpty>{"There are no active positions."}</TableRowEmpty>
                ) : (
                    enrichedPositions.map((pos) => (
                        <MonitoringRow
                            key={pos.position}
                            position={pos as PositionQuery}
                        />
                    ))
                )}
            </TableBody>
        </Table>
    );
}