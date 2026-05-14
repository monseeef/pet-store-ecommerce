import { IoPeople, IoCart, IoCheckmarkCircle } from 'react-icons/io5'
import { FaProductHunt } from "react-icons/fa6";
import { useSelector } from 'react-redux';

const statCards = [
	{
		label: "Completed Orders",
		keyName: "completedOrders",
		icon: IoCheckmarkCircle,
		gradient: "from-emerald-500 to-teal-500",
		accent: "bg-emerald-50 text-emerald-700",
	},
	{
		label: "Products",
		keyName: "CountProducts",
		icon: FaProductHunt,
		gradient: "from-amber-500 to-orange-500",
		accent: "bg-amber-50 text-amber-700",
	},
	{
		label: "Total Customers",
		keyName: "customer",
		icon: IoPeople,
		gradient: "from-sky-500 to-indigo-500",
		accent: "bg-sky-50 text-sky-700",
	},
	{
		label: "Total Orders",
		keyName: "orders",
		icon: IoCart,
		gradient: "from-slate-800 to-slate-950",
		accent: "bg-slate-100 text-slate-700",
	},
];

export default function DashboardStatsGrid({customer , CountProducts, orders, completedOrders }) {
    const isLoading = useSelector(state => state.orders.isLoading);
	const values = { customer, CountProducts, orders, completedOrders };
    
    if (isLoading) {
        return <div className="admin-empty-state">Loading dashboard metrics...</div>;
    }

	return (
		<div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
			{statCards.map(({ label, keyName, icon: Icon, gradient, accent }, index) => (
				<BoxWrapper key={label} index={index}>
					<div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-amber-950/10`}>
						<Icon className="text-2xl" />
					</div>
					<div className="min-w-0">
						<span className={`admin-badge ${accent}`}>Live metric</span>
						<p className="mt-3 text-sm font-semibold text-slate-500">{label}</p>
						<strong className="mt-1 block text-3xl font-black tracking-tight text-slate-950">
							{values[keyName] ?? 0}
						</strong>
					</div>
				</BoxWrapper>
			))}
		</div>
	)
}

function BoxWrapper({ children, index }) {
	return (
		<div
			className="admin-card group relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/10"
			style={{ animationDelay: `${index * 80}ms` }}
		>
			<div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-100/70 blur-2xl transition group-hover:bg-orange-100" />
			<div className="relative z-10 flex items-center gap-4">
				{children}
			</div>
		</div>
	);
}
