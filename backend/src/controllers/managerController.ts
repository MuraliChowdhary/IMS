// src/controllers/managerController.ts

import { Request, Response } from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()

const upload = multer({ dest: "uploads/" });

export const uploadMiddleware = upload.single("file");

export const addBulkProducts = async (req: Request, res: Response) => {
  const filePath = req.file?.path;
  if (!filePath) return res.status(400).json({ message: "CSV file is missing" });

  const products: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csv())
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
    .on("end", async () => {
      try {
        const added = await prisma.product.createMany({
          data: products,
        });
        res.status(200).json({ message: "Products added successfully", added });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error inserting products" });
      }
    });
};
