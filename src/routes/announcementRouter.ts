import { Router } from "express";
import {
  createAnnouncement,
  updateAnnounceMentById,
  deleteAnnouncementById,
  getAllAnnouncement,
} from "../controllers/announcement.controllter";
const router = Router();

router.route("/").post(createAnnouncement).get(getAllAnnouncement);

router.route("/:id").put(updateAnnounceMentById).delete(deleteAnnouncementById);

export { router as announcementRouter };
