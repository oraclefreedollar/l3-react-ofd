import SavingsGlobalCard from "components/Savings/SavingsGlobalCard";
import SavingsInteractionCard from "components/Savings/SavingsInteractionCard";
import SavingsInterestTable from "components/Savings/SavingsInterestTable";
import SavingsSavedTable from "components/Savings/SavingsSavedTable";
import SavingsWithdrawnTable from "components/Savings/SavingsWithdrawnTable";
import Head from "next/head";
import { useEffect } from "react";
import { store } from "../redux/redux.store";
import { fetchSavings } from "../redux/slices/savings.slice";
import { useAccount } from "wagmi";

export default function SavingsPage() {
	const { address } = useAccount();

	useEffect(() => {
		store.dispatch(fetchSavings(address));
	}, [address]);

	return (
		<>
			<Head>
				<title>OFD - Savings</title>
			</Head>

			<SavingsGlobalCard />

			<SavingsInteractionCard />

			<AppTitle title="Recent Deposits" />

			<SavingsSavedTable />

			<AppTitle title="Recent Interest Claims" />

			<SavingsInterestTable />

			<AppTitle title="Recent Withdrawals" />

			<SavingsWithdrawnTable />
		</>
	);
}