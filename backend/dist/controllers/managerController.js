"use strict";
// src/controllers/managerController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBulkProducts = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)({ dest: "uploads/" });
exports.uploadMiddleware = upload.single("file");
const addBulkProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (!filePath)
        return res.status(400).json({ message: "CSV file is missing" });
    const products = [];
    fs_1.default.createReadStream(filePath)
        .pipe((0, csv_parser_1.default)())
        .on("data", (row) => {
        products.push({
            name: row.name,
            price: parseFloat(row.price),
            stock: parseInt(row.stock),
            category: row.category,
            SKU: row.SKU,
            isPerishable: row.isPerishable === "true",
            seasonality: row.seasonality,
            shelfLife: parseInt(row.shelfLife || "0"),
            imageUrls: row.imageUrls ? row.imageUrls.split(";") : [],
            description: row.description,
            supplierId: row.supplierId || null,
        });
    })
        .on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const added = yield prisma.product.createMany({
                data: products,
            });
            res.status(200).json({ message: "Products added successfully", added });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error inserting products" });
        }
    }));
});
exports.addBulkProducts = addBulkProducts;
