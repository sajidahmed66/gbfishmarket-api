import { Router } from "express";
import {
  createAnnouncement,
  updateAnnounceMentById,
  deleteAnnouncementById,
  getAllAnnouncement,
  getAnnouncementById,
} from "../controllers/announcement.controllter";
import { authorize } from "../middlewares/authorize";
const router = Router();

router.route("/").post([authorize], createAnnouncement).get(getAllAnnouncement);

router
  .route("/:id")
  .get(getAnnouncementById)
  .put([authorize], updateAnnounceMentById)
  .delete([authorize], deleteAnnouncementById);

export { router as announcementRouter };
