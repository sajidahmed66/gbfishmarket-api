import { Router, Request, Response } from "express";
import {
  addUser,
  getAllUsers,
  getUserById,
  //   updateUser,
} from "../controllers/user.controller";
import { role, getRole } from "../controllers/roleUser.controller";
const router = Router();

// auth or login
// add+ update+delete + list of total admin sub-Admin vai super admin to database
//
router.route("/").get(getAllUsers).post(addUser);
router.route("/:userId").get(getUserById);
// .put(updateUser);

router.route("/role").get(getRole).post(role);

export { router as userRouter };
