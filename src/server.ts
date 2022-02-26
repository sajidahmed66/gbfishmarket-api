import "dotenv/config";
import express, { Application } from "express";
import { routes } from "./middlewares/route";
import { main } from "./utils/dbConfig";
const app: Application = express();
main();
routes(app);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
