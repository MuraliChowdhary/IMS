// src/routes/manager.ts
import { Router } from "express";
import { checkAuth } from "../middleware/auth";
import { getItemById, products } from '../controllers/customer';
const router = Router();
//should  not send all products to the customer
router.get("/products",checkAuth(["CUSTOMER"]),products);
router.get("/products/:id",checkAuth(["CUSTOMER"]),getItemById);


export default router;
