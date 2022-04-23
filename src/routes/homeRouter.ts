import { Router } from "express";
import { uploadLogo } from "../controllers/logo.controller";
import { getAllSliders, getSliderById, updateSliderImageById, uploadSliderImage } from "../controllers/slider.controller";
// import multer from "multer";
const router = Router();
// const upload = multer({
//   dest: "src/uploads/",
// });
router.route("/logo").post(uploadLogo);
router.route("/slider-image").get(getAllSliders).post(uploadSliderImage);
router.route("/slider-image/:sliderId").get(getSliderById).post(updateSliderImageById);

export { router as homeRouter };
