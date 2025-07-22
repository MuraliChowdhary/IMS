import axios from "axios";
import { useState, useEffect } from "react";
import { Wallet, Package, User, Clock } from "lucide-react";
import { OrderCard } from "./OrderCard";
import { BACKEND_URL } from "../../../Config";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  SKU: string;
  seasonality?: string | null;
  shelfLife?: number | null;
  imageUrls: string[];
}

export interface OrderProduct {
  product: Product;
  quantity: number;
}

export interface Customer {
  username: string;
  email: string;
}

export interface Order {
  id: string;
  totalAmount: number;
  customerId: string;
  products: OrderProduct[];
  customer: Customer;
  paymentStatus: string;
  // status?: string;
}

const CashierDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [cashierOrder,setCashierorder]  = useState<Order[]>([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios(`${BACKEND_URL}/api/cashier/getOrders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const data = await response.data;
        setOrders(data.orders);
        localStorage.setItem("CashierOrders", JSON.stringify(data.orders));

        const revenue = data.orders.reduce(
          (sum: number, order: Order) => sum + order.totalAmount,
          0
        );
        const productsCount = data.orders.reduce(
          (sum: number, order: Order) => sum + order.products.length,
          0
        );

        setTotalRevenue(revenue);
        setTotalOrders(data.orders.length);
        setTotalProducts(productsCount);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
    <div>
      <div className="flex justify-between  bg-gray-200 mt-10 ml-10 mr-10 p-5  rounded-2xl opacity-80 shadow-lg static ">
        <div>
          <ul className="flex space-x-20 cursor-pointer">
            <li>
              <a onClick={() => (window.location.href = "/cashier")}>Cashier</a>
            </li>
            <li>
              <a>Orders</a>
            </li>
            <li>
              <a>cancelOrder</a>
            </li>
            <li>
              <a>Products</a>
            </li>
            <li>
              <a>Services</a>
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex space-x-20 cursor-pointer">
            <li>
              <a>Profile</a>
            </li>
            <li>
              <a
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                logout
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Wallet className="h-8 w-8 text-blue-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <h3 className="text-2xl font-bold">
                    ${totalRevenue.toFixed(2)}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <h3 className="text-2xl font-bold">{totalOrders}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-purple-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <h3 className="text-2xl font-bold">{totalProducts}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Pending Orders</p>
                  <h3 className="text-2xl font-bold">
                    {
                      orders.filter(
                        (order: Order) => order.paymentStatus == "PENDING"
                      ).length
                    }
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CashierDashboard;
