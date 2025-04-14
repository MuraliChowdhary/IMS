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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Define the Prisma middleware globally
prisma.$use((params, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the model is `Inventory` and the operation is `update`
    if (params.model === 'Inventory' && params.action === 'update') {
        const inventoryId = params.args.where.id;
        // Fetch the updated inventory data
        const updatedInventory = yield prisma.inventory.findUnique({
            where: { id: inventoryId },
        });
        if (updatedInventory) {
            // Update the related product stock
            yield prisma.product.update({
                where: { id: updatedInventory.productId },
                data: { stock: updatedInventory.quantity },
            });
        }
    }
    // Proceed to the next middleware or operation
    return next(params);
}));
// Middleware to sync inventory and product stock
const SyncInventoryandProduct = (req, res, next) => {
    // Move to the next middleware or route handler
    next();
};
exports.default = SyncInventoryandProduct;
