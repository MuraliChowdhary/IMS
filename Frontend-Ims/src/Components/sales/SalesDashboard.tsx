import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import SalesOverview from "./SalesOverview";
import TopCustomers from "./TopCustomers";
import NavBar from "./NavBar";
import { BACKEND_URL } from "../../../Config";
import axios from "axios";
export function SalesDashboard() {
  const [totalSales, setTotalSales] = useState(0);
  // const [newCustomers, setNewCustomers] = useState(0);
  // const [topCustomers, setTopCustomers] = useState([]);
  // const [salesOverview, setSalesOverview] = useState([]);
  const [lowstock, setLowStock] = useState([]);
  const [revenue, setRevenue] = useState(0);
  // const [trend,setTrend]=useState(0)
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTotalSales() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/sales/overview`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.status === 200) {
          console.log(response.data.totalSales);

          setTotalSales(response.data.totalSales);
          setRevenue(response.data.totalRevenue);
          setIsLoading(false);
          //setTrend(response.data.salesTrend)
        }
      } catch (error) {
        console.error("Error fetching total sales:", error);
      }
    }

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
        if (response.status === 200) {
          // setNewCustomers(response.data.newCustomers);
          // setTopCustomers(response.data.repeatCustomers);
          setTotalCustomer(response.data.totalCustomers);
        }
      } catch (error) {
        console.error("Error fetching new customers:", error);
      }
    }

    // async function fetchSalesOverview() {
    //   try {
    //     const response = await axios.get(`${BACKEND_URL}/api/sales/overview`, {
    //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    //     });
    //     if (response.status === 200) setSalesOverview(response.data.salesOverview);
    //   } catch (error) {
    //     console.error("Error fetching sales overview:", error);
    //   }
    // }

    async function fetchLowStock() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/sales/lowstock`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.status === 200) {
          console.log(response.data.summary);
          setLowStock(response.data.data.summary.totalLowStock);
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    }

    fetchTotalSales();
    fetchNewCustomers();
    //fetchSalesOverview();
    fetchLowStock();
  }, []); // Runs once on component mount

  if (isLoading) {
    return (
      <div className="flex justify-center h-screen flex-col items-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-screen">
      <NavBar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Sales Manager SalesDashboard</h1>
          <button className="text-gray-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Sales"
            value={totalSales.toString()}
            change="+20.1%"
            sinceText="from last month"
            icon="$"
          />
          {/* <StatCard
            title="New Customers"
            value="+573"
            change="+201"
            sinceText="since last month"
            icon="👤"
          /> */}
          <StatCard
            title="Total Revenue"
            value={revenue.toFixed(2).toString()}
            change="+201"
            sinceText="since last month"
            icon="👤"
          />
          <StatCard
            title="Total Customers"
            value={totalCustomer.toString()}
            change="+4"
            sinceText="since last week"
            icon="📄"
          />
          <StatCard
            title="low stock"
            value={lowstock.toString()}
            change="+4%"
            sinceText="since last month"
            icon="📈"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesOverview />
          </div>
          <div>
            <TopCustomers />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesDashboard;
