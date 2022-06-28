import { Router } from "express";
import {
  getAllContactMessage,
  postContactMessage,
} from "../controllers/contactus.controller";
import { authorize } from "../middlewares/authorize";
const router = Router();

router
  .route("/")
  .get([authorize], getAllContactMessage)
  .post(postContactMessage);

export { router as contactusRouter };
