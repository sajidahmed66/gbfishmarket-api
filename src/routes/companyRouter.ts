import { Router } from "express";
const router = Router();
import {
  getCompanyProfile,
  createCompanyProfile,
  updateCompanyProfile,
} from "../controllers/company.controller";

router.route("/").get(getCompanyProfile).post(createCompanyProfile);
router.route("/:id").put(updateCompanyProfile);

export { router as companyRouter };
