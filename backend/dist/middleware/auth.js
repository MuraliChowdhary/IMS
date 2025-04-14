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
exports.checkBlacklist = exports.handleValidationErrors = exports.validateCustomer = exports.validationLogin = exports.validationRegister = exports.checkAuth = void 0;
// src/middleware/auth.ts
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const redisClient_1 = __importDefault(require("../redisClient"));
console.log("ENV : " + process.env.JWT_SECRET);
const checkAuth = (roles) => {
    return (req, res, next) => {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        try {
            console.log(process.env.JWT_SECRET);
            const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            console.log("User" + user);
            console.log(user.role + " " + roles + " " + "user : " + user);
            if (!roles.includes(user.role)) {
                res.status(403).json({ message: "User Not Found | Forbidden" });
                return;
            }
            // Attach the user to the request object
            if (!req.user) {
                req.user = {};
            }
            req.user.id = user.id;
            next();
        }
        catch (error) {
            console.log("error" + error);
            res.status(403).json({ message: "Forbidden | Session Expired reLogin" });
            return;
        }
    };
};
exports.checkAuth = checkAuth;
exports.validationRegister = [
    (0, express_validator_1.body)("username")
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
        .isLength({ max: 30 }).withMessage("Username must be at most 30 characters long"),
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .isLength({ max: 30 }).withMessage("Password must be at most 30 characters")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one digit")
        .matches(/[@#$%^&*()]/).withMessage("Password must contain at least one special character"),
];
exports.validationLogin = [
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .isLength({ max: 30 }).withMessage("Password must be at most 30 characters")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one digit")
        .matches(/[@#$%^&*()]/).withMessage("Password must contain at least one special character"),
];
exports.validateCustomer = [
    (0, express_validator_1.body)("username")
        .notEmpty().withMessage("username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
        .isLength({ max: 30 }).withMessage("Username must be at most 30 characters long"),
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .isLength({ max: 30 }).withMessage("Password must be at most 30 characters")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one digit")
        .matches(/[@#$%^&*()]/).withMessage("Password must contain at least one special character"),
    (0, express_validator_1.body)("phone")
        .isLength({ min: 10 }).withMessage("Phone number must be at least10 digits long")
        .isLength({ max: 15 }).withMessage("Phone number must be at most 15 digits long"),
];
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
const checkBlacklist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    // Check if the token is blacklisted
    const isBlacklisted = yield redisClient_1.default.get(token);
    if (isBlacklisted) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    next();
});
exports.checkBlacklist = checkBlacklist;
