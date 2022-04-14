import { Router } from "express";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  //   updateUser,
} from "../controllers/user.controller";
import { role, getRole } from "../controllers/roleUser.controller";
import { logIn } from "../controllers/auth.controller";
import { authorize } from "../middlewares/authorize";
const router = Router();

// auth or login
// add+ update+delete + list of total admin sub-Admin vai super admin to database
//
router.route("/").get(getAllUsers).post(addUser);
router.route("/role").get([authorize], getRole).post(role);
router.route("/login").post(logIn);
router.route("/:userId").get(getUserById).put(updateUser).delete(deleteUser);
// rooute that adds image

export { router as userRouter };
