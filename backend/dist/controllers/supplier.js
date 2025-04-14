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
exports.updateShippingStatus = exports.initiateQualityCheck = exports.updateProductionStatus = exports.reviewPriceProposal = exports.proposePriceForOrder = exports.retriveOrders = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const retriveOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const retriveorder = yield prisma.order.findMany({
            where: { supplierId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }
        });
        if (!retriveorder) {
            res.status(404).json({ message: "No orders found" });
            return;
        }
        res.status(200).json(retriveorder);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.retriveOrders = retriveOrders;
// export const getProductById = async (req:Request,res:Response)=>{
//        const { orderId } = req.params;
//        if(orderId == null){
//         res.status(404).json({message:"Order id not retrived"})
//        }
//        try{
//         const product = await prisma.orderProduct.findFirst({
//             where:{orderId:orderId}
//         })
//         if(!product){
//             res.status(404).json({message:"Product not found"})
//             return 
//         }
//         res.status(200).json(product)
//        }catch(err){
//         console.error(err)
//         res.status(500).json({error:"Internal server error"})
//        }
// }
// export const requestProducts = async (req:Request,res:Response)=>{
//     const {orderId,productId,priceAmount}=req.body;
//     try{
//         const requesttheproducts = await prisma.order.findUnique({
//             where:{id:orderId},
//             include:{products:true}
//         })
//     }
//     catch(err){
//         console.error(err);
//         res.status(500).json({error:"Internal server error"})
//     }
// }
//  export const priceUpdate = async (req: Request, res: Response) => {
//     const {supplierId,productId,newPrice,quantity} = req.body;
//     const product = await prisma.product.findFirst({where:{id:productId}});
//     if(!product){
//         res.status(404).json({message:"Product not found"});
//         return
//     }
//     if(product.supplierId !== supplierId){
//         res.status(403).json({message:"Supplier not authorized to update this product"});
//     }
//     try{
//         const updatePrice = await prisma.product.update({
//             where:{id:productId},
//             data:{price:newPrice}
//         })
//         res.status(200).json({message:"Price updated successfully",updatePrice});
//     }catch(err){
//         res.status(500).json({message:"Internal Server Error"});
//     }
//  }
//  export const sendSample = async(req:Request,res:Response)=>{
//         const {productId,sample}=req.body;
//         const product = await prisma.product.findFirst({where:{id:productId}});
//         if(!product){
//             res.status(404).json({message:"Product not found"});
//             return;
//             }
//             try{
//                 const qcRecord = await prisma.qualityControl.create({
//                     data: {
//                       productId,
//                       sampleDetails: sample,
//                       status: QCStatus.PENDING,
//                     },
//                   });
//                     res.status(201).json({message:"Sample sent successfully",qcRecord});
//             }
//             catch(err){
//                 res.status(500).json({message:"Internal Server Error"});
//             }
//  }
//  export const delivery= async(req:Request,res:Response)=>{
//     const {orderId,delivery}=req.body;
//     const order = await prisma.order.findFirst({
//         where: { id: orderId },
//         include: { products: true }
//     });
//     if (!order || order.status !== OrderStatus.APPROVED) {
//          res.status(400).json({ message: 'Order not approved or does not exist.' });
//          return
//       }
//     try{
//         const deliveryOrder = await prisma.order.update({
//             where:{id:orderId},
//             data:{status:OrderStatus.DELIVERED}
//         })
//         for (let orderProduct of order.products) {
//             await prisma.inventory.update({
//               where: { id: orderProduct.productId },
//               data: { quantity: { increment: orderProduct.quantity } },
//             });
//           }
//         res.status(200).json({message:"Order delivered successfully",deliveryOrder});
//     }
//     catch(err){
//         res.status(500).json({message:"Internal Server Error"});
//     }
//  }
// Supplier reviews and proposes price
const proposePriceForOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { orderId } = req.params;
    const { proposedPrices, expectedDeliveryDate } = req.body;
    console.log("Order ID:", orderId);
    console.log("Request Body:", req.body);
    try {
        // Ensure the date is in proper format (ISO 8601)
        const formattedDate = new Date(expectedDeliveryDate.split('-').reverse().join('-'));
        if (isNaN(formattedDate.getTime())) {
            res.status(400).json({ error: 'Invalid date format. Use DD-MM-YYYY.' });
            return;
        }
        // Update the order with the proposed prices
        const order = yield prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'PRICE_PROPOSED', // Assuming the enum or status value is correctly defined
                expectedDeliveryDate: formattedDate,
                products: {
                    updateMany: {
                        where: { orderId },
                        data: {
                            proposedPrice: proposedPrices, // Ensure this is handled as a number or valid string
                            negotiationStatus: 'PRICE_PROPOSED',
                        },
                    },
                },
                statusHistory: {
                    create: {
                        status: 'PRICE_PROPOSED',
                        changedBy: req.user ? req.user.id : "unknown",
                        comments: `Price proposed by supplier: ${(_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "unknown"}`,
                    },
                },
            },
        });
        res.json(order);
    }
    catch (error) {
        console.error("Error proposing price:", error);
        res.status(500).json({ error: 'Failed to propose price', details: error instanceof Error ? error.message : error });
    }
});
exports.proposePriceForOrder = proposePriceForOrder;
// Manager reviews price proposal
const reviewPriceProposal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { decision, negotiationNotes } = req.body;
    try {
        const newStatus = decision === 'APPROVE' ? 'PRICE_APPROVED' : 'PRICE_NEGOTIATING';
        const order = yield prisma.order.update({
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
                        changedBy: req.user ? req.user.id : "unknown",
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to process price review' });
    }
});
exports.reviewPriceProposal = reviewPriceProposal;
// Supplier updates production status
const updateProductionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { status, comments } = req.body;
    try {
        const order = yield prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'IN_PRODUCTION',
                orderNotes: comments,
                statusHistory: {
                    create: {
                        status: 'IN_PRODUCTION',
                        changedBy: req.user ? req.user.id : "unknown",
                        comments
                    }
                }
            }
        });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update production status' });
    }
});
exports.updateProductionStatus = updateProductionStatus;
// Quality Control Process
const initiateQualityCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { parameters } = req.body;
    try {
        const order = yield prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'QC_PENDING',
                qualityChecks: {
                    create: {
                        checkedBy: req.user ? req.user.id : "unknown",
                        status: 'PENDING',
                        parameters
                    }
                },
                statusHistory: {
                    create: {
                        status: 'QC_PENDING',
                        changedBy: req.user ? req.user.id : "unknown",
                        comments: 'Quality check initiated'
                    }
                }
            }
        });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to initiate quality check' });
    }
});
exports.initiateQualityCheck = initiateQualityCheck;
const updateShippingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { status, trackingNumber, shippingDetails } = req.body;
    console.log('Order ID:', orderId);
    console.log('Shipping Status:', status);
    try {
        const order = yield prisma.order.update({
            where: { id: orderId },
            data: {
                status: status,
                trackingNumber,
                shippingDetails, // Pass the object directly
                actualDeliveryDate: status === 'DELIVERED' ? new Date() : undefined,
                statusHistory: {
                    create: {
                        status,
                        changedBy: req.user ? req.user.id : "unknown",
                        comments: `Shipping status updated to ${status}`
                    }
                }
            }
        });
        res.json(order);
    }
    catch (error) {
        console.error('Error updating shipping status:', error);
        res.status(500).json({ error: 'Failed to update shipping status' });
    }
});
exports.updateShippingStatus = updateShippingStatus;
