"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const customer_1 = require("../controllers/customer");
const router = (0, express_1.Router)();
//should  not send all products to the customer
router.get("/products", (0, auth_1.checkAuth)(["CUSTOMER"]), customer_1.products);
router.get("/products/:id", (0, auth_1.checkAuth)(["CUSTOMER"]), customer_1.getItemById);
router.post("/order", (0, auth_1.checkAuth)(["CUSTOMER"]), customer_1.order);
//order history
//cart management
exports.default = router;
