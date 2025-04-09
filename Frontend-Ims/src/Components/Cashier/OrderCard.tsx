import { useState } from "react";
import { ProcessPayment } from "./ProcessPayment";
import axios from "axios";
import { BACKEND_URL } from "../../../Config";
import { Order } from "./CashierDashboard";
import { Receipt, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const [showPayment, setShowPayment] = useState(false);

  // Use appropriate types for state
  const [orderId, setOrderID] = useState<string | undefined>(undefined);
  const [amt, setAmount] = useState<number | undefined>(undefined);

  const navigate = useNavigate();

  const calculateTotal = () => {
    if (!order.products || !Array.isArray(order.products)) return 0;
    return order.products.reduce((sum, item) => {
      const price = item?.product?.price || 0;
      return sum + price;
    }, 0);
  };

  // const _Payment = async function () {
  //   try {
  //     const productMap = new Map();
  //     order.products.forEach((p) => {
  //       const productId = p.product.id;
  //       if (productMap.has(productId)) {
  //         productMap.set(productId, productMap.get(productId) + 1);
  //       } else {
  //         productMap.set(productId, 1);
  //       }
  //     });

  //     const products = Array.from(productMap.entries()).map(
  //       ([productId, quantity]) => ({
  //         productId,
  //         quantity,
  //       })
  //     );

  //     const totalAmount = order.products.reduce((total, p) => {
  //       return total + p.product.price * (p.quantity || 1);
  //     }, 0);

  //     const response = await axios.post(
  //       `${BACKEND_URL}/api/cashier/order`,
  //       {
  //         customerId: order.customerId,
  //         products: products,
  //         totalAmount: parseFloat(totalAmount.toFixed(2)),
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + localStorage.getItem("token"),
  //         },
  //       }
  //     );
  //     console.log(response.data.order);

  //     const orderId = response.data.razorpay_order_id;
  //     const amt = response.data.amount;

  //     setOrderID(orderId);
  //     setAmount(amt);

  //     setShowPayment(true);
  //     console.log(orderId + " " + amt + " " + showPayment);
  //   } catch (error) {
  //     alert("Order failed. Please try again.");
  //   }
  // };
  const _Payment = async function () {
    try {
      const productMap = new Map();
      order?.products?.forEach((p) => {
        const productId = p.product.id;
        productMap.set(productId, (productMap.get(productId) || 0) + 1);
      });

      const products = Array.from(productMap, ([productId, quantity]) => ({
        productId,
        quantity,
      }));

      const totalAmount = calculateTotal();

      const response = await axios.post(
        `${BACKEND_URL}/api/cashier/order`,
        {
          customerId: order.customerId,
          products,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.data?.razorpay_order_id && response.data?.amount) {
        setOrderID(response.data.razorpay_order_id);
        setAmount(response.data.amount);
        setShowPayment(true);
      }
    } catch (error) {
      console.error("Order failed:", error);
      alert("Order failed. Please try again.");
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/cashier/cancelorder`,
        {
          orderId: orderId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.status == 201) {
        alert("Order cancelled successfully");
        console.log("Order Cancelled successfully");
        navigate("/cashierDashboard");
      }

      // Handle the response if needed
      console.log("Order cancelled:", response.data);
    } catch (err) {
      console.log("Error cancelling order:", err);
    }
  };
  const handleOrder = (orderId: string) => {
    navigate(`/order/${orderId}`); // Pass it directly
  };

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (showPayment && orderId && amt) {

  //     navigate('/payment', {
  //       state: { orderId, amount: amt }
  //     });
  //   }
  // }, [showPayment, orderId, amt, navigate]);

  console.log("Orders Payments:" + JSON.stringify(order));

  return (
    <>
      {showPayment && orderId && amt && (
        <ProcessPayment orderId={orderId} amount={amt} />
      )}

      <div
        className="max-w-md w-full mx-auto bg-white rounded-lg shadow-lg p-3 cursor-pointer"
        onClick={() => handleOrder(order.id)}
      >
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Order Receipt</h2>
            <Receipt className="text-gray-600" size={24} />
          </div>
          <p className="text-sm text-gray-600">
            Order ID: {order?.id || "N/A"}
          </p>
        </div>

        <div className="border-b p-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={20} className="text-gray-600" />
            <h3 className="font-semibold">Customer Details</h3>
          </div>
          <div className="ml-7">
            <p className="text-sm">{order?.customer?.username || "Guest"}</p>
            <p className="text-sm text-gray-600">
              {order?.customer?.email || "No email provided"}
            </p>
          </div>
        </div>

        {/* <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Package size={20} className="text-gray-600" />
            <h3 className="font-semibold">Order Items</h3>
          </div>
          <div className="space-y-3">
            
            {order?.products?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start pb-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {item?.product?.name || "Unknown Product"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item?.product?.SKU || "No SKU"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item?.product?.description || "No description available"}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-medium">
                    {(item?.product?.price || 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Qty: {item?.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Subtotal:</span>
            <span>{calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
            <span>Tax (10%):</span>
            <span>{(calculateTotal() * 0.1).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center font-bold">
              <span>Total:</span>
              <span>{(calculateTotal() * 1.1).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t mb-2 flex space-x-10">
          <button
            onClick={() => handleOrder(order.id)}
            className="w-full bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            view
          </button>
          <button
            onClick={() => handleCancel(order.id)}
            className="w-full bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            Cancel order
          </button>
          <button onClick={_Payment}></button>
        </div>
      </div>
    </>
  );
};
