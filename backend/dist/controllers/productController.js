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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCSVProducts = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const uploadCSVProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    const filePath = req.file.path;
    const products = [];
    const errors = [];
    try {
        yield new Promise((resolve, reject) => {
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)({
                mapHeaders: ({ header }) => header.trim(),
                mapValues: ({ value, header }) => {
                    // Convert specific fields to proper types
                    if (['price', 'stock', 'shelfLife'].includes(header)) {
                        return value ? parseFloat(value) : null;
                    }
                    if (header === 'isPerishable') {
                        (value === null || value === void 0 ? void 0 : value.toLowerCase()) === 'true';
                    }
                    if (header === 'imageUrls' && value) {
                        value.split(';').map((url) => url.trim());
                    }
                    (value === null || value === void 0 ? void 0 : value.trim()) || null;
                    return;
                }
            }))
                .on('data', (row) => {
                // Validate required fields
                if (!row.name || row.price == null || row.stock == null || !row.category) {
                    errors.push(`Missing required fields in row: ${JSON.stringify(row)}`);
                    return;
                }
                // Additional validation
                if (isNaN(row.price) || row.price <= 0) {
                    errors.push(`Invalid price (${row.price}) for product: ${row.name}`);
                    return;
                }
                if (isNaN(row.stock) || row.stock < 0) {
                    errors.push(`Invalid stock (${row.stock}) for product: ${row.name}`);
                    return;
                }
                products.push({
                    name: row.name,
                    price: row.price,
                    stock: row.stock,
                    category: row.category,
                    SKU: row.SKU,
                    isPerishable: row.isPerishable || false,
                    seasonality: row.seasonality,
                    shelfLife: row.shelfLife,
                    imageUrls: row.imageUrls || [],
                    description: row.description,
                    supplierId: row.supplierId
                });
            })
                .on('end', () => {
                if (errors.length > 0) {
                    reject(new Error(`Validation failed for ${errors.length} rows`));
                }
                else if (products.length === 0) {
                    reject(new Error('No valid products found in CSV'));
                }
                else {
                    resolve();
                }
            })
                .on('error', (error) => {
                reject(error);
            });
        });
        const result = yield prisma.product.createMany({
            data: products,
            skipDuplicates: true
        });
        res.status(200).json({
            success: true,
            message: 'Products imported successfully',
            importedCount: result.count,
            duplicateCount: products.length - result.count,
            totalRows: products.length
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            errors: errors,
            sampleFormat: {
                requiredFields: ['name (string)', 'price (number)', 'stock (number)', 'category (string)'],
                optionalFields: [
                    'SKU (string)',
                    'isPerishable (boolean)',
                    'seasonality (string)',
                    'shelfLife (number)',
                    'imageUrls (semicolon-separated strings)',
                    'description (string)',
                    'supplierId (string)'
                ],
                example: {
                    name: 'Sample Product',
                    price: 9.99,
                    stock: 100,
                    category: 'Sample Category',
                    supplierId: 'cm77dfehf0002v1osfa2ne9j6'
                }
            }
        });
        return;
    }
    finally {
        if (filePath && fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
    }
});
exports.uploadCSVProducts = uploadCSVProducts;
