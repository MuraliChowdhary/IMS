// app.ts
import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";

// Import Routes
import adminRoutes from "./routes/admin";
import managerRoutes from "./routes/manager";
import salesRoutes from "./routes/sales";
import supplierRoutes from "./routes/supplier";
import customerRoutes from "./routes/customer";
import cashierRoutes from "./routes/cashier";
import authRoutes from "./routes/authRoutes";

 
dotenv.config();
 
const app = express();

app.use(express.json());
const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    'https://inventorysolutions.vercel.app', 
    'http://localhost:5173'
  ];
  
  const origin = req.headers.origin;

  // Set Access-Control-Allow-Origin if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Set other CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
     res.status(200).end();
     return
  }

   next();
   return
};

// Apply the middleware
app.use(corsMiddleware);

app.use(morgan("dev"));
app.use(helmet());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to the Inventory Management System API!" });
});


app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/cashier", cashierRoutes);
app.use("/api/auth", authRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

app.post("/api/payment-sucess",(req:Request,res:Response)=>{
      const responseBody = req.body;
      console.log(responseBody)
     
      res.status(200).json({"Messagr:":responseBody})
})


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});





export default app;
