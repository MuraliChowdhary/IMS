"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.markOrderAsDelivered =
  exports.qualityCheck =
  exports.reviewPriceProposal =
  exports.checkInventoryLevels =
  exports.lowstock =
  exports.getProducts =
  exports.getProductById =
  exports.addProducts =
  exports.deleteProduct =
  exports.updateProduct =
  exports.addProduct =
  exports.updateInventory =
  exports.addInventoryItem =
  exports.getInventoryItem =
  exports.listInventory =
    void 0;
const client_1 = require("@prisma/client");
const console_1 = require("console");
const prisma = new client_1.PrismaClient();
const listInventory = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const inventory = yield prisma.inventory.findMany();
      if (!inventory) {
        res.status(404).json({ message: "No inventory found" });
      }
      res.status(200).json({ inventory });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
exports.listInventory = listInventory;
const getInventoryItem = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
      const inventoryItem = yield prisma.inventory.findUnique({
        where: { id: id },
      });
      if (!inventoryItem) {
        res.status(404).json({ message: "Inventory item not found" });
        return;
      }
      res.status(200).json({ inventoryItem });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
exports.getInventoryItem = getInventoryItem;
const addInventoryItem = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const {
      productId,
      quantity,
      threshold,
      price,
      expirationDate,
      reorderLevel,
      reorderQuantity,
    } = req.body;
    try {
      const product = yield prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          name: true,
          category: true,
          supplierId: true,
        },
      });
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      const inventoryItem = yield prisma.inventory.create({
        data: {
          name: product.name,
          category: product.category || "",
          quantity,
          threshold,
          price,
          expirationDate,
          reorderLevel,
          reorderQuantity,
          product: { connect: { id: productId } },
        },
      });
      if (product.supplierId) {
        yield prisma.inventory.update({
          where: { id: inventoryItem.id },
          data: {
            supplierId: product.supplierId,
          },
        });
      }
      res
        .status(201)
        .json({ message: "Inventory item added successfully", inventoryItem });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
exports.addInventoryItem = addInventoryItem;
const updateInventory = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get the inventory item ID from the URL parameter
    const { quantity, threshold, price, expirationDate } = req.body; // Get the new data from the request body
    try {
      // Find the inventory item by ID
      const inventoryItem = yield prisma.inventory.findUnique({
        where: { id },
      });
      if (!inventoryItem) {
        res.status(404).json({ message: "Inventory item not found" });
        return;
      }
      // Update the inventory item
      const updatedInventoryItem = yield prisma.inventory.update({
        where: { id },
        data: {
          quantity,
          threshold,
          price,
          expirationDate,
        },
      });
      res
        .status(200)
        .json({
          message: "Inventory item updated successfully",
          updatedInventoryItem,
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
exports.updateInventory = updateInventory;
const addProduct = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
      console.log("Incoming request body:", req.body); // Debugging
      const {
        name,
        category,
        description,
        price,
        stock,
        supplierId,
        SKU,
        isPerishable = false,
        seasonality,
        shelfLife,
        imageUrls, // This should be an array of strings
      } = req.body;
      console.log(typeof imageUrls);
      // Validate required fields
      if (
        !name ||
        !category ||
        price === undefined ||
        stock === undefined ||
        !supplierId ||
        !imageUrls ||
        !Array.isArray(imageUrls)
      ) {
        res
          .status(400)
          .json({
            message: "Missing required fields or invalid imageUrls format",
          });
        return;
      }
      // Debugging: Check field values
      console.log("Validated request body:", {
        name,
        category,
        price,
        stock,
        supplierId,
        SKU,
        isPerishable,
        seasonality,
        shelfLife,
        imageUrls,
      });
      // Check if supplier exists
      const supplier = yield prisma.supplier.findUnique({
        where: { id: supplierId },
      });
      if (!supplier) {
        res.status(404).json({ message: "Supplier not found" });
        return;
      }
      // Create the product
      const product = yield prisma.product.create({
        data: {
          name,
          category,
          price,
          stock,
          supplierId,
          description,
          SKU,
          isPerishable,
          seasonality,
          shelfLife,
          imageUrls,
        },
      });
      console.log("Product created:", product);
      res.status(201).json({
        message: "Product added successfully",
        product,
      });
      return;
    } catch (err) {
      console.error("Error in addProduct:", err);
      if (
        err instanceof client_1.Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        res.status(409).json({
          message: `A product with the same ${
            (_b =
              (_a = err.meta) === null || _a === void 0
                ? void 0
                : _a.target) !== null && _b !== void 0
              ? _b
              : "unknown"
          } already exists`,
        });
        return;
      }
      res
        .status(500)
        .json({ message: "Internal Server Error", error: console_1.error });
      return;
    }
  });
exports.addProduct = addProduct;
const updateProduct = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, category, description, price, stock } = req.body;
    try {
      const product = yield prisma.product.update({
        where: { id },
        data: {
          name,
          category,
          description,
          price,
          stock,
        },
      });
      res
        .status(200)
        .json({ message: "Product updated successfully", product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
      const product = yield prisma.product.delete({
        where: { id },
      });
      res
        .status(200)
        .json({ message: "Product deleted successfully", product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
exports.deleteProduct = deleteProduct;
const addProducts = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { products } = req.body;
    try {
      if (!products) {
        res.status(400).json({ message: "Products not found" });
      }
      const productsAdded = yield prisma.product.createMany({
        data: products,
      });
      if (!productsAdded) {
        res.status(400).json({ message: "Products not added" });
      }
      res
        .status(200)
        .json({ message: "Products added successfully", productsAdded });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
exports.addProducts = addProducts;
const getProductById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
      const getProduct = yield prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          category: true,
          description: true,
          price: true,
          stock: true,
        },
      });
      if (!getProduct) {
        res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product found", getProduct });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
exports.getProductById = getProductById;
const getProducts = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const getProducts = yield prisma.product.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          description: true,
          price: true,
          stock: true,
          imageUrls: true,
        },
      });
      res.status(200).json({ message: "Products found", getProducts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
exports.getProducts = getProducts;
const lowstock = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const lowStockItems = yield prisma.$queryRaw`
            SELECT * FROM "Inventory" 
            WHERE quantity <= threshold
        `;
      console.log(lowStockItems);
      if (lowStockItems.length === 0) {
        res.status(404).json({
          success: false,
          message: "No low stock items found",
        });
        return;
      }
      // Format the response
      const formattedItems = lowStockItems.map((item) => ({
        id: item.id,
        name: item.name,
        currentQuantity: item.quantity,
        threshold: item.threshold,
        reorderLevel: item.reorderLevel,
        needsReorder: item.quantity <= item.reorderLevel,
        supplier: item.supplier,
        lastUpdated: item.updatedAt,
      }));
      res.status(200).json({
        success: true,
        data: {
          items: formattedItems,
          summary: {
            totalLowStock: formattedItems.length,
            needingReorder: formattedItems.filter((item) => item.needsReorder)
              .length,
            criticalItems: formattedItems.filter(
              (item) => item.currentQuantity === 0
            ).length,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching low stock items:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  });
exports.lowstock = lowstock;
//need to add the perishable & another parameters
const checkInventoryLevels = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const inventoryItems = yield prisma.inventory.findMany({
        include: {
          product: {
            include: { supplier: true },
          },
        },
      });
      const reorderRequests = inventoryItems.map((item) => {
        const demandClassification = item.isDemand || "LOW"; // Default to 'LOW' if demandType does not exist
        const reorderQuantity = demandClassification
          ? calculateReorderQuantity(item, demandClassification)
          : 0;
        return {
          item,
          demandType: demandClassification,
          shouldReorder: demandClassification
            ? shouldTriggerReorder(item, demandClassification)
            : false,
          reorderQuantity,
        };
      });
      const reorderItems = reorderRequests.filter((req) => req.shouldReorder);
      const reorderResponses = [];
      for (const request of reorderItems) {
        const reorderResponse = yield createAdvancedReorder({
          inventoryId: request.item.id,
          quantity: request.reorderQuantity,
          demandType: request.demandType,
        });
        reorderResponses.push({
          inventoryId: request.item.id,
          productId: request.item.productId,
          quantity: request.reorderQuantity,
          demandType: request.demandType,
          status: reorderResponse,
        });
      }
      res.status(200).json({
        success: true,
        message: `${reorderItems.length} reorder(s) processed successfully.`,
        details: reorderResponses,
      });
    } catch (error) {
      console.error("Inventory Management Error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred during inventory management.",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
exports.checkInventoryLevels = checkInventoryLevels;
// Dynamic reorder quantity calculation
function calculateReorderQuantity(item, demandType) {
  const baseReorderQuantity = item.reorderQuantity;
  switch (demandType) {
    case "LOW":
      return Math.max(baseReorderQuantity, 10);
    case "MEDIUM":
      return Math.max(baseReorderQuantity * 1.5, 20);
    case "HIGH":
      return Math.max(baseReorderQuantity * 2, 50);
    default:
      return baseReorderQuantity;
  }
}
// Advanced reorder trigger conditions
function shouldTriggerReorder(item, demandType) {
  const criticalConditions = [
    item.quantity <= item.reorderLevel,
    item.quantity <= item.threshold,
    item.quantity <= calculateSafetyStock(item, demandType),
  ];
  return criticalConditions.some((condition) => condition);
}
// Dynamic safety stock calculation
function calculateSafetyStock(item, demandType) {
  const baseStock = item.safetyStock;
  switch (demandType) {
    case "LOW":
      return baseStock;
    case "MEDIUM":
      return baseStock * 1.5;
    case "HIGH":
      return baseStock * 2;
    default:
      return baseStock;
  }
}
// Predict market price
function predictMarketPrice(basePrice, demandType) {
  const adjustmentFactor = {
    LOW: 0.9, // 10% below the base price
    MEDIUM: 1.0, // Base price
    HIGH: 1.2, // 20% above the base price
  };
  return basePrice * (adjustmentFactor[demandType] || 1.0);
}
// Advanced reorder creation
function createAdvancedReorder(params) {
  return __awaiter(this, void 0, void 0, function* () {
    const inventoryItem = yield prisma.inventory.findUnique({
      where: { id: params.inventoryId },
      include: { product: { include: { supplier: true } } },
    });
    if (!inventoryItem || !inventoryItem.product.supplier) {
      return {
        success: false,
        message: `No supplier found for inventory ID: ${params.inventoryId}.`,
      };
    }
    const priorityStatus = getPriorityStatus(params.demandType);
    const proposedPrice = predictMarketPrice(
      inventoryItem.price,
      params.demandType
    );
    const order = yield prisma.order.create({
      data: {
        orderType: client_1.OrderType.SYSTEM,
        status: client_1.OrderStatus_new.REORDER_REQUESTED,
        supplierId: inventoryItem.product.supplier.id,
        totalAmount: inventoryItem.price * params.quantity,
        paymentStatus: client_1.PaymentStatus.PENDING,
        products: {
          create: {
            productId: inventoryItem.productId,
            quantity: params.quantity,
            negotiationStatus: "PENDING",
            proposedPrice, // Include the predicted price
          },
        },
        orderNotes: `Auto-reorder: ${params.demandType} demand product`,
      },
    });
    return {
      success: true,
      message: `Reorder created for inventory ID: ${params.inventoryId}.`,
      priorityStatus,
      order,
    };
  });
}
// Map demand type to order priority
function getPriorityStatus(demandType) {
  switch (demandType) {
    case "LOW":
      return "REORDER_REQUESTED";
    case "MEDIUM":
      return "PRICE_PROPOSED";
    case "HIGH":
      return "IN_PRODUCTION";
    default:
      return "UNKNOWN";
  }
}
// Manager reviews price proposal
const reviewPriceProposal = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { decision, negotiationNotes } = req.body;
    try {
      const newStatus =
        decision === "APPROVE" ? "PRICE_APPROVED" : "PRICE_NEGOTIATING";
      const order = yield prisma.order.update({
        where: { id: orderId },
        data: {
          status: newStatus,
          orderNotes: negotiationNotes,
          products: {
            updateMany: {
              where: { orderId },
              data: {
                negotiationStatus:
                  decision === "APPROVE" ? "APPROVED" : "NEGOTIATING",
              },
            },
          },
          statusHistory: {
            create: {
              status: newStatus,
              changedBy: req.user ? req.user.id : "unknown",
              comments: negotiationNotes,
            },
          },
        },
      });
      // If approved, notify supplier to start production
      // if (decision === 'APPROVE') {
      //   await notifySupplierForProduction(order.id);
      // }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to process price review" });
    }
  });
exports.reviewPriceProposal = reviewPriceProposal;
const qualityCheck = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { qcStatus, rejectionReason, comments, parameters } = req.body; // qcStatus can be "PASSED" or "FAILED"
    console.log("Order ID:", orderId);
    console.log("QC Status:", qcStatus);
    try {
      // Fetch the order
      const order = yield prisma.order.findUnique({
        where: { id: orderId },
      });
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      // Create a new quality check record
      const qualityCheck = yield prisma.orderQualityCheck.create({
        data: {
          orderId: orderId,
          checkedBy: req.user ? req.user.id : "unknown",
          status: qcStatus === "APPROVED" ? "APPROVED" : "REJECTED",
          comments: comments || "",
          parameters: parameters || {},
        },
      });
      // If QC failed, update status to REJECTED and add rejection reason
      if (qcStatus === "REJECTED") {
        yield prisma.order.update({
          where: { id: orderId },
          data: {
            status: "REJECTED", // Set order status to REJECTED due to QC failure
            rejectionReason: rejectionReason || "No reason provided",
            statusHistory: {
              create: {
                status: "REJECTED",
                changedBy: req.user ? req.user.id : "unknown",
                comments: `Order rejected due to QC failure: ${
                  rejectionReason || "No reason provided"
                }`,
              },
            },
          },
        });
        res.json({
          message: "Order has been rejected due to QC failure",
          qualityCheck,
        });
        return;
      }
      // If QC passed, keep the status as SHIPPED (no change to status)
      yield prisma.order.update({
        where: { id: orderId },
        data: {
          statusHistory: {
            create: {
              status: client_1.OrderStatus_new.DELIVERED, // Keeping the status as SHIPPED for passed QC
              changedBy: req.user ? req.user.id : "unknown",
              comments: "Order passed QC",
            },
          },
        },
      });
      res.json({ message: "Order has passed QC and remains SHIPPED" });
      return;
    } catch (error) {
      console.error("Error during QC process:", error);
      res.status(500).json({ error: "Failed to perform QC check" });
    }
  });
exports.qualityCheck = qualityCheck;
const markOrderAsDelivered = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { deliveryStatus, rejectionReason } = req.body; // deliveryStatus can be "DELIVERED" or "REJECTED"
    console.log("Order ID:", orderId);
    console.log("Delivery Status:", deliveryStatus);
    try {
      // Fetch the order
      const order = yield prisma.order.findUnique({
        where: { id: orderId },
      });
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      // If the order is rejected, update status to REJECTED with the rejection reason
      if (deliveryStatus === "REJECTED") {
        const orderDelivered = yield prisma.order.update({
          where: { id: orderId },
          data: {
            status: "REJECTED",
            rejectionReason: rejectionReason || "No reason provided",
            statusHistory: {
              create: {
                status: "REJECTED",
                changedBy: req.user ? req.user.id : "unknown",
                comments: `Order rejected during delivery: ${
                  rejectionReason || "No reason provided"
                }`,
              },
            },
          },
        });
        res.json({ message: "Order has been rejected during delivery" });
        return;
      }
      // If delivered, update the status to DELIVERED and set the delivery date
      const orderDelivered = yield prisma.order.update({
        where: { id: orderId },
        data: {
          status: "DELIVERED",
          actualDeliveryDate: new Date(),
          statusHistory: {
            create: {
              status: "DELIVERED",
              changedBy: req.user ? req.user.id : "unknown",
              comments: "Order delivered successfully",
            },
          },
        },
      });
      res.json({
        message: "Order has been delivered successfully",
        orderDelivered,
      });
    } catch (error) {
      console.error("Error during delivery process:", error);
      res.status(500).json({ error: "Failed to update delivery status" });
    }
  });
exports.markOrderAsDelivered = markOrderAsDelivered;
// Automatic inventory check and reorder trigger
// export const checkInventoryLevels = async () => {
//   try {
//     const lowStockItems = await prisma.inventory.findMany({
//       where: {
//         quantity: {
//           lte: { reorderLevel }
//         }
//       },
//       include: {
//         product: {
//           include: {
//             supplier: true
//           }
//         }
//       }
//     });
//     for (const item of lowStockItems) {
//       await initiateReorderProcess(item);
//     }
//   } catch (error) {
//     console.error('Inventory check failed:', error);
//   }
// };
// Initiate reorder process
// export const initiateReorderProcess = async (item: any) => {
//   try {
//     const order = await prisma.order.create({
//       data: {
//         orderType: 'SUPPLIER',
//         status: 'REORDER_REQUESTED',
//         supplierId: item.product.supplierId,
//         totalAmount: 0, // Will be calculated after price approval
//         paymentStatus: 'PENDING',
//         expectedDeliveryDate: calculateExpectedDelivery(item.product.supplier.leadTime),
//         products: {
//           create: {
//             productId: item.productId,
//             quantity: item.reorderQuantity,
//             requestedPrice: item.price,
//             negotiationStatus: 'PENDING'
//           }
//         },
//         // statusHistory: {
//         //   create: {
//         //     status: 'REORDER_REQUESTED',
//         //     changedBy: 'SYSTEM',
//         //     comments: `Automatic reorder triggered for ${item.name}`
//         //   }
//         // }
//       }
//     });
//     // Notify supplier
//     //await notifySupplier(order.id);  --email
//     return order;
//   } catch (error) {
//     console.error('Reorder initiation failed:', error);
//     throw error;
//   }
// };
// export const createReorder = async (req: Request, res: Response) => {
//     const { inventoryID } = req.body;
//     try {
//         if (!Array.isArray(inventoryID) || inventoryID.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide an array of product IDs",
//             });
//         }
//         // Fetch inventory items with extended relations
//         const inventoryItems = await prisma.inventory.findMany({
//             where: {
//                 id: {
//                     in: inventoryID,
//                 },
//             },
//             include: {
//                 product: {
//                     include: {
//                         supplier: true, // Include supplier details for delivery calculation
//                     }
//                 },
//                 transactions: {
//                     // Get recent transactions for demand analysis
//                     take: 30,
//                     orderBy: {
//                         createdAt: 'desc'
//                     }
//                 }
//             },
//         });
//         if (inventoryItems.length !== inventoryID.length) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Some products were not found",
//             });
//         }
//         const supplierOrders = new Map();
//         // Calculate optimal delivery dates and quantities
//         inventoryItems.forEach((item) => {
//             if (item.quantity >= item.threshold) return;
//             // Calculate daily consumption rate based on recent transactions
//             const dailyConsumption = calculateDailyConsumption(item.transactions);
//             // Calculate days until stock-out
//             const daysUntilStockout = Math.floor(item.quantity / dailyConsumption);
//             // Calculate optimal reorder quantity considering:
//             // 1. Daily consumption rate
//             // 2. Supplier lead time (assumed from supplier data or set default)
//             // 3. Safety stock requirements
//             const leadTime = item.product?.supplier?.leadTime || 7; // Default 7 days if not specified
//             const safetyStock = Math.ceil(dailyConsumption * 3); // 3 days safety stock
//             const optimalReorderQuantity = Math.max(
//                 item.reorderQuantity,
//                 Math.ceil((dailyConsumption * (leadTime + 5)) + safetyStock - item.quantity)
//             );
//             // Calculate delivery date based on:
//             // 1. Current stock level
//             // 2. Lead time
//             // 3. Safety margin
//             const deliveryDate = calculateDeliveryDate({
//                 daysUntilStockout,
//                 leadTime,
//                 isPerishable: Boolean(item.expirationDate),
//                 currentQuantity: item.quantity,
//                 dailyConsumption
//             });
//             if (!item.product?.supplierId) {
//                 throw new Error(`No supplier found for inventory item: ${item.name}`);
//             }
//             if (!supplierOrders.has(item.product.supplierId)) {
//                 supplierOrders.set(item.product.supplierId, []);
//             }
//             supplierOrders.get(item.product.supplierId).push({
//                 ...item,
//                 reorderQuantity: optimalReorderQuantity,
//                 deliveryDate,
//                 isUrgent: daysUntilStockout < leadTime
//             });
//         });
//         // Create orders for each supplier
//         const orders = await Promise.all(
//             Array.from(supplierOrders.entries()).map(async ([supplierId, items]) => {
//                 const orderTotal = items.reduce(
//                     (sum: number, item: { reorderQuantity: number; price: number }) =>
//                         sum + item.reorderQuantity * item.price,
//                     0
//                 );
//                 // Find earliest delivery date among items
//                 const earliestDeliveryDate = items.reduce(
//                     (earliest: Date, item: { deliveryDate: Date; isUrgent: boolean }) => {
//                         if (item.isUrgent || earliest > item.deliveryDate) {
//                             return item.deliveryDate;
//                         }
//                         return earliest;
//                     },
//                     new Date(8640000000000000) // Max date
//                 );
//                 return prisma.order.create({
//                     data: {
//                         supplierId,
//                         orderType: OrderType.MANAGER,
//                         status: OrderStatus.ORDERED,
//                         totalAmount: orderTotal,
//                         paymentStatus: PaymentStatus.PENDING,
//                         deliveryDate: earliestDeliveryDate,
//                         products: {
//                             create: items.map((item: any) => ({
//                                 productId: item.productId,
//                                 quantity: item.reorderQuantity,
//                                 price: item.price,
//                                 requestedPrice: item.price,
//                                 negotiationStatus: "PENDING"
//                             })),
//                         },
//                     },
//                     include: {
//                         products: {
//                             include: {
//                                 product: true,
//                             },
//                         },
//                         supplier: true,
//                     },
//                 });
//             })
//         );
//         return res.status(201).json({
//             success: true,
//             message: "Reorder orders created successfully",
//             data: {
//                 orders,
//                 summary: {
//                     totalOrders: orders.length,
//                     totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
//                     totalSuppliers: supplierOrders.size,
//                     averageDeliveryTime: calculateAverageDeliveryTime(orders)
//                 },
//             },
//         });
//     } catch (error) {
//         console.error("Error creating reorder:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error instanceof Error ? error.message : "Unknown error occurred",
//         });
//     }
// };
// Helper functions
// function calculateDailyConsumption(transactions: Transaction[]): number {
//     if (transactions.length === 0) return 1;
//     const totalQuantity = transactions.reduce((sum, t) => sum + t.quantity, 0);
//     const daysDiff = Math.max(
//         1,
//         differenceInDays(
//             new Date(),
//             transactions[transactions.length - 1].createdAt
//         )
//     );
//     return Math.max(1, Math.ceil(totalQuantity / daysDiff));
// }
// function calculateDeliveryDate({
//     daysUntilStockout,
//     leadTime,
//     isPerishable,
//     currentQuantity,
//     dailyConsumption
// }: {
//     daysUntilStockout: number;
//     leadTime: number;
//     isPerishable: boolean;
//     currentQuantity: number;
//     dailyConsumption: number;
// }): Date {
//     // For perishable items, we want to order closer to stock-out
//     const bufferDays = isPerishable ? 2 : 5;
//     // Calculate optimal delivery date
//     const daysUntilDelivery = Math.max(
//         1,
//         daysUntilStockout - bufferDays
//     );
//     // If we're getting close to stockout, expedite the order
//     const finalDeliveryDate = new Date();
//     if (daysUntilStockout < leadTime + bufferDays) {
//         finalDeliveryDate.setDate(finalDeliveryDate.getDate() + Math.max(1, leadTime));
//     } else {
//         finalDeliveryDate.setDate(finalDeliveryDate.getDate() + daysUntilDelivery);
//     }
//     return finalDeliveryDate;
// }
// function calculateAverageDeliveryTime(orders: Order[]): number {
//     if (orders.length === 0) return 0;
//     const totalDays = orders.reduce((sum, order) => {
//         if (!order.deliveryDate) return sum;
//         return sum + differenceInDays(order.deliveryDate, new Date());
//     }, 0);
//     return Math.ceil(totalDays / orders.length);
// }
// const notifySupplier = async (orderId: string) => {
//     try {
//         // Fetch the order details including supplier information
//         const order = await prisma.order.findUnique({
//             where: { id: orderId },
//             include: {
//                 supplier: true,
//                 products: {
//                     include: {
//                         product: true
//                     }
//                 }
//             }
//         });
//         if (!order || !order.supplier) {
//             throw new Error("Order or supplier not found");
//         }
//         // Construct the notification message
//         const message = `
//             Dear ${order.supplier.name},
//             A new reorder request has been placed for the following products:
//             ${order.products.map(p => `- ${p.product.name}: ${p.quantity} units`).join('\n')}
//             Please review and confirm the order at your earliest convenience.
//             Best regards,
//             Inventory Management System
//         `;
//         // Simulate sending an email to the supplier
//         console.log(`Sending email to ${order.supplier.email}:\n${message}`);
//         // Here you would integrate with an actual email service
//         // e.g., using nodemailer or any other email service provider
//     } catch (error) {
//         console.error('Failed to notify supplier:', error);
//     }
// };
// function notifySupplier(id: string) {
//     throw new Error("Function not implemented.");
// }
