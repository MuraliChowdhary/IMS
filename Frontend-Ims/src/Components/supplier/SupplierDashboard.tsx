// pages/SupplierDashboard.jsx
// import React from 'react';

import MetricCard from './MetricCard';
import OrdersTable from './OrderTable';
import Sidebar from './Sidebar';

function SupplierDashboard() {
  // Mock data for metrics
  const metrics = [
    { title: "Total Orders", value: "45", change: "+5 from last month", icon: "📦" },
    { title: "Pending QC", value: "12", change: "Needs attention", icon: "⚠️", isNegative: true },
    { title: "In Production", value: "18", change: "+3 in progress", icon: "🏭" },
    { title: "Shipped Orders", value: "15", change: "+10% from last month", icon: "🚚" },
  ];

   

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar  />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Supplier Dashboard</h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              icon={metric.icon}
              isNegative={metric.isNegative}
            />
          ))}
        </div>

        {/* Orders Table */}
        <OrdersTable />
      </div>
    </div>
  );
}

export default SupplierDashboard;