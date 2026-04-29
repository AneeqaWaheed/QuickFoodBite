import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  productCountController,
  productFilterController,
  productImageController,
  productListController,
  searchProductController,
  singleProductController,
  updateProductController,
} from "../controllers/productController.js";
// import formidable from "express-formidable";
const router = express.Router();

//routes
//create product
router.post("/create-product", requireSignIn, isAdmin, createProductController);
//update product
// router.put(
//   "/update-product/:pid",
//   requireSignIn,
//   isAdmin,
//   formidable(),
//   updateProductController
// );
// //get products
router.get("/get-product", getProductController);
// //get single product
router.get("/single-product/:id", singleProductController);
// //get product image
router.get("/product-image/:pid", productImageController);
// //get delete
router.delete("/delete-product/:id", deleteProductController);
// update product
router.put("/update-product/:prId", updateProductController);
// //filter product
// router.get("/product-filters", productFilterController);
// //product count
// router.get("/product-count", productCountController);
// //product per page
router.get("/product-list", productListController);
// //search Product
// router.get("/search/:keyword", searchProductController);
export default router;
