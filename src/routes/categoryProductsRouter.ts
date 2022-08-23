import { Router } from "express";
import {
  createCategoryProduct,
  updateCategoryProductById,
  deleteCategoryProductById,
  getAllCategoryProduct,
  getCategoryProductById,
} from "../controllers/categoryProducts.controller";
import { authorize } from "../middlewares/authorize";
const router = Router();

router.route("/").post([authorize], createCategoryProduct).get(getAllCategoryProduct);

router
  .route("/:id")
  .get([authorize],getCategoryProductById)
  .put([authorize], updateCategoryProductById)
  .delete([authorize], deleteCategoryProductById);

export { router as categoryProductsRouter };