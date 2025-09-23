// src/api/receiptApi.ts
import axios from 'axios';

export const generateAndDownloadReceipt = async (orderId: string, authToken: string): Promise<void> => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/cashier/generatereceipt',
      { orderId, includeBarcode: true },
      {
        headers: { 'Authorization': `Bearer ${authToken}` },
        responseType: 'blob', // Crucial for file downloads
      }
    );

    // Create a Blob from the PDF stream
    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(pdfBlob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `receipt_${orderId}.pdf`);
    
    // Append to the DOM, click it, and then remove it
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    
    // Revoke the object URL to free up memory
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Failed to generate and download receipt:", error);
    // Optionally, inform the user of the failure
    alert("Could not automatically download the receipt. Please find it in your order history.");
  }
};