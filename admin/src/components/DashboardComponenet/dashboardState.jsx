import React from 'react'
import { IoBagHandle, IoPeople, IoCart } from 'react-icons/io5'
import { FaProductHunt } from "react-icons/fa6";
import { useSelector } from 'react-redux';

export default function DashboardStatsGrid({customer , CountProducts, orders, completedOrders }) {
    const isLoading = useSelector(state => state.orders.isLoading);
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

	return (
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
					<IoBagHandle className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-light">Completed Orders</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">{completedOrders}</strong>
						
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
					<FaProductHunt className="text-2xl text-white" />
					
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-light">Products</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">{CountProducts}</strong>
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
					<IoPeople className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-light">Total Customers</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">{customer}</strong>
						
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
					<IoCart className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-light">Total Orders</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">{orders}</strong>
						
					</div>
				</div>
			</BoxWrapper>
		</div>
	)
}

function BoxWrapper({ children }) {
	return <div className="admin-card flex items-center p-5">{children}</div>
}
