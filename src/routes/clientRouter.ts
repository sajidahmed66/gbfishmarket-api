import { Router } from "express";
import {
  createClient,
  getAllClient,
  getClientById,
  updateClientById,
  deleteClientById,
} from "../controllers/client.controller";
const router = Router();

router.route("/").get(getAllClient).post(createClient);
router
  .route("/:id")
  .get(getClientById)
  .put(updateClientById)
  .delete(deleteClientById);
export { router as clientRouter };
