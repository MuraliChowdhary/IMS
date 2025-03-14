// src/routes/manager.ts
import { Router } from "express";
import { checkAuth } from "../middleware/auth";
import { uploadImage, uploadMiddleware } from "../controllers/uploadController";

const router = Router();
// router.get("/inventory", checkAuth(["MANAGER"]), listInventory);
// router.post("/inventory", checkAuth(["MANAGER"]), addInventory);
// router.put("/inventory/:id", checkAuth(["MANAGER"]), updateInventory);
// router.delete("/inventory/:id", checkAuth(["MANAGER"]), deleteInventory);

// router.get("/reorder", checkAuth(["MANAGER"]), viewLowStock);
// router.post("/reorder", checkAuth(["MANAGER"]), createReorder);

import { listInventory, getInventoryItem, addInventoryItem, updateInventory,reviewPriceProposal,addProduct, addProducts, getProducts, getProductById, updateProduct, lowstock, checkInventoryLevels, qualityCheck, markOrderAsDelivered } from "../controllers/manager";
router.get("/inventory", checkAuth(["MANAGER"]), listInventory);
router.get("/inventoryItem/:id", checkAuth(["MANAGER"]), getInventoryItem);
router.post("/addinventory", checkAuth(["MANAGER"]), addInventoryItem); 
router.put("/inventory/:id", checkAuth(["MANAGER"]), updateInventory);
// router.delete("/inventory/:id", checkAuth(["MANAGER"]), deleteInventory);


router.post("/upload", uploadMiddleware, uploadImage);

router.post("/product", checkAuth(["MANAGER"]), addProduct);
router.post("/products", checkAuth(["MANAGER"]), addProducts);
router.get("/products", checkAuth(["MANAGER"]), getProducts);
router.post("/product/:id", checkAuth(["MANAGER"]), getProductById);
router.put("/product/:id", checkAuth(["MANAGER"]), updateProduct);

 
router.get("/lowstock", checkAuth(["MANAGER"]), lowstock);
router.post("/reorder", checkAuth(["MANAGER"]), checkInventoryLevels);
router.patch("/pricedecision/:orderId",checkAuth(["MANAGER"]),reviewPriceProposal)
router.patch("/qc/:orderId",checkAuth(["MANAGER"]),qualityCheck);
router.patch("/deliveredConfirmation/:orderId",checkAuth(["MANAGER"]),markOrderAsDelivered)
export default router;
