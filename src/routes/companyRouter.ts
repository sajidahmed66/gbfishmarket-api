import { Router } from "express";
import { authorize } from "../middlewares/authorize";
const router = Router();
import {
  getCompanyProfile,
  createCompanyProfile,
  updateCompanyProfile,
} from "../controllers/company.controller";

router
  .route("/")
  .get(getCompanyProfile)
  .post([authorize], createCompanyProfile);
router.route("/:id").put([authorize], updateCompanyProfile);

export { router as companyRouter };
