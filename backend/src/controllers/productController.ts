import { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const uploadCSVProducts = async (req: Request, res: Response) => {
  if (!req.file) {
     res.status(400).json({ message: 'No file uploaded' });
     return
  }

  const filePath = req.file.path;
  const products: any[] = [];
  const errors: string[] = [];

  try {
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({
          mapHeaders: ({ header }) => header.trim(),
          mapValues: ({ value, header }) => {
            // Convert specific fields to proper types
            if (['price', 'stock', 'shelfLife'].includes(header)) {
              return value ? parseFloat(value) : null;
            }
            if (header === 'isPerishable') {
               value?.toLowerCase() === 'true';
            }
            if (header === 'imageUrls' && value) {
               value.split(';').map((url: string) => url.trim());
            }
             value?.trim() || null;
             return
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
          } else if (products.length === 0) {
            reject(new Error('No valid products found in CSV'));
          } else {
            resolve();
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    const result = await prisma.product.createMany({
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
    return

  } catch (error: any) {
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
    return
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};