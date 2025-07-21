// src/routes/manager.ts
import { Router } from "express";
import { checkAuth } from "../middleware/auth";
const router = Router();
 import {getSalesOverview,getSalesByRegion,getTopProducts,getOrders ,getOrderById,getSalesByCustomer,getPaymentMethods,updateOrder,deleteOrder, createOrder} from "../controllers/sales"
import { lowstock } from "../controllers/manager";

 router.get("/overview",checkAuth(["SALES","MANAGER"]),getSalesOverview)
 router.get("/top-products",checkAuth(["SALES","MANAGER"]),getTopProducts)
 router.get("/orders",checkAuth(["SALES","MANAGER"]),getOrders)
 router.patch("/order/:id",checkAuth(["SALES","MANAGER"]),getOrderById)
 router.get("/salesbycustomer",checkAuth(["SALES","MANAGER"]),getSalesByCustomer)
 router.get("/PaymentMethods",checkAuth(["SALES","MANAGER"]),getPaymentMethods)
router.get("/salesRegion",checkAuth(["SALES","MANAGER"]),getSalesByRegion)
router.get("/lowstock",checkAuth(["SALES","MANAGER"]),lowstock)



router.post("/create-order",checkAuth(["SALES"]),createOrder)
router.put("/update-order",checkAuth(["SALES"]),updateOrder)
router.delete("/delete-order",checkAuth(["SALES"]),deleteOrder)

export default router;
