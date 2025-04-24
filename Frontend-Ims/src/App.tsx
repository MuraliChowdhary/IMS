  
  import {Home} from "./Components/Home/Home"
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import { Signin } from './Components/Signin';
  import { Signup } from './Components/Signup';
  import {CustomerDashboard}  from "./Components/Customer/CustomerDashboard"
  import { ProductsCard } from './Components/Customer/ProductCard';
  import { Cart } from './Components/Customer/Cart';
  import { CartProvider } from "./Components/Customer/CardContext";
  import  CashierDashboard  from "./Components/Cashier/CashierDashboard";
  import { ProcessPayment } from "./Components/Cashier/ProcessPayment";
import OrderDetails from "./Components/Cashier/OrderDetails";
import SalesDashboard from "./Components/sales/SalesDashboard";
import Dashboard from "./Components/manager/Dashboard";
import SupplierDashboard from "./Components/supplier/SupplierDashboard";
  import {SupplierLogin} from "./Components/SupplierLogin";
import { SupplierRegister } from "./Components/SupplierRegister";
import { CustomerSales } from "./Components/sales/CustomerSales";
//import SalesOverview from "./Components/sales/SalesOverview";
import NewSalesOverview from "./Components/sales/NewSalesOverview";
import Inventory from "./Components/manager/Inventory";
// import Reorder  from "./Components/manager/Reorder";
import AddInventory from "./Components/manager/AddInventory";
import LowStock from "./Components/manager/Lowstock";
import ProductFilters from "./Components/manager/productFilters";
import { PendingOrderSupplier } from "./Components/manager/pendingOrderSupplier";
import LowStockWithSidebarPage from "./Components/manager/LowStockWithSidebarPage";
// import { Toaster } from "sonner";
// import {addBulkProducts} from "./Components/manager/addBulkProducts";
  function App() {
    
    return (
      <>
        <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/customerDashboard" element={<CustomerDashboard />} />
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/cashierDashboard" element={<CashierDashboard />} />
              <Route path="/productCard/:id" element={<ProductsCard />} />
              <Route path="/cashier" element={<CashierDashboard />} />
              <Route path="/order/:orderId" element={<OrderDetails />} />
              <Route path="/payment" element={<ProcessPayment orderId="" amount={0}/>}/> 
              <Route path="/sales" element={<SalesDashboard/>}/>
              <Route path="/sales/customers" element={<CustomerSales/>}/> 
              <Route path="/sales/salesReports" element={<NewSalesOverview/>}/> 
              <Route path="/manager" element={<Dashboard/>}/>
              <Route path="/supplier" element={<SupplierDashboard/>}/> 
              <Route path="/supplier/login" element={<SupplierLogin/>}/> 
              <Route path="/supplier/register" element={<SupplierRegister/>}/> 
              <Route path="/manager/inventory" element={<Inventory/>}/>
              {/* <Route path="/manager/reorder" element={<Reorder/>}/> */}
              <Route path="/manager/addinventory" element={<AddInventory/>}/>
              <Route path="/manager/lowstocks" element={<LowStock/>}/>
              <Route path="/manager/productFilter" element = {<ProductFilters/>} />
              <Route path="/manager/pendingOrder" element = {<PendingOrderSupplier/>} />
              <Route path="/manager/reorder" element={<LowStockWithSidebarPage/>}/>
              <Route path="/manager/add" element={<UploadProductCSV />}/>
              <Route path="/manager/analytics" element={<AnalyticsDashboard />}/>
              <Route path="/manager/expiry" element={<ExpiryDiscountDashboard/>}/>
              <Route path="/manager/ml" element={<MLDashboard/>}/>
              {/* <Toaster position="top-right" richColors /> */}
          </Routes>
        </BrowserRouter>
        </CartProvider>

      </>
    )
  }

  export default App


//   import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Home } from "./Components/Home/Home";
// import { Signin } from "./Components/Signin";
// import { Signup } from "./Components/Signup";
// import { CustomerDashboard } from "./Components/Customer/CustomerDashboard";
// import { ProductsCard } from "./Components/Customer/ProductCard";
// import { Cart } from "./Components/Customer/Cart";
// import { CartProvider } from "./Components/Customer/CardContext";
// import CashierDashboard from "./Components/Cashier/CashierDashboard";
// import { ProcessPayment } from "./Components/Cashier/ProcessPayment";
// import OrderDetails from "./Components/Cashier/OrderDetails";
// import SalesDashboard from "./Components/sales/SalesDashboard";
// import Dashboard from "./Components/manager/Dashboard";
// import SupplierDashboard from "./Components/supplier/SupplierDashboard";
// import { SupplierLogin } from "./Components/SupplierLogin";
// import { SupplierRegister } from "./Components/SupplierRegister";
// import { AuthProvider } from "./Components/AuthContext";
// import ProtectedRoute from "./Components/ProtectedRoutes";
import UploadProductCSV from "./Components/manager/UploadProductCSV";
import AnalyticsDashboard from "./Components/manager/Analtics";
import ExpiryDiscountDashboard from "./Components/manager/ExpiryDiscount";
import MLDashboard from "./Components/manager/MlCode";

// function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/signin" element={<Signin />} />
//             <Route path="/signup" element={<Signup />} />

//             {/* Protected Routes */}
//             <Route
//               path="/customerDashboard"
//               element={<ProtectedRoute element={<CustomerDashboard />} allowedRoles={["CUSTOMER"]} />}
//             />
//             <Route
//               path="/cashierDashboard"
//               element={<ProtectedRoute element={<CashierDashboard />} allowedRoles={["CASHIER"]} />}
//             />
//             <Route path="/productCard/:id" element={<ProductsCard />} />
//             <Route
//               path="/order/:orderId"
//               element={<ProtectedRoute element={<OrderDetails />} allowedRoles={["CASHIER"]} />}
//             />
//             <Route
//               path="/payment"
//               element={<ProtectedRoute element={<ProcessPayment />} allowedRoles={["CASHIER"]} />}
//             />
//             <Route
//               path="/sales"
//               element={<ProtectedRoute element={<SalesDashboard />} allowedRoles={["SALES"]} />}
//             />
//             <Route
//               path="/manager"
//               element={<ProtectedRoute element={<Dashboard />} allowedRoles={["MANAGER"]} />}
//             />
//             <Route
//               path="/supplier"
//               element={<ProtectedRoute element={<SupplierDashboard />} allowedRoles={["SUPPLIER"]} />}
//             />
//             <Route path="/supplier/login" element={<SupplierLogin />} />
//             <Route path="/supplier/register" element={<SupplierRegister />} />
//           </Routes>
//         </BrowserRouter>
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;
