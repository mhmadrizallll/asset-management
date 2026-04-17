import { Router } from "express";
import productRoutes from "../modules/product/product.route";
import transactionRoutes from "../modules/transaction/transaction.route";
import dashboardRoutes from "../modules/dashboard/dashboard.route";
import categoryRoutes from "../modules/category/category.route";
import productTypeRoutes from "../modules/product-type/productType.route";
import locationRoutes from "../modules/location/location.route";
import employeeRoutes from "../modules/employee/employee.route";
import productLocationRoutes from "../modules/product-location/productLocation.route";
import assetLogRoutes from "../modules/asset-log/assetLog.route";

const router = Router();

router.use("/products", productRoutes);
router.use("/transactions", transactionRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/categories", categoryRoutes);
router.use("/product-types", productTypeRoutes);
router.use("/locations", locationRoutes);
router.use("/employees", employeeRoutes);
router.use("/product-locations", productLocationRoutes);
router.use("/asset-logs", assetLogRoutes);

export default router;
