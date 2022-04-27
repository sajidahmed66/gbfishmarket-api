import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from "../controllers/products.controller";
const router = Router();

router.route("/").post(createProduct).get(getAllProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(updateProductById)
  .delete(deleteProductById);

export { router as productsRouter };
