import { useEffect, useState } from "react";
import NavBar from "./NavBar";

interface Customer {
  id: number;
  name: string;
  email: string;
  orderCount: number;
  totalAmount: number;
}

export const CustomerSales = () => {
  const [total, setTotal] = useState(0);
  // const [newCustomers, setNewCustomers] = useState(0);
  const [topCustomers, setTopCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("customerData");
    const customerData = data ? JSON.parse(data) : null;

    if (customerData) {
      setTotal(customerData.totalCustomers);
      //setNewCustomers(customerData.newCustomers);
      setTopCustomers(customerData.repeatCustomers);
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-full md:w-1/6 bg-white shadow-md md:min-h-screen p-4">
        <NavBar />
      </div>

      <div className="flex flex-col items-center md:w-3/4 lg:ml-5 w-full p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg mt-5 w-full max-w-3xl">
          <h2 className="text-xl font-bold mb-1">Top Customers</h2>
          <p className="text-gray-500 text-sm mb-6">
            You made {total} sales this month.
          </p>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-2">
              <span className="font-bold text-gray-700">Customer</span>
              <span className="font-bold text-gray-700 text-center">
                Orders
              </span>
              <span className="font-bold text-gray-700 text-right">
                Total Spent
              </span>
            </div>

            {topCustomers.map((customer) => (
              <div
                key={customer.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-700">{customer.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{customer.name}</h3>
                    <p className="text-gray-500 text-sm">{customer.email}</p>
                  </div>
                </div>

                <div className="text-center font-medium">
                  {customer.orderCount}
                </div>

                <div className="text-right font-medium">
                  ${customer.totalAmount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
