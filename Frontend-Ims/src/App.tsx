import { Home } from "./Components/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { CustomerDashboard } from "./Components/Customer/CustomerDashboard";
import { ProductsCard } from './Components/Customer/ProductCard';
import { Cart } from './Components/Customer/Cart';
import { CartProvider } from "./Components/Customer/CardContext";
import CashierDashboard from "./Components/Cashier/CashierDashboard";
import { ProcessPayment } from "./Components/Cashier/ProcessPayment";
import OrderDetails from "./Components/Cashier/OrderDetails";
import SalesDashboard from "./Components/sales/SalesDashboard";
import SupplierDashboard from "./Components/supplier/SupplierDashboard";
import { SupplierLogin } from "./Components/SupplierLogin";
import { SupplierRegister } from "./Components/SupplierRegister";
import { CustomerSales } from "./Components/sales/CustomerSales";
import NewSalesOverview from "./Components/sales/NewSalesOverview";
import HowItWorksPage from "./Components/Home/Howitsworks";
import MrPatelsStoreFlow from "./Components/Home/StoreSetupGuide";
import { SidebarProvider } from "./Components/ui/sidebar";

// ---  LAYOUTS ---
import ManagerLayout from "./Components/managerNew/ManagerLayout";

// --- MANAGER PAGES ---
import Inventory from "./Components/manager/Inventory";
import AddInventory from "./Components/manager/AddInventory";
import LowStock from "./Components/manager/Lowstock";
import ProductFilters from "./Components/manager/productFilters";
import PendingSupplierOrdersPage from "./Components/manager/pendingOrderSupplier";
import LowStockWithSidebarPage from "./Components/manager/LowStockWithSidebarPage";
import UploadProductCSV from "./Components/manager/UploadProductCSV";
import MLDashboard from "./Components/manager/MlCode";
import DashboardPage from "./Components/managerNew/DashboardPage";
import ProductCatalogPage from "./Components/managerNew/ProductCatalogPage";
import LowStockAlertsPage from "./Components/managerNew/LowStockAlertsPage";
import { TopPerformers } from "./Components/managerNew/TopPerformers";
import ExpiryManagementDashboard from "./Components/managerNew/ExpiryMangement";
import LoginPage from "./login/page";
import ResgisterForm from "./register/page";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Public & Other Routes (No Layout) --- */}
          <Route path="/" element={<Home />} />
          <Route path="/HowItWorksPage" element={<HowItWorksPage />} />
          <Route path="/new-version-under-dev" element={<MrPatelsStoreFlow />} />
          <Route path="/cart" element={<Cart />} />
          {/* <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<SignupForm />} /> */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/productCard/:id" element={<ProductsCard />} />
          <Route path="/cashierDashboard" element={<CashierDashboard />} />
          <Route path="/cashier" element={<CashierDashboard />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/payment" element={<ProcessPayment orderId="" amount={0} />} />
          <Route path="/sales" element={<SalesDashboard />} />
          <Route path="/sales/customers" element={<CustomerSales />} />
          <Route path="/sales/salesReports" element={<NewSalesOverview />} />
          <Route path="/supplier" element={<SupplierDashboard />} />
          <Route path="/supplier/login" element={<SupplierLogin />} />
          <Route path="/supplier/register" element={<SupplierRegister />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<ResgisterForm />} />

          {/* --- MANAGER ROUTES (with shared layout) --- */}
          <Route 
            path="/manager/*" 
            element={
              <SidebarProvider>
                <ManagerRoutes />
              </SidebarProvider>
            } 
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

// --- Component for Manager-Specific Routes ---
const ManagerRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<ManagerLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="add-inventory" element={<AddInventory />} />
            <Route path="low-stock" element={<LowStock />} />
            <Route path="product-filters" element={<ProductFilters />} />
            <Route path="pending-orders" element={<PendingSupplierOrdersPage />} />
            <Route path="reorder" element={<LowStockWithSidebarPage />} />
            <Route path="add-bulk" element={<UploadProductCSV />} />
            <Route path="analytics" element={<MLDashboard />} />
            <Route path="expiry-management" element={<ExpiryManagementDashboard />} />
            <Route path="ml" element={<MLDashboard />} />
            <Route path="product-catalog" element={<ProductCatalogPage />} />
            <Route path="low-stock-alerts" element={<LowStockAlertsPage />} />
            <Route path="top-performers" element={<TopPerformers />} />
            
        </Route>
    </Routes>
  )
}

export default App;
