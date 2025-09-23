import React, { useState } from 'react';
import axios from 'axios';

// Define the props for the component
interface ReceiptGeneratorProps {
  orderId: string;
  authToken: string; // Assuming you use a JWT or similar for auth
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ orderId, authToken }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGenerateReceipt = async () => {
    setIsLoading(true);
    setError(null);
    setPdfUrl(null); // Clear previous receipt

    // Show the "Generating receipt..." message to the user
    console.log("Generating receipt, please wait...");

    try {
      const response = await axios.post(
        'http://localhost:5000/api/cashier/generatereceipt',
        {
          orderId: orderId,
          includeBarcode: true,
        },
        {
          headers: {
            // Include the authorization token in the header
            'Authorization': `Bearer ${authToken}`,
          },
          // IMPORTANT: This tells axios to expect binary data (a blob)
          responseType: 'blob',
        }
      );

      // Create a URL from the blob data
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
      setPdfUrl(url); // Set the URL to be used in an iframe or link

    } catch (err) {
      console.error("Error generating receipt:", err);
      setError("Failed to generate receipt. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Receipt Management</h2>
      <p>Click the button below to generate the receipt for your order.</p>

      {/* Button to trigger receipt generation */}
      <button onClick={handleGenerateReceipt} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Receipt'}
      </button>

      {/* Display loading message */}
      {isLoading && <p>Generating receipt, please wait...</p>}

      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display the PDF viewer and download link when ready */}
      {pdfUrl && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Receipt Ready!</h3>
          
          {/* Link to download the PDF */}
          <a href={pdfUrl} download={`receipt_${orderId}.pdf`}>
            Download Receipt
          </a>

          {/* Iframe to render and preview the PDF */}
          <iframe
            src={pdfUrl}
            title="Receipt Preview"
            width="100%"
            height="600px"
            style={{ border: 'none', marginTop: '10px' }}
          />
        </div>
      )}
    </div>
  );
};

export default ReceiptGenerator;