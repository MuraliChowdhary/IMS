import React, { useEffect } from "react";
import { useNavigate  } from "react-router-dom";

import { REACT_APP_RAZORPAY_KEY_ID } from "../../../Config";
console.log(REACT_APP_RAZORPAY_KEY_ID)
// Define the types for Razorpay response and options
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export interface ProcessPaymentProps {
  orderId: string;
  amount: number;
}

export const ProcessPayment: React.FC<ProcessPaymentProps> = ({ orderId, amount }) => {
    const navigate = useNavigate();
  
//  const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const orderId = searchParams.get('orderId') || '';
 //   const amount = parseInt(searchParams.get('amount') || '0', 10);

    console.log(orderId + " " + amount)
 
  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => console.log("Razorpay script loaded successfully");
      script.onerror = () => console.error("Failed to load Razorpay script");
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  // Handle the payment process
  const handlePayment = () => {
    // Ensure Razorpay SDK is loaded before proceeding
    if (!window.Razorpay) {
      console.error("Razorpay SDK not loaded");
      return;
    }

    // Razorpay options for payment configuration
    const options: RazorpayOptions = {
      key: REACT_APP_RAZORPAY_KEY_ID, // Razorpay Key ID
      amount: amount * 100, // Convert to paise (1 INR = 100 paise)
      currency: "INR",
      order_id: orderId, // Order ID passed as prop
      name: "Your Company Name", // Your company or website name
      description: "Order Payment", // Payment description
      handler: async (response: RazorpayResponse) => {
        try {
          // Send payment details to your backend for verification
          const result = await fetch('http://localhost:5000/api/cashier/process-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,  // Token for authentication
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }),
          });

          const data = await result.json();

          // Check if payment processing was successful
          if (result.ok) {
            console.log("Payment success:", data);
            navigate('/cashierDashboard'); // Navigate on success
          } else {
            throw new Error(data.message || "Payment processing failed");
          }
        } catch (error) {
          alert('Payment failed. Please try again.');
          console.error('Payment Error:', error);
        }
      },
      prefill: {
        name: "Your Name", // Prefill customer details
        email: "your-email@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc", // Customize the payment button color
      },
    };

    // Create and open the Razorpay payment modal
    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <div>
      <button
      onClick={handlePayment}
      className="w-full bg-blue-600 hover:bg-blue-800 text-white px-2 py-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
    >
      Pay
    </button>

    </div>
  );
};
