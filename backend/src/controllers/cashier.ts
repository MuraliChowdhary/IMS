require("dotenv").config()
import { OrderStatus_new, OrderType, PaymentStatus, PrismaClient, TransactionType, } from '@prisma/client';
import { Request, Response, NextFunction } from "express"
import crypto from "crypto";
import Razorpay from 'razorpay';
const { KEY_SECRET } = process.env;

import PDFDocument from "pdfkit";
import bwipjs from "bwip-js"; // For generating barcodes
import { CANCELLED } from 'dns';


if (!KEY_SECRET) {
    throw new Error("KEY_SECRET is not defined in environment variables");
}
const prisma = new PrismaClient();
export const products = async (req: Request, res: Response) => {
    try {

        const products = await prisma.product.findMany();
        if (!products) {
            res.status(404).json({ message: "No products found" })
            return;
        }
        res.status(200).json({
            status: 200,
            message: "Products fetched successfully",
            data: products
        })
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error", error: err })
    }
}



// Initialize Razorpay client with your API keys
const razorpay = new Razorpay({
    key_id: 'rzp_test_eieHlTMTtnQ3n3', // Your Razorpay Key ID
    key_secret: 'HQqAP8TFRMV5ub7YKmQ2zxxG' // Your Razorpay Key Secret
});

// Controller to create an order
// export const order = async (req: Request, res: Response) => {
//     const { id,customerId, products }: {id:string, customerId: string; products: { productId: string; quantity: number }[] } = req.body;

//     try {
//         let totalAmount = 0;
//         const orderProducts = [];
//         const productIds = products.map((p) => p.productId).filter((id) => id !== undefined);
//         console.log("Filtered productIds:", productIds);

//         const fetchedProducts = await prisma.product.findMany({
//             where: { id: { in: productIds } },
//         });

//         const productMap = new Map(fetchedProducts.map((p) => [p.id, p]));

//         for (const { productId, quantity } of products) {
//             const product = productMap.get(productId);

//             if (!product) {
//                 res.status(400).json({ message: `Product with ID ${productId} not found` });
//                 return;
//             }

//             if (product.stock < quantity) {
//                 res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
//                 return;
//             }

//             const productTotal = product.price * quantity;
//             totalAmount += productTotal;

//             orderProducts.push({
//                 productId: product.id,
//                 quantity,
//                 price: product.price,
//             });
//         }

//         totalAmount = parseFloat(totalAmount.toFixed(2));

//         const razorpayOrder = await razorpay.orders.create({
//             amount: Math.round(totalAmount * 100),
//             currency: 'INR',
//             receipt: `order_receipt_${Date.now()}`,
//             payment_capture: true,
//         });

//         const newOrder = await prisma.order.create({
//             data: {
//                 customerId,
//                 status: OrderStatus_new.PENDING,
//                 totalAmount,
//                 paymentStatus: PaymentStatus.PENDING,
//                 orderType: OrderType.CUSTOMER,
//                 razorpayOrderId: razorpayOrder.id,
//                 products: {
//                     create: orderProducts.map((orderProduct) => ({
//                         productId: orderProduct.productId,
//                         quantity: orderProduct.quantity,
//                         requestedPrice: orderProduct.price,
//                     })),
//                 },
//             },
//             include: {
//                 products: true,
//             },
//         });

//         res.status(201).json({
//             message: "Order created successfully",
//             order: newOrder,
//             razorpay_order_id: razorpayOrder.id,
//             amount: totalAmount,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", error: (error as Error).message });
//     }
// };
export const order = async (req: Request, res: Response) => {
    const { orderId, customerId, products }: { orderId: string, customerId: string; products: { productId: string; quantity: number }[] } = req.body;

    try {
        let totalAmount = 0;
        const orderProducts = [];
        const productIds = products.map((p) => p.productId).filter((id) => id !== undefined);
        console.log("Filtered productIds:", productIds);

        const fetchedProducts = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        const productMap = new Map(fetchedProducts.map((p) => [p.id, p]));

        for (const { productId, quantity } of products) {
            const product = productMap.get(productId);

            if (!product) {
                res.status(400).json({ message: `Product with ID ${productId} not found` });
                return
            }

            if (product.stock < quantity) {
                res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
                return
            }

            const productTotal = product.price * quantity;
            totalAmount += productTotal;

            orderProducts.push({
                productId: product.id,
                quantity,
                price: product.price,
            });
        }

        totalAmount = parseFloat(totalAmount.toFixed(2));

        // Check if order exists using `orderId`
        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: { products: true },
        });

        if (!existingOrder) {
            res.status(404).json({ message: `Order with ID ${orderId} not found` });
            return
        }

        // **Update existing order**
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                totalAmount,
                products: {
                    deleteMany: {}, // Remove all existing products in the order
                    create: orderProducts.map((orderProduct) => ({
                        productId: orderProduct.productId,
                        quantity: orderProduct.quantity,
                        requestedPrice: orderProduct.price,
                    })),
                },
            },
            include: { products: true },
        });

        res.status(200).json({
            message: "Order updated successfully",
            order: updatedOrder,
        });
        return

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: (error as Error).message });
    }
};




export const processPayment = async (req: Request, res: Response) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;
        console.log(req.body)
        // Comprehensive input validation
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            res.status(400).json({ message: "Missing payment details" });
            return
        }

        // Signature validation
        const generatedSignature = crypto
            .createHmac("sha256", KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            res.status(400).json({ message: "Invalid payment signature" });
            return
        }

        // Find order using either razorpayOrderId or by matching other conditions
        const order = await prisma.order.findFirst({
            where: {
                OR: [
                    { razorpayOrderId: razorpay_order_id },
                    { id: razorpay_order_id }
                ]
            },
            include: {
                customer: true,
                products: true,
            },
        });

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return
        }

        if (order.paymentStatus === PaymentStatus.PAID) {
            res.status(400).json({ message: "Payment already processed" });
            return
        }

        // Update order with fallback on ID
        const updatedOrder = await prisma.order.update({
            where: {
                id: order.id  // Use the found order's ID
            },
            data: {
                paymentStatus: PaymentStatus.PAID,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: OrderStatus_new.COMPLETED,
            },
        });



        // Batch inventory and transaction updates
        // const transactionPromises = order.products.map(async (product) => {
        //     const productDetails = await prisma.product.findUnique({
        //         where: { id: product.productId }
        //     });

        //     if (!productDetails) {
        //         throw new Error(`Product with ID ${product.productId} not found`);
        //     }

        //     // Parallel transaction and inventory updates
        //     Promise.all([
        //         prisma.transaction.create({
        //             data: {
        //                 productId: product.productId,
        //                 quantity: product.quantity,
        //                 total: product.quantity * productDetails.price,
        //                 cashierId: req.user?.id,
        //                 transactionType: TransactionType.SALE,
        //             },
        //         }),
        //         prisma.inventory.update({
        //             where: { id:inventory.id },
        //             data: { quantity: { decrement: product.quantity } },
        //         })

        //     ]);
        // });
        const transactionPromises = order.products.map(async (product) => {
            const productDetails = await prisma.product.findUnique({
                where: { id: product.productId },
            });

            if (!productDetails) {
                throw new Error(`Product with ID ${product.productId} not found`);
            }

            // Now, check the inventory for the same productId, not just the productId
            const inventory = await prisma.inventory.findFirst({
                where: {
                    productId: product.productId  // Find inventory by productId
                },
                select: {
                    id: true,               // Include the ID of the inventory record
                    productId: true,        // Include the productId (for validation or reference)
                    quantity: true,         // You can add other fields if needed
                    price: true
                }
            });

            if (!inventory) {
                throw new Error(`Inventory record not found for Product ID ${product.productId}`);
            }

            if (!inventory) {
                throw new Error(`Inventory record not found for Product ID ${product.productId}`);
            }

            // Parallel transaction and inventory updates
            await Promise.all([
                prisma.transaction.create({
                    data: {
                        productId: product.productId,
                        quantity: product.quantity,
                        total: product.quantity * productDetails.price,
                        cashierId: req.user?.id,
                        transactionType: TransactionType.SALE,
                    },
                }),
                prisma.inventory.update({
                    where: { id: inventory.id },  // Now using the inventory id instead of productId
                    data: { quantity: { decrement: product.quantity } },
                }),
            ]);
        });

        await Promise.all(transactionPromises);


        console.log(updatedOrder)
        // Wait for all updates to complete
        await Promise.all(transactionPromises);

        res.status(200).json({
            message: "Payment processed successfully",
            order: updatedOrder
        });
        return


    } catch (error) {
        console.error("Payment Processing Error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : 'Unknown error'

        });
        return
    }
};



export const transaction = async (req: Request, res: Response) => {
    try {
        const transactions = await prisma.transaction.findMany();
        if (!transactions) {
            res.status(404).json({ message: "No transactions found" })
            return;
        }
        res.status(200).json(transactions);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
}



export const generateReceipt = async (req: Request, res: Response) => {
    try {
        const { orderId, includeBarcode } = req.body;

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { products: { include: { product: true } } },
        });

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        const receipt = {
            orderId: order.id,
            products: order.products.map((p) => ({
                name: p.product.name,
                quantity: p.quantity,
                price: p.product.price,
            })),
            totalAmount: order.totalAmount,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt,
        };

        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => {
            const pdfBuffer = Buffer.concat(chunks);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename=receipt_${order.id}.pdf`
            );
            res.send(pdfBuffer);
        });

        // Header
        doc.fontSize(20).text("Prime Mart", { align: "center" });
        doc.fontSize(10).text("Address: Warangal Hanmakonda, 23-10", { align: "center" });
        doc.text("Tel: 11223344", { align: "center" });
        doc.moveDown();
        doc.text("**************************************", { align: "center" });
        doc.fontSize(14).text("CASH RECEIPT", { align: "center" });
        doc.text("**************************************", { align: "center" });
        doc.moveDown();

        // Order Details
        doc.fontSize(12).text(`Order ID: ${receipt.orderId}`);
        doc.text(`Payment Status: ${receipt.paymentStatus}`);
        doc.text(`Total Amount: $${receipt.totalAmount.toFixed(2)}`);
        doc.text(`Order Date: ${receipt.createdAt.toDateString()}`);
        doc.moveDown();

        // Product Details
        doc.text("Description          Price");
        receipt.products.forEach((product) => {
            doc.text(
                `${product.name.padEnd(20)} $${(product.price * product.quantity).toFixed(2)}`
            );
        });

        // Total
        doc.moveDown();
        doc.fontSize(12).text("**************************************");
        doc.fontSize(14).text(`Total Amount: $${receipt.totalAmount.toFixed(2)}`);
        doc.fontSize(12).text("**************************************");

        // Barcode (Optional)
        if (includeBarcode) {
            const barcode = await bwipjs.toBuffer({
                bcid: "code128", // Barcode type
                text: receipt.orderId, // Data to encode
                scale: 3, // Scaling factor
                height: 10, // Height of the barcode
            });

            doc.image(barcode, {
                fit: [200, 50],
                align: "center",
            });
        }

        // Footer
        doc.moveDown();
        doc.fontSize(10).text("Thank you!", { align: "center" });

        doc.end();
    } catch (error) {
        console.error("Error generating receipt:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};




export const productAvilability = async (req: Request, res: Response) => {
    const { productId } = req.body;
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId }
        })
        if (!product) {
            res.status(404).json({ message: "Product not found" })
            return;
        }
        res.status(200).json({ message: "Product found", stock: product.stock })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const cancelOrder = async (req: Request, res: Response) => {
    const { orderId } = req.body;
    console.log(orderId)
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { products: true }
        })
        if (!order || order.status === "CANCELLED") {
            res.status(409).json({ message: "Order already Cancelled" })
            return;
        }


        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus_new.CANCELLED
            }
        })
        res.status(204).json({
            message: "Order cancelled successfully",
            order: updatedOrder
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
}


export const getCustomerOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                orderType: OrderType.CUSTOMER,
                status: OrderStatus_new.PENDING,
                paymentStatus: PaymentStatus.PENDING
            },
            select: {
                id: true,
                totalAmount: true,
                paymentStatus: true,
                customerId: true,
                products: {
                    select: {
                        quantity: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                stock: true,
                                category: true,
                                description: true,
                                SKU: true,
                                seasonality: true,
                                shelfLife: true,
                                imageUrls: true,
                            }
                        },
                    }
                },

                customer: {  // Optional: Fetch customer details
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });

        if (!orders.length) {
            res.status(404).json({ message: "No orders found" });
            return
        }

        res.status(200).json({ message: "Orders retrieved", orders });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
