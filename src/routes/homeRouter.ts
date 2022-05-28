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
import { authorize } from "../middlewares/authorize";

const router = Router();
router.route("/logo").post([authorize], uploadLogo).get(getLogo);
router.route("/logo/:id").put([authorize], updateLogoById);
router.route("/slider-image").get(getAllSliders).post(uploadSliderImage);
router
  .route("/slider-image/:sliderId")
  .get(getSliderById)
  .post(updateSliderImageById);

export { router as homeRouter };
