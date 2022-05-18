import { Router } from "express";
import {
  uploadLogo,
  getLogo,
  updateLogoById,
} from "../controllers/logo.controller";
import {
  getAllSliders,
  getSliderById,
  updateSliderImageById,
  uploadSliderImage,
} from "../controllers/slider.controller";

const router = Router();
router.route("/logo").post(uploadLogo).get(getLogo);
router.route("/logo/:id").put(updateLogoById);
router.route("/slider-image").get(getAllSliders).post(uploadSliderImage);
router
  .route("/slider-image/:sliderId")
  .get(getSliderById)
  .post(updateSliderImageById);

export { router as homeRouter };
