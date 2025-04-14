"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
// Import Routes
const admin_1 = __importDefault(require("./routes/admin"));
const manager_1 = __importDefault(require("./routes/manager"));
const sales_1 = __importDefault(require("./routes/sales"));
const supplier_1 = __importDefault(require("./routes/supplier"));
const customer_1 = __importDefault(require("./routes/customer"));
const cashier_1 = __importDefault(require("./routes/cashier"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// app.use(
//   cors({
//     origin: 'https://inventorysolutions.vercel.app,',  
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
//     allowedHeaders: ['Content-Type', 'Authorization'], 
//     credentials: true,  
//   })
// );
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Inventory Management System API!" });
});
app.use("/api/admin", admin_1.default);
app.use("/api/manager", manager_1.default);
app.use("/api/sales", sales_1.default);
app.use("/api/supplier", supplier_1.default);
app.use("/api/customer", customer_1.default);
app.use("/api/cashier", cashier_1.default);
app.use("/api/auth", authRoutes_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});
app.post("/api/payment-sucess", (req, res) => {
    const responseBody = req.body;
    console.log(responseBody);
    res.status(200).json({ "Messagr:": responseBody });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
    });
});
exports.default = app;
