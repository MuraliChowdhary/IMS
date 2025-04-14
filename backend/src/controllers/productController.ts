import { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const uploadCSVProducts = async (req: Request, res: Response) => {
  const filePath = req.file?.path;

  if (!filePath) {
     res.status(400).json({ message: 'CSV file is required' });
     return
  }


  const products: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
        if (!row.name || !row.price || !row.stock) return; // basic validation
      products.push({
        name: row.name,
        price: parseFloat(row.price),
        stock: parseInt(row.stock),
        category: row.category,
        SKU: row.SKU,
        isPerishable: row.isPerishable === 'true',
        seasonality: row.seasonality,
        shelfLife: parseInt(row.shelfLife || '0'),
        imageUrls: row.imageUrls ? row.imageUrls.split(';') : [],
        description: row.description,
        supplierId: row.supplierId || null
      });
    })
    .on('end', async () => {
      try {
        const added = await prisma.product.createMany({
          data: products,
          skipDuplicates: true
        });
        res.status(200).json({ message: 'Products added successfully', added });
      } catch (err) {
        console.error('Insert Error:', err);
        res.status(500).json({ message: 'Failed to insert products' });
      } finally {
        if (filePath) {
          try {
            fs.unlinkSync(filePath);
          } catch (unlinkError) {
            console.error('Error deleting file:', unlinkError);
          }
        }
      }
    });
};
