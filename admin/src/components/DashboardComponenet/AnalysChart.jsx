import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TransactionChart = ({ data }) => {
  return (
    <div className="admin-card h-[22rem] w-full py-4">
      <strong className="px-4 font-semibold text-slate-800">Monthly Orders</strong>
      <div className=" border-gray-200 rounded-sm mt-3 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
          >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Orders_In_Month" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionChart;
