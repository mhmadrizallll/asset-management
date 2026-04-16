import { Router } from "express";
import productRoutes from "../modules/product/product.route";
import transactionRoutes from "../modules/transaction/transaction.route";
import dashboardRoutes from "../modules/dashboard/dashboard.route";
import categoryRoutes from "../modules/category/category.route";
import productTypeRoutes from "../modules/product-type/productType.route";

const router = Router();

router.use("/products", productRoutes);
router.use("/transactions", transactionRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/categories", categoryRoutes);
router.use("/product-types", productTypeRoutes);

export default router;
