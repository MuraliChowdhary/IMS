import axios from "axios";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../../Config";

interface Customer {
  id: number;
  name: string;
  email: string;
  orderCount: number;
  totalAmount: number;
}

export function TopCustomers() {
  const [total, setTotal] = useState(0);
  //const [newCustomers, setNewCustomers] = useState(0);
  const [topCustomers, setTopCustomers] = useState<Customer[]>([]);
  useEffect(() => {
    async function fetchNewCustomers() {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/sales/salesbycustomer`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const customerDatarelatedtosales = localStorage.setItem(
          "customerData",
          JSON.stringify(response.data)
        );
        console.log(customerDatarelatedtosales);
        if (response.status === 200) {
          //setNewCustomers(response.data.newCustomers);
          setTopCustomers(response.data.repeatCustomers);
          setTotal(response.data.totalCustomers);
        }
      } catch (error) {
        console.error("Error fetching new customers:", error);
      }
    }

    fetchNewCustomers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-1">Top Customers</h2>
      <p className="text-gray-500 text-sm mb-6">
        You made {total} sales this month.
      </p>

      <div className="space-y-6">
        {topCustomers.map((customer) => (
          <div key={customer.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-gray-600">{customer.name[0]}</span>
              </div>
              <div>
                <h3 className="font-medium">{customer.name}</h3>
                <p className="text-gray-500 text-sm">{customer.email}</p>
              </div>
            </div>
            <div className="font-medium">{customer.orderCount}</div>
            <div className="font-medium">{customer.totalAmount.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopCustomers;
