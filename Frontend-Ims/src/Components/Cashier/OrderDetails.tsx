// import  { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Receipt, Package, User } from "lucide-react";
// import { BACKEND_URL } from '../../../Config';
// import { ProcessPayment } from './ProcessPayment';
// import { LoadingBUtton } from '../LoadingButton';
// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   stock: number;
//   category: string;
//   description: string;
//   SKU: string;
//   seasonality?: string | null;
//   shelfLife?: number | null;
//   imageUrls: string[];
// }

// interface OrderProduct {
//   product: Product;
//   quantity: number;
// }

// interface Customer {
//   username: string;
//   email: string;
// }

// interface OrderDetailsProps {
//   id: string;
//   totalAmount: number;
//   customerId: string;
//   products: OrderProduct[];
//   customer: Customer;
//   paymentStatus: string;
// }

// const OrderDetails = () => {
//     const [error,setError]=useState("")
//     const [success,setSuccess] = useState("")
//     const { orderId } = useParams();
//     const [order, setOrder] = useState<OrderDetailsProps | null>(null);
//       const [showPayment, setShowPayment] = useState(false);
//         const navigate = useNavigate();
//       // Use appropriate types for state
//       const [orderId1, setOrderID] = useState<string | undefined>(undefined);
//       const [amt, setAmount] = useState<number | undefined>(undefined);
//       const [loading,setLoading]=useState(false);
//     useEffect(() => {
//       const storedOrder = localStorage.getItem("CashierOrders");
//       if (storedOrder) {
//         try {
//           const orders = JSON.parse(storedOrder);
//           console.log("Parsed Orders:", orders); // Debugging line

//           if (Array.isArray(orders)) {
//             const orderDetails = orders.find((order: OrderDetailsProps) => order.id === orderId);
//             console.log("Order Details:", orderDetails); // Debugging line
//             if (orderDetails) {
//               setOrder(orderDetails); // Directly set the order object
//             } else {
//               console.error("Order not found!");
//             }
//           } else {
//             console.error("Invalid format: Orders is not an array");
//           }
//         } catch (error) {
//           console.error("Error parsing order data:", error);
//         }
//       } else {
//         console.warn("No orders found in localStorage");
//       }

//     }, [orderId]);

//     if (!order) {
//       return <div>Loading...</div>;
//     }

//     const calculateTotal = () => {
//       if (!order.products || !Array.isArray(order.products)) return 0;
//       return order.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
//     };

//     const Payment = async function () {
//       if(loading)return
//       setLoading(true);
//         try {
//           const productMap = new Map();
//           order.products.forEach((p) => {
//             const productId = p.product.id;
//             if (productMap.has(productId)) {
//               productMap.set(productId, productMap.get(productId) + 1);
//             } else {
//               productMap.set(productId, 1);
//             }
//           });

//           const products = Array.from(productMap.entries()).map(
//             ([productId, quantity]) => ({
//               productId,
//               quantity,
//             })
//           );

//           const totalAmount = order.products.reduce((total, p) => {
//             return total + p.product.price * (p.quantity || 1);
//           }, 0);

//           const response = await axios.post(
//             `${BACKEND_URL}/api/cashier/order`,
//             { orderId:order.id,
//               customerId: order.customerId,
//               products: products,
//               totalAmount: parseFloat(totalAmount.toFixed(2)),
//             },
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: "Bearer " + localStorage.getItem("token"),
//               },
//             }
//           );
//           console.log(response.data.order);

//           const orderId = response.data.order.razorpayOrderId;
//           const amt = response.data.order.totalAmount;

//           setOrderID(orderId);
//           setAmount(amt);

//           setShowPayment(true);
//           console.log(orderId + " " + amt + " " + showPayment);
//         } catch {
//           alert("Order failed. Please try again.");
//         }
//         finally{
//           setLoading(false);
//         }
//       };

//       const handleCancel = async (orderId: string) => {
//         if(loading)return
//         setLoading(true);
//         try {
//           const response = await axios.post(
//             `${BACKEND_URL}/api/cashier/cancelorder`,
//             { orderId },
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: "Bearer " + localStorage.getItem("token"),
//               },
//             }
//           );

//           if (response.status === 200 || response.status === 204) {

//             //console.log("Order cancelled successfully");
//             setSuccess(response.data.message || "Order has been cancelled.");
//            navigate("/cashierDashboard");
//           } else {
//             setError(response.data.message || "Failed to cancel order.");
//             console.log("Error:", response.data);
//             navigate("/cashierDashboard")
//           }
//         } catch (err: unknown) {
//           if (axios.isAxiosError(err) && err.response) {
//             if (err.response.status === 409) {
//               setError("Order is already canceled.");
//               navigate("/cashierDashboard")
//             } else {
//               setError(err.response.data.message || "An error occurred.");
//             }
//           } else {
//             setError("Network error. Please try again.");
//           }
//           console.error("Error cancelling order:", err);
//         }
//         finally{
//           setLoading(false);
//         }
//       };

//     return (
//       <div>

//               <div className='text-right '>
//               {error && <div className="text-red-500 text-xl text-center mr-5 mt-5 font-bold ">{error}</div>}
//               {success && <div className="text-green-500 text-xl text-center mr-5 mt-5 font-bold ">{success}</div>}
//               </div>

//         <div className='text-center text-2xl text-gray-900 mt-15 font-bold'>
//           <h2>Order Details</h2>
//         </div>
//         <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col justify-center mt-5">
//           <div className="border-b p-4">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-xl font-bold">Order Receipt</h2>
//               <Receipt className="text-gray-600" size={24} />
//             </div>
//             <p className="text-sm text-gray-600">Order ID: {order.id}</p>
//           </div>

//           <div className="border-b p-4">
//             <div className="flex items-center gap-2 mb-2">
//               <User size={20} className="text-gray-600" />
//               <h3 className="font-semibold">Customer Details</h3>
//             </div>
//             <p className="text-sm">{order.customer.username}</p>
//             <p className="text-sm text-gray-600">{order.customer.email}</p>
//           </div>

//           <div className="p-4 border-b">
//             <div className="flex items-center gap-2 mb-3">
//               <Package size={20} className="text-gray-600" />
//               <h3 className="font-semibold">Order Item</h3>
//             </div>
//             <div className="space-y-3">
//               {order?.products?.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex justify-between items-start pb-2 border-b border-gray-100 last:border-0"
//                 >
//                   <div className="flex-1">
//                     <p className="font-medium">
//                       {item?.product?.name || "Unknown Product"}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       {item?.product?.SKU || "No SKU"}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {item?.product?.description || "No description available"}
//                     </p>
//                   </div>
//                   <div className="text-right ml-4">
//                     <p className="font-medium">
//                       {(item?.product?.price || 0).toFixed(2)}
//                     </p>
//                     <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="p-4">
//             <div className="flex justify-between items-center mb-2">
//               <span className="font-medium">Subtotal:</span>
//               <span>{calculateTotal().toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
//               <span>Tax (10%):</span>
//               <span>{(calculateTotal() * 0.1).toFixed(2)}</span>
//             </div>
//             <div className="border-t pt-2 mt-2">
//               <div className="flex justify-between items-center font-bold">
//                 <span>Total:</span>
//                 <span>{(calculateTotal() * 1.1).toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           <div className="border-t mb-2 flex space-x-10 px-2 py-4">

//           {loading ? (
//             <LoadingBUtton />
//           ) : (
//             !showPayment && (
//               <button
//                 onClick={Payment}
//                 className="w-full bg-green-600 hover:bg-blue-800 text-white px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
//               >
//                 Order
//               </button>
//             )
//           )}

//               {showPayment && orderId1 && amt && <ProcessPayment orderId={orderId1} amount={amt} />}

//            {loading ? <LoadingBUtton/>: <button
//                   onClick={() => handleCancel(order.id)}
//                   className="w-full bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
//                 >
//                   Cancel Order
//                 </button>}
// </div>

//         </div>
//       </div>
//     );
//   };

//   export default OrderDetails;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Receipt, Package, User } from "lucide-react";
import { BACKEND_URL } from "../../../Config";
import { ProcessPayment } from "./ProcessPayment";
import { LoadingBUtton } from "../LoadingButton";

interface Product {
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

interface OrderProduct {
  product: Product;
  quantity: number;
}

interface Customer {
  username: string;
  email: string;
}

interface OrderDetailsProps {
  id: string;
  totalAmount: number;
  customerId: string;
  products: OrderProduct[];
  customer: Customer;
  paymentStatus: string;
}

const OrderDetails = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetailsProps | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();
  const [orderId1, setOrderID] = useState<string | undefined>(undefined);
  const [amt, setAmount] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const storedOrder = localStorage.getItem("CashierOrders");
    if (storedOrder) {
      try {
        const orders = JSON.parse(storedOrder);
        if (Array.isArray(orders)) {
          const orderDetails = orders.find(
            (order: OrderDetailsProps) => order.id === orderId
          );
          if (orderDetails) {
            setOrder(orderDetails);
          }
        }
      } catch (error) {
        console.error("Error parsing order data:", error);
      }
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!order.products || !Array.isArray(order.products)) return 0;
    return order.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const Payment = async function () {
    if (loading) return;
    setLoading(true);
    try {
      const productMap = new Map();
      order.products.forEach((p) => {
        const productId = p.product.id;
        if (productMap.has(productId)) {
          productMap.set(productId, productMap.get(productId) + p.quantity);
        } else {
          productMap.set(productId, p.quantity);
        }
      });

      const products = Array.from(productMap.entries()).map(
        ([productId, quantity]) => ({
          productId,
          quantity,
        })
      );

      const totalAmount = order.products.reduce((total, p) => {
        return total + p.product.price * (p.quantity || 1);
      }, 0);

      const response = await axios.post(
        `${BACKEND_URL}/api/cashier/order`,
        {
          orderId: order.id,
          customerId: order.customerId,
          products: products,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const razorpayOrderId = response.data.order.razorpayOrderId;
      const totalAmountValue = response.data.order.totalAmount;

      setOrderID(razorpayOrderId);
      setAmount(totalAmountValue);
      setShowPayment(true);
    } catch (error) {
      setError("Order failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (cancelLoading) return;
    setCancelLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/cashier/cancelorder`,
        { orderId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setSuccess(response.data.message || "Order has been cancelled.");
        setTimeout(() => navigate("/cashierDashboard"), 1500);
      } else {
        setError(response.data.message || "Failed to cancel order.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 409) {
          setError("Order is already canceled.");
        } else {
          setError(err.response.data.message || "An error occurred.");
        }
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-right mb-4">
          {error && (
            <div className="text-red-500 text-lg text-center font-semibold p-3 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-500 text-lg text-center font-semibold p-3 bg-green-50 rounded-md">
              {success}
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Order Details</h2>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Order Receipt
              </h2>
              <Receipt className="text-gray-600" size={28} />
            </div>
            <p className="text-sm text-gray-600">Order ID: {order.id}</p>
          </div>

          <div className="border-b p-6">
            <div className="flex items-center gap-3 mb-4">
              <User size={22} className="text-gray-600" />
              <h3 className="font-semibold text-lg">Customer Details</h3>
            </div>
            <p className="text-md font-medium">{order.customer.username}</p>
            <p className="text-sm text-gray-600">{order.customer.email}</p>
          </div>

          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-4">
              <Package size={22} className="text-gray-600" />
              <h3 className="font-semibold text-lg">Order Items</h3>
            </div>
            <div className="space-y-4">
              {order.products?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {item.product?.name || "Unknown Product"}
                    </p>
                    <p className="text-sm text-gray-600">
                      SKU: {item.product?.SKU || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.product?.description || "No description available"}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-gray-800">
                      ${(item.product?.price || 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      ${(item.product?.price * item.quantity || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Subtotal:</span>
                <span className="font-medium">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Tax (10%):</span>
                <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                {loading ? (
                  <LoadingBUtton />
                ) : !showPayment ? (
                  <button
                    onClick={Payment}
                    disabled={loading}
                    className={`w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center cursor-pointer${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    Order
                  </button>
                ) : (
                  <ProcessPayment orderId={orderId1!} amount={amt!} />
                )}
              </div>
              <div className="flex-1">
                {cancelLoading ? (
                  <LoadingBUtton />
                ) : (
                  <button
                    onClick={() => handleCancel(order.id)}
                    disabled={cancelLoading}
                    className={`w-full h-12 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer${
                      cancelLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
