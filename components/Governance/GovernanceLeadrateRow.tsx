import { Hash } from "viem";
import TableRow from "../Table/TableRow";
import { formatCurrency } from "../../utils/format";
import { AddressLabelSimple, TxLabelSimple } from "components/AddressLabel";
import { useState } from "react";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { WAGMI_CHAIN, WAGMI_CONFIG } from "../../app.config";
import { ADDRESS, ABIS } from "contracts";
import { ApiLeadrateInfo, LeadrateProposed } from "redux/slices/savings.types";
import Button from "components/Button";
import GuardToAllowedChainBtn from "components/Guards/GuardToAllowedChainBtn";
import { toast } from "react-toastify";
import { renderErrorToast, TxToast } from "components/TxToast";

interface Props {
	info: ApiLeadrateInfo;
	proposal: LeadrateProposed;
	currentProposal: boolean;
}

export default function GovernanceLeadrateRow({ info, proposal, currentProposal }: Props) {
	const [isDenying, setDenying] = useState<boolean>(false);
	const [isApplying, setApplying] = useState<boolean>(false);
	const [isHidden, setHidden] = useState<boolean>(false);

	const chainId = WAGMI_CHAIN.id;

	const vetoUntil = proposal.nextChange * 1000;
	const hoursUntil: number = (vetoUntil - Date.now()) / 1000 / 60 / 60;
	const stateStr: string = `${Math.round(hoursUntil)} hours left`;

	const dateArr: string[] = new Date(proposal.created * 1000).toDateString().split(" ");
	const dateStr: string = `${dateArr[2]} ${dateArr[1]} ${dateArr[3]}`;

	const handleOnApply = async function () {
		try {
			setApplying(true);

			const writeHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].savings,
				abi: ABIS.SavingsABI,
				functionName: "applyChange",
				args: [],
			});

			const toastContent = [
				{
					title: `From: `,
					value: `${formatCurrency(info.rate / 10000)}%`,
				},
				{
					title: `Applying to: `,
					value: `${formatCurrency(proposal.nextRate / 10000)}%`,
				},
				{
					title: "Transaction: ",
					hash: writeHash,
				},
			];

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: writeHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Applying new rate...`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title="Successfully applied" />,
				},
			});

			setHidden(true);
		} catch (error) {
			toast.error(renderErrorToast(error));
		} finally {
			setApplying(false);
		}
	};

	const handleOnDeny = async function () {
		try {
			setDenying(true);

			const writeHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].savings,
				abi: ABIS.SavingsABI,
				functionName: "proposeChange",
				args: [info.rate, []],
			});

			const toastContent = [
				{
					title: `Current: `,
					value: `${formatCurrency(info.rate / 10000)}%`,
				},
				{
					title: `Denying: `,
					value: `${formatCurrency(proposal.nextRate / 10000)}%`,
				},
				{
					title: "Transaction: ",
					hash: writeHash,
				},
			];

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: writeHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Denying new rate...`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title="Successfully denied" />,
				},
			});

			setHidden(true);
		} catch (error) {
			toast.error(renderErrorToast(error));
		} finally {
			setDenying(false);
		}
	};

	return (
		<>
			<TableRow
				actionCol={
					currentProposal ? (
						info.isPending && info.isProposal ? (
							<GuardToAllowedChainBtn>
								<Button
									className="h-10"
									disabled={!info.isPending || !info.isProposal || isHidden}
									isLoading={isDenying}
									onClick={handleOnDeny}
								>
									Deny
								</Button>
							</GuardToAllowedChainBtn>
						) : (
							<GuardToAllowedChainBtn>
								<Button
									className="h-10"
									disabled={!info.isProposal || isHidden}
									isLoading={isApplying}
									onClick={handleOnApply}
								>
									Apply
								</Button>
							</GuardToAllowedChainBtn>
						)
					) : (
						<></>
					)
				}
			>
				<div className="flex flex-col md:text-left max-md:text-right">
					<TxLabelSimple label={dateStr} showLink tx={proposal.txHash as Hash} />
				</div>

				<div className="flex flex-col">
					<AddressLabelSimple address={proposal.proposer} showLink />
				</div>

				<div className={`flex flex-col ${currentProposal && info.isProposal ? "font-semibold" : ""}`}>
					{proposal.nextRate / 10_000} %
				</div>

				<div className="flex flex-col">
					{currentProposal ? (hoursUntil > 0 ? stateStr : info.rate != proposal.nextRate ? "Ready" : "Passed") : "Expired"}
				</div>
			</TableRow>
		</>
	);
}