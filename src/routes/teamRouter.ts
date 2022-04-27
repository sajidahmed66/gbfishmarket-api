import { Router } from "express";
const router = Router();
import {
  createTeamMember,
  getAllTeamMember,
  deleteTeamMemberById,
  updateTeamMemberById,
} from "../controllers/team.controller";

router.route("/").get(getAllTeamMember).post(createTeamMember);

router.route("/:id").put(updateTeamMemberById).delete(deleteTeamMemberById);

export { router as teamRouter };
