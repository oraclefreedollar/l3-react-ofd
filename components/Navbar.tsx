import Link from 'next/link'
import { useAccount } from 'wagmi'
import NavButton from './NavButton'
import WalletConnect from './WalletConnect'

export default function Navbar() {
	const network = useAccount()
	const chainId = network.chain?.id
	// console.log(chainId);

	return (
		<div className="fixed top-0 left-0 right-0 z-10 backdrop-blur border-b border-gray-400">
			<header className="flex items-center p-2 sm:gap-x-4 md:p-4 relative w-full">
				<Link className="" href="/">
					<picture>
						<img alt="Logo" className="h-9 transition" src="/assets/oracle-free-dollar-logo-square.svg" />
					</picture>
				</Link>

				<ul className="justify-left hidden flex-1 gap-2 md:flex lg:gap-3 xl:w-1/2">
					<li>
						<NavButton name="Swap" to="/swap" />
					</li>
					<li>
						<NavButton name="Collateral" to="/collateral" />
					</li>
					<li>
						<NavButton name="Positions" to="/positions" />
					</li>
					<li>
						<NavButton name="Auctions" to="/auctions" />
					</li>
					<li>
						<NavButton name="Equity" to="/pool" />
					</li>
					<li>
						<NavButton name="Governance" to="/governance" />
					</li>
					{chainId == 97 && (
						<li>
							<NavButton name="Faucet" to="/faucet" />
						</li>
					)}
				</ul>
				<div className="flex flex-1 justify-end items-center">
					<WalletConnect />
				</div>

				<aside className="flex w-10 h-10 sm:hidden">
					<div className="flex items-center">
						<label className="absolute z-20 cursor-pointer px-3 py-6" htmlFor="ss-mobile-menu">
							<input className="peer hidden" id="ss-mobile-menu" type="checkbox" />
							<div className="before:bg-white after:bg-white block h-[1px] content-[''] relative w-7 bg-transparent peer-checked:bg-transparent z-30 before:peer-checked:transform before:peer-checked:rotate-45 before:peer-checked:top-0 before:peer-checked:w-full after:peer-checked:transform after:peer-checked:-rotate-45 after:peer-checked:bottom-0 after:peer-checked:w-full before:block before:h-full before:w-full before:absolute before:content-[''] before:transition-all before:ease-out before:duration-200 before:top-[-0.35rem] before:z-30 after:block after:h-full after:w-full after:right-0 after:absolute after:content-[''] after:transition-all after:ease-out after:duration-200 after:bottom-[-0.35rem]" />
							<div className="fixed inset-0 hidden h-screen w-full bg-gray-800/50 backdrop-blur-sm peer-checked:block"></div>
							<div className="fixed top-0 right-0 h-screen translate-x-full overflow-y-auto overscroll-y-none transition duration-500 peer-checked:translate-x-0 peer-checked:shadow-heading">
								<div className="float-right min-h-full w-full bg-slate-800 opacity-90 backdrop-blur px-6 pt-12 shadow-2xl">
									<menu className="mt-8 mb-8 flex flex-col text-heading">
										<li>
											<NavButton name="Swap" to="/swap" />
										</li>
										<li>
											<NavButton name="Collateral" to="/collateral" />
										</li>
										<li>
											<NavButton name="Positions" to="/positions" />
										</li>
										<li>
											<NavButton name="Auctions" to="/auctions" />
										</li>
										<li>
											<NavButton name="Equity" to="/pool" />
										</li>
										<li>
											<NavButton name="Governance" to="/governance" />
										</li>
									</menu>
								</div>
							</div>
						</label>
					</div>
				</aside>
			</header>
		</div>
	)
}
