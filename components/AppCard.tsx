interface Props {
	children?: React.ReactNode;
	className?: string;
}

export default function AppCard({ className, children }: Props) {
	return (
		<section className={`bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md border-purple-500/50 shadow-lg rounded-xl ${className ?? "p-4 flex flex-col gap-y-4"}`}>{children}</section>
	);
}