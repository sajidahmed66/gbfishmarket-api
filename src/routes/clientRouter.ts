import { Router } from "express";
import {
  createClient,
  getAllClient,
  getClientById,
  updateClientById,
  deleteClientById,
} from "../controllers/client.controller";
import { authorize } from "../middlewares/authorize";
const router = Router();

router.route("/").get(getAllClient).post([authorize], createClient);
router
  .route("/:id")
  .get(getClientById)
  .put([authorize], updateClientById)
  .delete([authorize], deleteClientById);
export { router as clientRouter };
