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
import { listInventory } from "./controllers/manager";
import { checkAuth } from "./middleware/auth";

 
dotenv.config();
 
const app = express();

app.use(express.json());
const allowedOrigins = [
  'https://inventorysolutions.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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



app.get("/api/v1/inventory/items",checkAuth(["MANAGER"]), listInventory);




export default app;
