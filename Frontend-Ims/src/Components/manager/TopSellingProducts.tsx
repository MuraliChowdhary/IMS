// import React from 'react';

function TopSellingProducts() {
  const products = [
    {
      product: "Smartphone X",
      sales: "120 units",
      inventory: "45 units",
      status: "in Stock",
    },
    {
      product: "Wireless Earbuds",
      sales: "95 units",
      inventory: "30 units",
      status: "in Stock",
    },
    {
      product: "Smart Watch",
      sales: "85 units",
      inventory: "25 units",
      status: "in Stock",
    },
    {
      product: "Laptop Pro",
      sales: "70 units",
      inventory: "15 units",
      status: "Low Stock",
    },
    {
      product: "Bluetooth Speaker",
      sales: "65 units",
      inventory: "20 units",
      status: "Low Stock",
    },
  ];

  // interface Product {
  //     product: string;
  //     sales: string;
  //     inventory: string;
  //     status: string;
  // }

  const statusColor = (status: string): string =>
    status === "in Stock"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="pb-3">Product</th>
              <th className="pb-3">Sales</th>
              <th className="pb-3">Inventory</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td className="py-4">{item.product}</td>
                <td className="py-4">{item.sales}</td>
                <td className="py-4">{item.inventory}</td>
                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${statusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopSellingProducts;
