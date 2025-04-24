// import React from 'react';
import Inventory from './Inventory';
import LowStock from './Lowstock';
import AddInventory from './AddInventory';
import ProductFilters from './productFilters';
import { PendingOrderSupplier } from './pendingOrderSupplier';
// import LowStockWithSidebarPage from './LowStockWithSidebarPage';
import UploadProductCSV from './UploadProductCSV';
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import AppSidebar from './app-sidebar';
import ExpiryDiscountDashboard from './ExpiryDiscount';

const ManagerOverview = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b shadow-sm bg-white">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Manager Dashboard Overview</h1>
          </header>

          {/* Dashboard Sections in Grid */}
          <main className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Section */}
            <section className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Inventory</h2>
              <Inventory />
            </section>

            {/* Low Stock Section */}
            <section className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Low Stock Items</h2>
              <LowStock />
            </section>

            {/* Pending Orders */}
            <section className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Pending Supplier Orders</h2>
              <PendingOrderSupplier />
            </section>

            {/* Product Filters */}
            <section className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Filtered Products View</h2>
              <ProductFilters />
            </section>

            {/* Add Inventory */}
            <section className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
              <AddInventory />
            </section>

            {/* CSV Upload */}
            <section className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Upload Products via CSV</h2>
              <UploadProductCSV />
            </section>

            <section className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Expiry and Discounts</h2>
              <ExpiryDiscountDashboard />
            </section>

           
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ManagerOverview;
