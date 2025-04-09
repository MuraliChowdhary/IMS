import { Request, Response } from "express";
import { OrderStatus_new, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Sales Overview
export const getSalesOverview = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await prisma.transaction.aggregate({
      _sum: { total: true },
      where: { transactionType: "SALE" },
    });

    const totalSales = await prisma.transaction.count({
      where: { transactionType: "SALE" },
    });

    const salesTrend = await prisma.transaction.groupBy({
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
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET: Top Selling Products
export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const topProducts = await prisma.transaction.findMany({
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
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getOrders = async (req: Request, res: Response) => {
  try {
    const { customerId, startDate, endDate, status } = req.query;

    const parsedStatus = status ? (OrderStatus_new[status as keyof typeof OrderStatus_new] as OrderStatus_new) : undefined;

    const orders = await prisma.order.findMany({
      where: {
        status: parsedStatus,
        customerId: customerId ? String(customerId) : undefined,
        createdAt: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
      },
      include: { customer: true },
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET: Order Details
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: String(req.params.id) },
      include: { customer: true, products: true },
    });

    if (!order) res.status(404).json({ error: "Order not found" });


    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET: Sales by Customer (Repeat vs New)
export const getSalesByCustomer = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.user.findMany({
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
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// GET: Sales by Region
export const getSalesByRegion = async (req: Request, res: Response) => {
  try {
    const salesByRegion = await prisma.order.groupBy({
      by: ["customerId"],
      _sum: { totalAmount: true },
    });

    res.status(200).json(salesByRegion);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET: Payment Method Distribution  mode: cash upi debit
export const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    const paymentMethods = await prisma.transaction.groupBy({
      by: ["transactionType"],
      _count: { transactionType: true },
    });

    res.status(200).json(paymentMethods);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const lowstock = async (req: Request, res: Response) => {
  try {


    const lowStockItems = await prisma.$queryRaw<any[]>`
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

  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

// POST: Create New Order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.create({
      data: req.body,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT: Update Order
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: String(req.params.id) },
      data: req.body,
    });

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE: Cancel/Delete Order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await prisma.order.delete({
      where: { id: String(req.params.id) },
    });

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
