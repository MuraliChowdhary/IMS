// import React, { useState, useEffect } from 'react';

// function SalesChart() {
//   const [isVisible, setIsVisible] = useState(false);

//   // Mock data for the chart
//   const monthlyData = [
//     { month: 'Jan', amount: 4000 },
//     { month: 'Feb', amount: 3000 },
//     { month: 'Mar', amount: 5000 },
//     { month: 'Apr', amount: 4300 },
//     { month: 'May', amount: 6000 },
//     { month: 'Jun', amount: 5400 },
//     { month: 'Jul', amount: 7000 },
//   ];

//   const maxAmount = 8000;

//   // Animation effect when component mounts
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 100);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-sm">
//       <h2 className="text-xl font-bold">Sales Overview</h2>
//       <p className="text-gray-500 text-sm mb-6">Monthly sales performance</p>

//       <div className="h-64 relative">
//         <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-gray-500 text-sm">
//           <div>8000</div>
//           <div>6000</div>
//           <div>4000</div>
//           <div>2000</div>
//           <div>0</div>
//         </div>
//         <div className="pl-16 flex items-end h-full">
//           {monthlyData.map((item, index) => (
//             <div key={index} className="flex flex-col items-center flex-1">
//               <div
//                 className={`w-4/5 bg-blue-500 rounded-sm transition-all duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
//                 style={{
//                   height: isVisible ? `${(item.amount / maxAmount) * 100}%` : '0%',
//                   transitionDelay: `${index * 50}ms`
//                 }}
//               ></div>
//               <div className="text-gray-500 text-xs mt-2">{item.month}</div>
//             </div>
//           ))}
//         </div>
//         <div className="absolute bottom-6 left-0 text-xs text-blue-500">sales</div>
//       </div>
//     </div>
//   );
// }

// export default SalesChart;

//import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";

const data = [
  { month: "Jan", amount: 3200 },
  { month: "Feb", amount: 4100 },
  { month: "Mar", amount: 6000 },
  { month: "Apr", amount: 2700 },
  { month: "May", amount: 4200 },
  { month: "Jun", amount: 5400 },
  { month: "Jul", amount: 2000 },
  { month: "Aug", amount: 1000 },
  { month: "Sep", amount: 3000 },
  { month: "Oct", amount: 4100 },
  { month: "Nov", amount: 2800 },
  { month: "Dec", amount: 2800 },
];

export function SalesOverview() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="text-blue-600 mr-2" size={20} />
          <h2 className="text-xl font-bold">Sales Overview</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center text-sm text-gray-500 hover:text-blue-600">
            <Calendar size={16} className="mr-1" />
            <span>2025</span>
          </button>
          <button className="flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
            <TrendingUp size={16} className="mr-1" />
            <span>Monthly</span>
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: -20, bottom: 5 }}
        >
          <YAxis
            tick={{ fill: "#888" }}
            tickFormatter={(value) => `$${value}`}
            domain={[0, 6000]}
          />
          <XAxis dataKey="month" tick={{ fill: "#888" }} />
          <Tooltip
            formatter={(value) => [`$${value}`, "Sales"]}
            cursor={{ fill: "transparent" }}
          />
          <Bar
            dataKey="amount"
            fill="#6572fe"
            barSize={30}
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesOverview;
