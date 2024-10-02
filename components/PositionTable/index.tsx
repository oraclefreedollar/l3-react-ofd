import { useSelector } from "react-redux";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { RootState } from "../../redux/redux.store";
import { PositionQuery } from "../../redux/slices/positions.types";
import Table from "../Table";
import TableBody from "../Table/TableBody";
import TableHeader from "../Table/TableHead";
import TableRowEmpty from "../Table/TableRowEmpty";
import PositionRow from "./PositionRow";

interface Props {
	showMyPos?: boolean;
}

export default function PositionTable({ showMyPos }: Props) {
	const { openPositionsByCollateral } = useSelector((state: RootState) => state.positions);
	// console.log({ openPositionsByCollateral });
	const { address } = useAccount();
	const account = address || zeroAddress;
	const openPositions: PositionQuery[] = [];

	// console.log("Account:", account);

	for (const collateral in openPositionsByCollateral) {
		openPositions.push(...openPositionsByCollateral[collateral]);
	}
	const matchingPositions = openPositions.filter((position) =>
		showMyPos ? position.owner == account : position.owner != account && !position.denied && !position.closed
	);

	// console.log({ matchingPositions, showMyPos });

	return (
		<Table>
			<TableHeader headers={["Collateral", "Liquidation Price", "Available Amount"]} actionCol />
			<TableBody>
				{matchingPositions.length == 0 ? (
					<TableRowEmpty>{showMyPos ? "You don't have any positions." : "There are no other positions yet."}</TableRowEmpty>
				) : (
					matchingPositions.map((pos, index) => <PositionRow position={pos} key={index} />)
				)}
			</TableBody>
		</Table>
	);
}
