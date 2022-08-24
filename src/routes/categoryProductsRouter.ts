import { Router } from "express";
import {
  createCategoryProduct,
  updateCategoryProductById,
  getAllCategoryProduct,
} from "../controllers/categoryProducts.controller";
import { authorize } from "../middlewares/authorize";
const router = Router();

router
  .route("/")
  .post([authorize], createCategoryProduct)
  .get(getAllCategoryProduct);

router.route("/:id").put([authorize], updateCategoryProductById);

export { router as categoryProductsRouter };
