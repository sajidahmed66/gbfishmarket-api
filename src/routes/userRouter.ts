import { Router, Request, Response } from "express";
import { user } from "../controllers/user.controller";
import { role } from "../controllers/roleUser.controller";
const router = Router();

// auth or login
// add+ update+delete + list of total admin sub-Admin vai super admin to database
//
router.route("/").post(user);
router.route("/role").post(role);
const userRouter = router;
export default userRouter;
