// src/middleware/auth.ts
import 'dotenv/config';
import { Role, SupplierRole } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import redisClient from "../redisClient";
// Augmenting the `Request` type to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadWithRole; // user will be optional since it might not be set in some routes
    }
  }
}


console.log("ENV : " + process.env.JWT_SECRET);
interface JwtPayloadWithRole extends JwtPayload {
  id: string;
  role: string;
}

export const checkAuth = (roles: (Role | SupplierRole)[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];


    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return
    }

    try {
      console.log(process.env.JWT_SECRET)
      const user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadWithRole;
      console.log("User" + user);

      console.log(user.role + " " + roles + " " + "user : " + user);
      if (!roles.includes(user.role as Role | SupplierRole)) {
        res.status(403).json({ message: "User Not Found | Forbidden" });
        return
      }

      // Attach the user to the request object
      if (!req.user) {
        req.user = {} as JwtPayloadWithRole;
      }
      req.user.id = user.id;

      next();
    } catch (error) {
      console.log("error" + error)
      res.status(403).json({ message: "Forbidden | Session Expired reLogin" });
      return
    }
  };
};

export const validationRegister = [
  body("username")
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
    .isLength({ max: 30 }).withMessage("Username must be at most 30 characters long"),
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .isLength({ max: 30 }).withMessage("Password must be at most 30 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one digit")
    .matches(/[@#$%^&*()]/).withMessage("Password must contain at least one special character"),
];



export const validationLogin = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .isLength({ max: 30 }).withMessage("Password must be at most 30 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one digit")
    .matches(/[@#$%^&*()]/).withMessage("Password must contain at least one special character"),
];

export const validateCustomer = [
  body("username")
    .notEmpty().withMessage("username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
    .isLength({ max: 30 }).withMessage("Username must be at most 30 characters long"),
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .isLength({ max: 30 }).withMessage("Password must be at most 30 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one digit")
    .matches(/[@#$%^&*()]/).withMessage("Password must contain at least one special character"),
  body("phone")
    .isLength({ min: 10 }).withMessage("Phone number must be at least10 digits long")
    .isLength({ max: 15 }).withMessage("Phone number must be at most 15 digits long"),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};




export const checkBlacklist = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Check if the token is blacklisted
  const isBlacklisted = await redisClient.get(token);

  if (isBlacklisted) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  next();
};





