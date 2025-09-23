// src/pages/PaymentSuccessPage.tsx

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import ReceiptGenerator from '../Cashier/ReceiptGenerator'; // Adjust path

const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  
  // Get the orderId from the navigation state
  const orderId = location.state?.orderId;

  // You should get the auth token from your global state/context or storage
  const authToken = localStorage.getItem('authToken') || ''; 

  if (!orderId) {
    return (
      <div>
        <h2>Error</h2>
        <p>No order ID found. Cannot generate receipt.</p>
        <Link to="/cashierDashboard">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>✅ Payment Successful!</h1>
      <p>Your order has been confirmed.</p>
      
      {/* The Receipt Generator Component */}
      <ReceiptGenerator orderId={orderId} authToken={authToken} />

      <hr style={{ margin: '30px 0' }} />

      <Link to="/cashierDashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default PaymentSuccessPage;