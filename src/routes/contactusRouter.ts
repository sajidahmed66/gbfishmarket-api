import { Router } from "express";
const router = Router();

router.route("/").get().post();

export { router as contactusRouter };
