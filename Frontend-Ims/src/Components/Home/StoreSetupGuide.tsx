import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Scan, PlusCircle, CreditCard, Box, Users, BarChart2, AlertTriangle, TrendingUp, DollarSign, ShoppingCart, Info, XCircle } from 'lucide-react';

const MrPatelsStoreFlow = () => {
  // --- Core State Management ---
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'sales', 'reports', 'settings'
  const [products, setProducts] = useState([
    { id: '890123456789', name: 'Tata Rice 5kg', price: 550, stock: 32, minStock: 10, expiry: '2026-12-31' },
    { id: '890987654321', name: 'Amul Milk 1L', price: 58, stock: 15, minStock: 20, expiry: '2025-06-10' }, // Expiring soon
    { id: '890101010101', name: 'Tata Salt 1kg', price: 28, stock: 450, minStock: 50, expiry: '2027-01-15' },
    { id: '890202020202', name: 'Britannia Biscuit Pack', price: 30, stock: 8, minStock: 15, expiry: '2025-06-08' }, // Expiring today
  ]);
  const [sales, setSales] = useState([
    { id: '#1023', date: '2025-06-06', total: 8450, paymentMode: 'UPI', items: [{ name: 'Assorted', qty: 1 }], discount: 0 },
    { id: '#1022', date: '2025-06-05', total: 7800, paymentMode: 'Cash', items: [{ name: 'Assorted', qty: 1 }], discount: 0 },
  ]);
  const [currentBillItems, setCurrentBillItems] = useState([]);
  const [scannerInput, setScannerInput] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [offlineMode, setOfflineMode] = useState(false); // Simulate offline state
  const [offlineSalesData, setOfflineSalesData] = useState([]); // Store sales in offline mode

  // --- Utility Functions ---
  const today = new Date();
  const getDaysUntilExpiry = (expiryDateString) => {
    const expiry = new Date(expiryDateString);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // --- Dashboard Calculations ---
  const lowStockItems = products.filter(p => p.stock < p.minStock);
  const expiringProducts = products.filter(p => {
    const days = getDaysUntilExpiry(p.expiry);
    return days <= 7 && days >= 0; // Expiring within 7 days or today
  }).sort((a, b) => getDaysUntilExpiry(a.expiry) - getDaysUntilExpiry(b.expiry));

  const yesterdaySalesTotal = sales.find(s => s.date === '2025-06-06')?.total || 0;
  const todaySalesTotal = sales.filter(s => s.date === today.toISOString().slice(0, 10)).reduce((sum, s) => sum + s.total, 0);
  const totalBillsToday = sales.filter(s => s.date === today.toISOString().slice(0, 10)).length;

  const topSellerToday = products.reduce((acc, product) => {
    const salesOfProduct = sales.filter(s => s.date === today.toISOString().slice(0, 10)).flatMap(s => s.items);
    const qtySold = salesOfProduct.filter(item => item.name === product.name).reduce((sum, item) => sum + item.qty, 0);
    if (qtySold > acc.qty) {
      return { name: product.name, qty: qtySold };
    }
    return acc;
  }, { name: '', qty: 0 });

  const cashFlowToday = sales.filter(s => s.date === today.toISOString().slice(0, 10)).reduce((acc, s) => {
    if (s.paymentMode === 'Cash') acc.cash += s.total;
    if (s.paymentMode === 'UPI') acc.upi += s.total;
    return acc;
  }, { cash: 0, upi: 0 });

  // --- Notifications ---
  const showTemporaryNotification = (message, type = 'info') => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // --- Stock Management Actions ---
  const handleScanProductForStock = (barcode) => {
    const product = products.find(p => p.id === barcode);
    if (product) {
      // Simulate auto-populating details
      showTemporaryNotification(`Product found: ${product.name}, Price: ₹${product.price}, Stock: ${product.stock}`, 'info');
      // In a real app, you'd navigate to an "add stock" form pre-filled
    } else {
      showTemporaryNotification('Product not found. Please add new product.', 'error');
    }
    setScannerInput(''); // Clear input after scan
  };

  const handleAddStock = (productId, quantity) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, stock: p.stock + quantity } : p
    ));
    showTemporaryNotification(`Added ${quantity} to stock for ${products.find(p => p.id === productId)?.name}`, 'success');
  };

  // --- Sales Flow Actions ---
  const startNewSale = () => {
    setCurrentBillItems([]);
    showTemporaryNotification('New bill started! Bill No: #' + (sales.length + offlineSalesData.length + 1000), 'info');
  };

  const handleScanProductForSale = (barcode) => {
    const product = products.find(p => p.id === barcode);
    if (product) {
      const existingItem = currentBillItems.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.qty < product.stock) {
          setCurrentBillItems(currentBillItems.map(item =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          ));
        } else {
          showTemporaryNotification(`Not enough stock for ${product.name}`, 'warning');
        }
      } else {
        if (product.stock > 0) {
          setCurrentBillItems([...currentBillItems, { ...product, qty: 1 }]);
        } else {
          showTemporaryNotification(`${product.name} is out of stock!`, 'error');
        }
      }
      showTemporaryNotification(`Added ${product.name} to bill`, 'info');
    } else {
      showTemporaryNotification('Product not found. Please check barcode.', 'error');
    }
    setScannerInput('');
  };

  const calculateBillTotal = () => {
    return currentBillItems.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  const processPayment = (paymentMode, discountPercentage = 0) => {
    const total = calculateBillTotal();
    const discountedTotal = total * (1 - discountPercentage / 100);

    const newSale = {
      id: '#' + (sales.length + offlineSalesData.length + 1000), // Unique bill ID
      date: today.toISOString().slice(0, 10),
      total: discountedTotal,
      paymentMode: paymentMode,
      items: currentBillItems.map(item => ({ name: item.name, qty: item.qty })),
      discount: discountPercentage,
    };

    if (offlineMode) {
      setOfflineSalesData([...offlineSalesData, newSale]);
      showTemporaryNotification(`Sale saved offline (${paymentMode}). Will sync when online.`, 'info');
    } else {
      setSales([...sales, newSale]);
      showTemporaryNotification(`Payment received via ${paymentMode}. Invoice printed.`, 'success');
    }

    // Deduct stock for sold items
    setProducts(products.map(p => {
      const soldItem = currentBillItems.find(item => item.id === p.id);
      if (soldItem) {
        const newStock = p.stock - soldItem.qty;
        // Trigger reorder alert if stock drops below minStock
        if (newStock < p.minStock && p.stock >= p.minStock) { // Only if it just dropped below
          showTemporaryNotification(`Low Stock Alert: ${p.name} (${newStock} left). Reorder now!`, 'warning');
          // Simulate generating PO and sending to supplier
          console.log(`Simulating purchase order for ${p.name} to supplier.`);
        }
        return { ...p, stock: newStock };
      }
      return p;
    }));

    setCurrentBillItems([]); // Clear bill after sale
  };

  // --- Offline Mode Sync ---
  useEffect(() => {
    if (!offlineMode && offlineSalesData.length > 0) {
      // Simulate syncing offline data when back online
      showTemporaryNotification(`Syncing ${offlineSalesData.length} offline sales...`, 'info');
      setTimeout(() => {
        setSales([...sales, ...offlineSalesData]);
        setOfflineSalesData([]);
        showTemporaryNotification('Offline sales synced successfully!', 'success');
      }, 2000);
    }
  }, [offlineMode, offlineSalesData, sales]); // Depend on offlineMode and offlineSalesData

  // --- Staff Management (Basic Example) ---
  const [users, setUsers] = useState([
    { id: 1, name: 'Mr. Patel (Admin)', permissions: ['createBill', 'viewStock', 'changePrice', 'viewReports', 'manageSuppliers'] },
    { id: 2, name: 'Ravi (Helper)', permissions: ['createBill', 'viewStock'] },
  ]);

  // --- Render Logic ---
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Sales Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><DollarSign className="mr-2" /> Sales Summary</h3>
        <p className="text-3xl font-bold text-blue-600 mb-2">₹{todaySalesTotal.toLocaleString('en-IN')}</p>
        <p className="text-gray-600">Today's Total ({totalBillsToday} bills)</p>
        <p className="text-sm text-gray-500 mt-2">Yesterday: ₹{yesterdaySalesTotal.toLocaleString('en-IN')}</p>
      </div>

      {/* Low Stock Items */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><AlertTriangle className="mr-2 text-red-500" /> Low Stock Alerts</h3>
        {lowStockItems.length > 0 ? (
          <ul className="space-y-2">
            {lowStockItems.map(item => (
              <li key={item.id} className="text-red-600 text-lg font-medium flex items-center">
                <Box className="w-5 h-5 mr-2" /> {item.name} ({item.stock} left)
                <button
                  onClick={() => handleAddStock(item.id, 50)} // Example: add 50 units
                  className="ml-auto bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600"
                >
                  Reorder
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-600 text-lg">All stocks are healthy!</p>
        )}
      </div>

      {/* Expiring Products */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><Info className="mr-2 text-yellow-500" /> Expiring Soon</h3>
        {expiringProducts.length > 0 ? (
          <ul className="space-y-2">
            {expiringProducts.map(item => (
              <li key={item.id} className="text-yellow-700 text-lg font-medium">
                {item.name} (Expires in {getDaysUntilExpiry(item.expiry)} days)
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-lg">No products expiring this week.</p>
        )}
      </div>

      {/* Top Seller Today */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-1 md:col-span-2 lg:col-span-1">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><TrendingUp className="mr-2 text-green-500" /> Top Seller Today</h3>
        {topSellerToday.qty > 0 ? (
          <p className="text-2xl font-bold text-green-700">{topSellerToday.name} ({topSellerToday.qty} sold)</p>
        ) : (
          <p className="text-gray-600">No sales yet today.</p>
        )}
      </div>

      {/* Cash Flow Today */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><CreditCard className="mr-2" /> Cash Flow Today</h3>
        <p className="text-lg font-medium text-gray-700">Cash: <span className="font-bold text-blue-600">₹{cashFlowToday.cash.toLocaleString('en-IN')}</span></p>
        <p className="text-lg font-medium text-gray-700">UPI: <span className="font-bold text-blue-600">₹{cashFlowToday.upi.toLocaleString('en-IN')}</span></p>
      </div>

      {/* Offline Mode Toggle */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <Info className="mr-2" /> Offline Mode
        </h3>
        <label className="inline-flex relative items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={offlineMode}
            onChange={() => setOfflineMode(!offlineMode)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-lg font-medium text-gray-900">{offlineMode ? 'ON' : 'OFF'}</span>
        </label>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <Box className="mr-3" /> Product Inventory
      </h2>
      <div className="flex items-center mb-4 space-x-3">
        <input
          type="text"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Scan barcode or enter product ID to add stock..."
          value={scannerInput}
          onChange={(e) => setScannerInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleScanProductForStock(scannerInput);
            }
          }}
        />
        <button
          onClick={() => handleScanProductForStock(scannerInput)}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center"
        >
          <Scan className="w-5 h-5 mr-2" /> Scan/Add
        </button>
        <button
          className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barcode</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₹)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min. Stock</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.stock < product.minStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.minStock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.expiry}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <ShoppingCart className="mr-3" /> Process New Sale
      </h2>
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={startNewSale}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Start New Bill
        </button>
        <input
          type="text"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Scan product barcode..."
          value={scannerInput}
          onChange={(e) => setScannerInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleScanProductForSale(scannerInput);
            }
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Bill */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Bill Items</h3>
          {currentBillItems.length === 0 ? (
            <p className="text-gray-500">Scan products to add them to the bill.</p>
          ) : (
            <ul className="space-y-3 mb-6">
              {currentBillItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center text-lg">
                  <span>{item.name} x {item.qty}</span>
                  <span>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t pt-4 mt-4 flex justify-between items-center text-2xl font-bold text-gray-900">
            <span>Total:</span>
            <span>₹{calculateBillTotal().toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Payment & Checkout */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Checkout</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <input
                type="number"
                defaultValue="0"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
              <div className="flex space-x-3">
                <button
                  onClick={() => processPayment('Cash')}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
                  disabled={currentBillItems.length === 0}
                >
                  Cash
                </button>
                <button
                  onClick={() => processPayment('UPI')}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700"
                  disabled={currentBillItems.length === 0}
                >
                  UPI (QR)
                </button>
                <button
                  onClick={() => processPayment('Card')}
                  className="flex-1 bg-yellow-600 text-white py-3 rounded-lg font-medium hover:bg-yellow-700"
                  disabled={currentBillItems.length === 0}
                >
                  Card
                </button>
              </div>
            </div>
            <button
              onClick={() => showTemporaryNotification('Simulating invoice print...', 'info')}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300"
              disabled={currentBillItems.length === 0}
            >
              Print Invoice
            </button>
          </div>
        </div>
      </div>

       {/* Recent Sales History */}
       <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Sales</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill No.</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (₹)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.slice(-5).reverse().map((sale) => ( // Show last 5 sales
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.total.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.paymentMode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.items.map(i => `${i.name} (${i.qty})`).join(', ')}</td>
                </tr>
              ))}
              {offlineSalesData.length > 0 && (
                 <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm italic text-gray-500">
                      ({offlineSalesData.length} pending offline sales...)
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <BarChart2 className="mr-3" /> Analytics & Reports
      </h2>
      <p className="text-gray-600 mb-4">Simulating a simplified reports section. In a full product, this would display detailed charts and tables.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Monthly Sales Growth</h3>
          <p className="text-green-600 text-3xl font-bold">↑ 15%</p>
          <p className="text-gray-600">vs last month</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Profit Margin Improvement</h3>
          <p className="text-green-600 text-3xl font-bold">↑ 8%</p>
          <p className="text-gray-600">This quarter</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 col-span-full">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Slow-Moving Items to Discontinue</h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Product X (last sold 60 days ago)</li>
            <li>Product Y (low demand)</li>
            <li>Product Z (expired stock)</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <Users className="mr-3" /> Settings & Staff Management
      </h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">User Accounts</h3>
        <ul className="space-y-3">
          {users.map(user => (
            <li key={user.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="font-medium text-lg">{user.name}</p>
              <p className="text-sm text-gray-600">Permissions: {user.permissions.join(', ')}</p>
            </li>
          ))}
        </ul>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add New User</button>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Supplier Management</h3>
        <p className="text-gray-600 mb-4">Configure suppliers and automatic reorder alerts.</p>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Manage Suppliers</button>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="text-blue-600">Mr. Patel's</span> Store Flow
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Your intelligent retail management system for seamless inventory, sales, and insights.
            (Example: Small grocery store in Hyderabad with 500+ products)
          </p>
        </div>

        {/* Global Notification */}
        {showNotification && (
          <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${
            notificationMessage.includes('Success') ? 'bg-green-500' :
            notificationMessage.includes('warning') ? 'bg-yellow-500' :
            notificationMessage.includes('error') ? 'bg-red-500' : 'bg-blue-500'
          }`}>
            <span>{notificationMessage}</span>
            <button onClick={() => setShowNotification(false)} className="ml-4 text-white">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-10 bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex justify-around">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-3 px-4 text-center text-lg font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 px-4 text-center text-lg font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'products' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex-1 py-3 px-4 text-center text-lg font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'sales' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sales
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-3 px-4 text-center text-lg font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'reports' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-4 text-center text-lg font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'settings' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Content Area */}
        <div>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'sales' && renderSales()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default MrPatelsStoreFlow;