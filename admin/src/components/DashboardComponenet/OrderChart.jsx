import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE'];

export default function OrderChart({ Completed, Pending, Rejected, Stock_Not_Available }) {
    const data = [
        { name: 'Completed', value: Completed },
        { name: 'Stock Not Available', value: Stock_Not_Available },
        { name: 'Rejected', value: Rejected },
        { name: 'Pending', value: Pending },
    ];
    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    return (
        <div className="admin-card flex h-[22rem] w-full flex-col p-4">
            <strong className="font-semibold text-slate-800">Orders Diagram</strong>
            <div className="mt-3 w-full flex-1 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={300}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={105}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
