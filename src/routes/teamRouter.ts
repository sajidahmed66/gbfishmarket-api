import { Router } from "express";
const router = Router();
import {
  createTeamMember,
  getAllTeamMember,
  deleteTeamMemberById,
  updateTeamMemberById,
} from "../controllers/team.controller";
import { authorize } from "../middlewares/authorize";

router.route("/").get(getAllTeamMember).post([authorize], createTeamMember);

router
  .route("/:id")
  .put([authorize], updateTeamMemberById)
  .delete([authorize], deleteTeamMemberById);

export { router as teamRouter };
