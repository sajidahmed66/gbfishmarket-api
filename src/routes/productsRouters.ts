import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from "../controllers/products.controller";
const router = Router();
import { authorize } from "../middlewares/authorize";

router.route("/").post([authorize], createProduct).get(getAllProducts);
router
  .route("/:id")
  .get(getProductById)
  .put([authorize], updateProductById)
  .delete([authorize], deleteProductById);

export { router as productsRouter };
