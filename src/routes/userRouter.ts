import { Router, Request, Response } from "express";
import { user } from "../controllers/user.controller";
const router = Router();

// auth or login
// add+ update+delete + list of total admin sub-Admin vai super admin to database
//
router.route("/").get(user);
const userRouter = router;
export default userRouter;
