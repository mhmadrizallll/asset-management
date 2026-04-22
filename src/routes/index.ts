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
import { authMiddleware } from "../middlewares/auth.middleware";
import authRoutes from "../modules/auth/auth.route";
import vendorRoutes from "../modules/vendor/vendor.route";
import purchaseRoutes from "../modules/purchase/purchase.route";
import warrantyRoutes from "../modules/warranty/warranty.route";
import maintenanceRoutes from "../modules/maintenance/maintenance.route";
import reportRoutes from "../modules/report/report.route";

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
router.use("/auth", authRoutes);
router.use("/vendors", vendorRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/warranties", warrantyRoutes);
router.use("/maintenances", maintenanceRoutes);
router.use("/reports", reportRoutes);

export default router;
