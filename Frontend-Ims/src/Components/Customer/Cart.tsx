import axios from "axios";
import { useCart } from "./CardContext";
import { Navbar } from "./Navbar";
import { BACKEND_URL } from "../../../Config";
import { useState } from "react";
import { LoadingBUtton } from "../LoadingButton";

export const Cart = () => {
  const { cartItems, removeFromCart, incrementQuantity, decrementQuantity } =
    useCart();

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (loading) return;

    setLoading(true);
    if (cartItems.length === 0) {
      setError("Cart is empty. Add items before ordering.");
      return;
    }

    console.log("Sending order:", cartItems);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/customer/order`,
        { cart: cartItems },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);

      if (response.status === 201) {
        localStorage.setItem(
          "OrderDetails",
          JSON.stringify(response.data.order)
        );
        setSuccess(response.data.message);
        setError("");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error placing order. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div>
        {error && (
          <div className="text-red-500 text-lg text-center float-right mt-10 mr-4 font-bold underline">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-500 text-lg text-center float-right mt-10 mr-4 font-bold underline">
            {success}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center mt-5 mb-14">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-lg text-gray-600">Your cart is empty.</p>
        ) : (
          <ul className="w-full max-w-2xl">
            {cartItems.map((item, index) => (
              <li
                key={item.id || index}
                className="bg-white shadow-lg rounded-lg mb-4 p-4 flex items-center"
              >
                <img
                  src={item.imageUrls[0]}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="rounded-lg"
                />
                <div className="flex flex-col ml-4 flex-grow">
                  <div className="text-lg font-semibold">{item.name}</div>
                  <div className="text-gray-700">Price: ${item.price}</div>
                  <div className="text-gray-700">Quantity: {item.quantity}</div>

                  <div className="flex items-center mt-2">
                    <div className="flex justify-center items-center space-x-6 cursor-pointer mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                        onClick={() => incrementQuantity(item.id)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                        onClick={() => decrementQuantity(item.id)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14"
                        />
                      </svg>
                    </div>

                    <button
                      className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold mb-4">
            Total: $
            {cartItems
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toFixed(2)}
          </div>
          {loading ? (
            <LoadingBUtton />
          ) : (
            <div className="w-full flex justify-center">
              <button
                onClick={handleOrder}
                className="bg-blue-600 text-white px-10 py-2 rounded hover:bg-sky-600 font-sans cursor-pointer mb-2"
              >
                Buy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
