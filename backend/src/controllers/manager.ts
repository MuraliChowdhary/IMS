import { Request, Response, NextFunction } from "express"
import { PrismaClient, Prisma, PaymentStatus, OrderType, OrderStatus_new, Inventory,DemandType,QCStatus } from '@prisma/client';


import bcrypt from 'bcrypt';
import { body } from 'express-validator';
import { products } from './customer';
import { threadId } from "worker_threads";
import { processPayment } from './cashier';

const prisma = new PrismaClient();
export const listInventory = async (req: Request, res: Response) => {

    try {
        const inventory = await prisma.inventory.findMany();
        if (!inventory) {
            res.status(404).json({ message: "No inventory found" })

        }

        res.status(200).json({ inventory })

    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }

}

export const getInventoryItem = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const inventoryItem = await prisma.inventory.findUnique({ where: { id: id } });
        if (!inventoryItem) {
            res.status(404).json({ message: "Inventory item not found" })
            return;
        }
        res.status(200).json({ inventoryItem })
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const addInventoryItem = async (req: Request, res: Response) => {
    const { productId, quantity, threshold, price, expirationDate, reorderLevel, reorderQuantity } = req.body;

    try {
        // Check if the product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                id: true,
                name: true,
                category: true,
                supplierId: true
            }
        });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        // Create the inventory item
        const inventoryItem = await prisma.inventory.create({
            data: {
                name: product.name, // Assuming name is linked to product
                category: product.category || "",
                quantity,
                threshold,
                price,
                expirationDate,
                reorderLevel, // Include the reorderLevel property
                reorderQuantity, // Include the reorderQuantity property
                product: { connect: { id: productId } },
            },
        });

        // Update the supplierId in the inventory item if it exists
        if (product.supplierId) {
            await prisma.inventory.update({
                where: { id: inventoryItem.id },
                data: {
                    supplierId: product.supplierId, // Setting the supplierId for the inventory item
                },
            });
        }

        // Success response
        res.status(201).json({ message: "Inventory item added successfully", inventoryItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};







export const updateInventory = async (req: Request, res: Response) => {
    const { id } = req.params; // Get the inventory item ID from the URL parameter
    const { quantity, threshold, price, expirationDate } = req.body; // Get the new data from the request body

    try {
        // Find the inventory item by ID
        const inventoryItem = await prisma.inventory.findUnique({
            where: { id },
        });

        if (!inventoryItem) {
            res.status(404).json({ message: 'Inventory item not found' });
            return
        }

        // Update the inventory item
        const updatedInventoryItem = await prisma.inventory.update({
            where: { id },
            data: {
                quantity,
                threshold,
                price,
                expirationDate,
            },
        });

        res.status(200).json({ message: 'Inventory item updated successfully', updatedInventoryItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

     
export const addProduct = async (req: Request, res: Response) => {
  const {
    name,
    category,
    description, // Optional
    price,
    stock,
    supplierId,
    SKU, // Optional
    isPerishable = false, // Optional with a default value
    seasonality, // Optional
    shelfLife, // Optional
  } = req.body;

  // Validate required fields
  if (!name || !category || !price || stock === undefined || !supplierId) {
     res.status(400).json({ message: "Missing required fields" });
     return
  }

  try {
    // Check if the supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
       res.status(404).json({ message: "Supplier not found" });
       return
    }

    // Create the product (conditionally include optional fields)
    const product = await prisma.product.create({
      data: {
        name,
        category,
        price,
        stock,
        supplierId,
        ...(description && { description }), // Add if provided
        ...(SKU && { SKU }), // Add if provided
        isPerishable,
        ...(seasonality && { seasonality }), // Add if provided
        ...(shelfLife !== undefined && { shelfLife }), // Add if provided
      },
    });

     res.status(201).json({
      message: "Product added successfully",
      product,
    });
    return
  } catch (err) {
    console.error(err);

    // Handle unique constraint errors (e.g., SKU uniqueness)
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
       res.status(409).json({
        message: `A product with the same ${err.meta?.target ?? 'unknown'} already exists`,
      });
    }

     res.status(500).json({ message: "Internal Server Error" });
     return
  }
};


export const updateProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name, category, description, price, stock } = req.body;
    try {
        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                category,
                description,
                price,
                stock
            }
        })
        res.status(200).json({ message: "Product updated successfully", product })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const product = await prisma.product.delete({
            where: { id }
        })
        res.status(200).json({ message: "Product deleted successfully", product })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const addProducts = async (req: Request, res: Response) => {
    const { products } = req.body;
    try {
        if (!products) {
            res.status(400).json({ message: "Products not found" })
        }

        const productsAdded = await prisma.product.createMany({
            data: products
        })
        if (!productsAdded) {
            res.status(400).json({ message: "Products not added" })
        }
        res.status(200).json({ message: "Products added successfully", productsAdded })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
}


export const getProductById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const getProduct = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                category: true,
                description: true,
                price: true,
                stock: true

            }
        })
        if (!getProduct) {
            res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json({ message: "Product found", getProduct })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getProducts = async (req: Request, res: Response) => {
    try {
        const getProducts = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                category: true,
                description: true,
                price: true,
                stock: true
            }
        })
        res.status(200).json({ message: "Products found", getProducts })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
}


// Get all low stock items
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

        // Format the response
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




 
 
 //need to add the perishable & another parameters
 
 
 
 
 export const checkInventoryLevels = async (req: Request, res: Response): Promise<void> => {
   try {
     const inventoryItems = await prisma.inventory.findMany({
       include: {
         product: {
           include: { supplier: true },
         },
       },
     });
 
     const reorderRequests = inventoryItems.map((item) => {
       const demandClassification = item.product.isDemand;
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
 
     const reorderResponses: any[] = [];
     for (const request of reorderItems) {
       const reorderResponse = await createAdvancedReorder({
         inventoryId: request.item.id,
         quantity: request.reorderQuantity,
         demandType: request.demandType!,
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
     console.error('Inventory Management Error:', error);
     res.status(500).json({
       success: false,
       message: 'An error occurred during inventory management.',
       error: error instanceof Error ? error.message : String(error),
     });
   }
 };
 
 // Dynamic reorder quantity calculation
 function calculateReorderQuantity(
   item: { reorderQuantity: number },
   demandType: string
 ): number {
   const baseReorderQuantity = item.reorderQuantity;
 
   switch (demandType) {
     case 'LOW':
       return Math.max(baseReorderQuantity, 10);
     case 'MEDIUM':
       return Math.max(baseReorderQuantity * 1.5, 20);
     case 'HIGH':
       return Math.max(baseReorderQuantity * 2, 50);
     default:
       return baseReorderQuantity;
   }
 }
 
 // Advanced reorder trigger conditions
 function shouldTriggerReorder(
   item: { quantity: number; reorderLevel: number; threshold: number; safetyStock: number },
   demandType: string
 ): boolean {
   const criticalConditions = [
     item.quantity <= item.reorderLevel,
     item.quantity <= item.threshold,
     item.quantity <= calculateSafetyStock(item, demandType),
   ];
 
   return criticalConditions.some((condition) => condition);
 }
 
 // Dynamic safety stock calculation
 function calculateSafetyStock(
   item: { safetyStock: number },
   demandType: string
 ): number {
   const baseStock = item.safetyStock;
 
   switch (demandType) {
     case 'LOW':
       return baseStock;
     case 'MEDIUM':
       return baseStock * 1.5;
     case 'HIGH':
       return baseStock * 2;
     default:
       return baseStock;
   }
 }
 
 // Predict market price
 function predictMarketPrice(basePrice: number, demandType: string): number {
   const adjustmentFactor = {
     LOW: 0.9, // 10% below the base price
     MEDIUM: 1.0, // Base price
     HIGH: 1.2, // 20% above the base price
   };
   return basePrice * (adjustmentFactor[demandType as keyof typeof adjustmentFactor] || 1.0);
 }
 
 // Advanced reorder creation
 async function createAdvancedReorder(params: {
   inventoryId: string;
   quantity: number;
   demandType: string;
 }): Promise<{ success: boolean; message: string; priorityStatus?: string; order?: any }> {
   const inventoryItem = await prisma.inventory.findUnique({
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
   const proposedPrice = predictMarketPrice(inventoryItem.price, params.demandType);
 
   const order = await prisma.order.create({
     data: {
       orderType: OrderType.SYSTEM,
       status: OrderStatus_new.REORDER_REQUESTED,
       supplierId: inventoryItem.product.supplier.id,
       totalAmount: inventoryItem.price * params.quantity,
       paymentStatus: PaymentStatus.PENDING,
       products: {
         create: {
           productId: inventoryItem.productId,
           quantity: params.quantity,
           negotiationStatus: 'PENDING',
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
 }
 
 // Map demand type to order priority
 function getPriorityStatus(demandType: string): string {
   switch (demandType) {
     case 'LOW':
       return 'REORDER_REQUESTED';
     case 'MEDIUM':
       return 'PRICE_PROPOSED';
     case 'HIGH':
       return 'IN_PRODUCTION';
     default:
       return 'UNKNOWN';
   }
 }
 





// Manager reviews price proposal
export const reviewPriceProposal = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { decision, negotiationNotes } = req.body;

  try {
    const newStatus = decision === 'APPROVE' ? 'PRICE_APPROVED' : 'PRICE_NEGOTIATING';
    
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        orderNotes: negotiationNotes,
        products: {
          updateMany: {
            where: { orderId },
            data: {
              negotiationStatus: decision === 'APPROVE' ? 'APPROVED' : 'NEGOTIATING'
            }
          }
        },
        statusHistory: {
          create: {
            status: newStatus,
            changedBy: req.user ? req.user.id : 'unknown',
            comments: negotiationNotes
          }
        }
      }
    });

    // If approved, notify supplier to start production
    // if (decision === 'APPROVE') {
    //   await notifySupplierForProduction(order.id);
    // }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process price review' });
  }
};



export const qualityCheck = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { qcStatus, rejectionReason, comments, parameters } = req.body; // qcStatus can be "PASSED" or "FAILED"
  
  console.log('Order ID:', orderId);
  console.log('QC Status:', qcStatus);

  try {
    // Fetch the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
       res.status(404).json({ error: 'Order not found' });
       return
    }

    // Create a new quality check record
    const qualityCheck = await prisma.orderQualityCheck.create({
      data: {
        orderId: orderId,
        checkedBy: req.user ? req.user.id : 'unknown',
        status: qcStatus === 'APPROVED' ? 'APPROVED' as QCStatus : 'REJECTED' as QCStatus,
        comments: comments || '',
        parameters: parameters || {},
      },
    });

    // If QC failed, update status to REJECTED and add rejection reason
    if (qcStatus === 'REJECTED') {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'REJECTED',  // Set order status to REJECTED due to QC failure
          rejectionReason: rejectionReason || 'No reason provided',
          statusHistory: {
            create: {
              status: 'REJECTED',
              changedBy: req.user ? req.user.id : 'unknown',
              comments: `Order rejected due to QC failure: ${rejectionReason || 'No reason provided'}`,
            },
          },
        },
      });

       res.json({ message: 'Order has been rejected due to QC failure',qualityCheck });
       return
    }

    // If QC passed, keep the status as SHIPPED (no change to status)
    await prisma.order.update({
      where: { id: orderId },
      data: {
        statusHistory: {
          create: {
            status: OrderStatus_new.DELIVERED,  // Keeping the status as SHIPPED for passed QC
            changedBy: req.user ? req.user.id : 'unknown',
            comments: 'Order passed QC',
          },
        },
      },
    });

     res.json({ message: 'Order has passed QC and remains SHIPPED' });
     return
  } catch (error) {
    console.error('Error during QC process:', error);
    res.status(500).json({ error: 'Failed to perform QC check' });
  }
};



export const markOrderAsDelivered = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { deliveryStatus, rejectionReason } = req.body; // deliveryStatus can be "DELIVERED" or "REJECTED"

  console.log('Order ID:', orderId);
  console.log('Delivery Status:', deliveryStatus);

  try {
    // Fetch the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
       res.status(404).json({ error: 'Order not found' });
       return
    }

    // If the order is rejected, update status to REJECTED with the rejection reason
    if (deliveryStatus === 'REJECTED') {
     const orderDelivered =  await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'REJECTED',
          rejectionReason: rejectionReason || 'No reason provided',
          statusHistory: {
            create: {
              status: 'REJECTED',
              changedBy: req.user ? req.user.id : 'unknown',
              comments: `Order rejected during delivery: ${rejectionReason || 'No reason provided'}`,
            },
          },
        },
      });

       res.json({ message: 'Order has been rejected during delivery' });
       return
    }

    // If delivered, update the status to DELIVERED and set the delivery date
    const orderDelivered = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'DELIVERED',
        actualDeliveryDate: new Date(),
        statusHistory: {
          create: {
            status: 'DELIVERED',
            changedBy: req.user ? req.user.id : 'unknown',
            comments: 'Order delivered successfully',
          },
        },
      },
    });

     res.json({ message: 'Order has been delivered successfully',orderDelivered });
     
  } catch (error) {
    console.error('Error during delivery process:', error);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
};




























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

