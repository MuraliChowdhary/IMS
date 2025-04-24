"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
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
const manager_2 = require("./controllers/manager");
const auth_1 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const corsMiddleware = (req, res, next) => {
    const allowedOrigins = [
        'https://inventorysolutions.vercel.app',
        'http://localhost:5173'
    ];
    const origin = req.headers.origin;
    // Set Access-Control-Allow-Origin if origin is allowed
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // Set other CORS headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
    return;
};
// Apply the middleware
app.use(corsMiddleware);
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
app.get("/api/v1/inventory/items", (0, auth_1.checkAuth)(["MANAGER"]), manager_2.listInventory);
exports.default = app;
