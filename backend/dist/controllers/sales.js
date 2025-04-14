"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.lowstock = exports.getPaymentMethods = exports.getSalesByRegion = exports.getSalesByCustomer = exports.getOrderById = exports.getOrders = exports.getTopProducts = exports.getSalesOverview = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET: Sales Overview
const getSalesOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalRevenue = yield prisma.transaction.aggregate({
            _sum: { total: true },
            where: { transactionType: "SALE" },
        });
        const totalSales = yield prisma.transaction.count({
            where: { transactionType: "SALE" },
        });
        const salesTrend = yield prisma.transaction.groupBy({
            by: ["createdAt"],
            _sum: { total: true },
            where: { transactionType: "SALE" },
            orderBy: { createdAt: "asc" },
        });
        res.json({
            totalRevenue: totalRevenue._sum.total || 0,
            totalSales,
            salesTrend,
        });
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getSalesOverview = getSalesOverview;
// GET: Top Selling Products
const getTopProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topProducts = yield prisma.transaction.findMany({
            where: { transactionType: "SALE" },
            orderBy: { quantity: "desc" },
            take: 10,
            include: {
                product: {
                    select: {
                        id: true,
                        category: true, // Fetch the category of the product
                    },
                },
            },
        });
        // Map over the topProducts to include the category in the response
        const topProductsWithCategory = topProducts.map((product) => ({
            productId: product.product.id,
            category: product.product.category,
            totalQuantity: product.quantity,
        }));
        res.json(topProductsWithCategory);
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getTopProducts = getTopProducts;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId, startDate, endDate, status } = req.query;
        const parsedStatus = status ? client_1.OrderStatus_new[status] : undefined;
        const orders = yield prisma.order.findMany({
            where: {
                status: parsedStatus,
                customerId: customerId ? String(customerId) : undefined,
                createdAt: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined,
                },
            },
            include: { customer: true },
        });
        res.json(orders);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getOrders = getOrders;
// GET: Order Details
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield prisma.order.findUnique({
            where: { id: String(req.params.id) },
            include: { customer: true, products: true },
        });
        if (!order)
            res.status(404).json({ error: "Order not found" });
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getOrderById = getOrderById;
// GET: Sales by Customer (Repeat vs New)
const getSalesByCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield prisma.user.findMany({
            select: {
                id: true,
                username: true,
                orders: {
                    select: {
                        id: true,
                        totalAmount: true,
                    },
                },
            },
        });
        const repeatCustomers = customers
            .filter((c) => c.orders.length > 1)
            .map((c) => ({
            id: c.id,
            name: c.username,
            orderCount: c.orders.length,
            totalAmount: c.orders.reduce((sum, order) => sum + order.totalAmount, 0),
        }));
        const newCustomers = customers
            .filter((c) => c.orders.length === 1)
            .map((c) => ({ id: c.id, name: c.username }));
        res.status(200).json({
            totalCustomers: customers.length,
            repeatCustomers,
            newCustomers,
        });
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getSalesByCustomer = getSalesByCustomer;
// GET: Sales by Region
const getSalesByRegion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesByRegion = yield prisma.order.groupBy({
            by: ["customerId"],
            _sum: { totalAmount: true },
        });
        res.status(200).json(salesByRegion);
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getSalesByRegion = getSalesByRegion;
// GET: Payment Method Distribution  mode: cash upi debit
const getPaymentMethods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentMethods = yield prisma.transaction.groupBy({
            by: ["transactionType"],
            _count: { transactionType: true },
        });
        res.status(200).json(paymentMethods);
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getPaymentMethods = getPaymentMethods;
const lowstock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lowStockItems = yield prisma.$queryRaw `
            SELECT * FROM "Inventory" 
            WHERE quantity <= threshold
        `;
        if (lowStockItems.length === 0) {
            res.status(404).json({
                success: false,
                message: "No low stock items found"
            });
            return;
        }
        const formattedItems = lowStockItems.map(item => ({
            id: item.id,
            name: item.name,
            currentQuantity: item.quantity,
            threshold: item.threshold,
            reorderLevel: item.reorderLevel,
            needsReorder: item.quantity <= item.reorderLevel,
            product: {
                id: item.product.id,
                name: item.product.name,
                SKU: item.product.SKU
            },
            supplier: item.supplier,
            lastUpdated: item.updatedAt
        }));
        res.status(200).json({
            success: true,
            data: {
                items: formattedItems,
                summary: {
                    totalLowStock: formattedItems.length,
                    needingReorder: formattedItems.filter(item => item.needsReorder).length,
                    criticalItems: formattedItems.filter(item => item.currentQuantity === 0).length
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching low stock items:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});
exports.lowstock = lowstock;
// POST: Create New Order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield prisma.order.create({
            data: req.body,
        });
        res.status(201).json(order);
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createOrder = createOrder;
// PUT: Update Order
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedOrder = yield prisma.order.update({
            where: { id: String(req.params.id) },
            data: req.body,
        });
        res.json(updatedOrder);
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateOrder = updateOrder;
// DELETE: Cancel/Delete Order
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.order.delete({
            where: { id: String(req.params.id) },
        });
        res.json({ message: "Order deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteOrder = deleteOrder;
