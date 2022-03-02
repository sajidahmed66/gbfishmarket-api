import "dotenv/config";
import express, { Application } from "express";
import { routes } from "./middlewares/route";
import { main } from "./utils/dbConfig";

const app: Application = express();

//middlewares
routes(app);

const port = process.env.PORT || 5000;
//dbconnections
main().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
});
