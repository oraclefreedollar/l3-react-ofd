import { formatCurrency } from "../../utils/format";
import GuardToAllowedChainBtn from "components/Guards/GuardToAllowedChainBtn";
import Button from "components/Button";
import NormalInput from "components/Input/NormalInput";
import AppCard from "components/AppCard";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/redux.store";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { WAGMI_CONFIG, WAGMI_CHAIN } from "../../app.config";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { ADDRESS, ABIS } from "contracts";
import { renderErrorToast, TxToast } from "components/TxToast";
import { toast } from "react-toastify";

interface Props { }

export default function GovernanceLeadrateCurrent({ }: Props) {
    const [isHandling, setHandling] = useState<boolean>(false);
    const account = useAccount();
    const chainId = WAGMI_CHAIN.id;
    const info = useSelector((state: RootState) => state.savings.leadrateInfo);
    const [newRate, setNewRate] = useState<number>(info.rate || 0);
    const [isHidden, setHidden] = useState<boolean>(false);
    const [isDisabled, setDisabled] = useState<boolean>(true);

    console.log(info);
    useEffect(() => {
        if (newRate != info.rate) setDisabled(false);
        else setDisabled(true);
    }, [newRate, info.rate]);

    if (!info) return null;

    const changeNewRate = (value: string) => {
        // Handle empty or invalid input
        if (!value || value === '') {
            setNewRate(0);
            return;
        }

        // Parse the value and handle invalid numbers
        const n = parseFloat(value);
        if (isNaN(n)) {
            setNewRate(0);
        } else {
            setNewRate(n);
        }
    };

    const handleOnClick = async function () {
        if (!account.address) return;

        try {
            setHandling(true);
            console.log(newRate);

            const writeHash = await writeContract(WAGMI_CONFIG, {
                address: ADDRESS[chainId].savings,
                abi: ABIS.SavingsABI,
                functionName: "proposeChange",
                args: [newRate, []],
            });

            const toastContent = [
                {
                    title: `From: `,
                    value: `${formatCurrency(info.rate / 10000)}%`,
                },
                {
                    title: `Proposing to: `,
                    value: `${formatCurrency(newRate / 10000)}%`,
                },
                {
                    title: "Transaction: ",
                    hash: writeHash,
                },
            ];

            await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: writeHash, confirmations: 1 }), {
                pending: {
                    render: <TxToast rows={toastContent} title={`Proposing rate change...`} />,
                },
                success: {
                    render: <TxToast rows={toastContent} title="Successfully proposed" />,
                },
            });

            setHidden(true);
        } catch (error) {
            toast.error(renderErrorToast(error));
        } finally {
            setHandling(false);
        }
    };

    return (
        <AppCard>
            <div className="grid gap-8 md:grid-cols-2 md:px-12 md:py-4 max-md:grid-cols-1 max-md:p-4">
                <div className="flex flex-col gap-4">
                    <NormalInput
                        digit={4}
                        label="Current value"
                        onChange={(v) => changeNewRate(v)}
                        placeholder={`Current Leadrate: %`}
                        symbol="%"
                        value={newRate === 0 ? '' : newRate.toString()}
                    />
                </div>

                <div className="md:mt-8 md:px-16">
                    <GuardToAllowedChainBtn>
                        <Button
                            className="max-md:h-10 md:h-12"
                            disabled={isDisabled || isHidden}
                            isLoading={isHandling}
                            onClick={handleOnClick}
                        >
                            Propose Change
                        </Button>
                    </GuardToAllowedChainBtn>
                </div>
            </div>
        </AppCard>
    );
}