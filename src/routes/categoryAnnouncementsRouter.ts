import { Router } from "express";
import {
  createCategoryAnnouncement,
  updateCategoryAnnouncementById,
  deleteCategoryAnnouncementById,
  getAllCategoryAnnouncement,
  getCategoryAnnouncementById,
} from "../controllers/categoryAnnouncements.controller";
import { authorize } from "../middlewares/authorize";
const router = Router();

router.route("/").post([authorize], createCategoryAnnouncement).get(getAllCategoryAnnouncement);

router
  .route("/:id")
  .get([authorize],getCategoryAnnouncementById)
  .put([authorize], updateCategoryAnnouncementById)
  .delete([authorize], deleteCategoryAnnouncementById);

export { router as categoryAnnouncementsRouter };