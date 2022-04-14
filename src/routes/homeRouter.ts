import { Router } from "express";
import { uploadLogo } from "../controllers/logo.controller";
// import multer from "multer";
const router = Router();
// const upload = multer({
//   dest: "src/uploads/",
// });
router.route("/logo").post(uploadLogo);
// router.route("/slider").get().post();

export { router as homeRouter };
